package OXNsupplements.controller;


import lombok.RequiredArgsConstructor;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart-flavour")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Transactional
public class CartFlavourController {

    private final JdbcTemplate jdbcTemplate;


    /*
     * ============================================================
     * ADD TO CART
     * ============================================================
     */
    @PostMapping("/add")
    public Map<String, Object> addToCart(
            @RequestBody Map<String, Object> request
    ) {

        String customerId =
                String.valueOf(
                        request.get("customerId")
                );

        Long productId =
                toLong(
                        request.get("productId")
                );

        Integer quantity =
                toInteger(
                        request.get("quantity")
                );

        Long flavourId =
                request.get("flavourId") == null
                        ? null
                        : toLong(
                        request.get("flavourId")
                );


        if (productId == null) {
            throw new IllegalArgumentException(
                    "Product ID is required."
            );
        }

        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1."
            );
        }


        /*
         * Validate the parent product.
         */
        Integer productCount =
                jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM products
                        WHERE id = ?
                        """,
                        Integer.class,
                        productId
                );

        if (
                productCount == null ||
                        productCount == 0
        ) {

            throw new IllegalArgumentException(
                    "Product not found."
            );

        }


        /*
         * Validate selected flavour and get exact price.
         */
        BigDecimal itemPrice;

        if (flavourId != null) {

            Map<String, Object> flavour =
                    jdbcTemplate.queryForMap(
                            """
                            SELECT
                                id,
                                product_id,
                                price
                            FROM product_flavours
                            WHERE id = ?
                            """,
                            flavourId
                    );

            Long flavourProductId =
                    ((Number)
                            flavour.get(
                                    "product_id"
                            )).longValue();

            if (
                    !productId.equals(
                            flavourProductId
                    )
            ) {

                throw new IllegalArgumentException(
                        "Selected flavour does not belong to this product."
                );

            }

            itemPrice =
                    (BigDecimal)
                            flavour.get(
                                    "price"
                            );

        } else {

            itemPrice =
                    jdbcTemplate.queryForObject(
                            """
                            SELECT price
                            FROM products
                            WHERE id = ?
                            """,
                            BigDecimal.class,
                            productId
                    );

        }


        Long cartId =
                getOrCreateCart(
                        customerId
                );


        /*
         * Existing item:
         * exact parent product + exact flavour.
         */
        Long cartItemId =
                findCartItemId(
                        cartId,
                        productId,
                        flavourId
                );


        BigDecimal subtotal =
                itemPrice.multiply(
                        BigDecimal.valueOf(
                                quantity
                        )
                );


        if (cartItemId != null) {

            jdbcTemplate.update(
                    """
                    UPDATE cart_items
                    SET
                        quantity = quantity + ?,
                        subtotal = subtotal + ?
                    WHERE id = ?
                    """,
                    quantity,
                    subtotal,
                    cartItemId
            );

        } else {

            jdbcTemplate.update(
                    """
                    INSERT INTO cart_items
                    (
                        cart_id,
                        product_id,
                        flavour_id,
                        quantity,
                        subtotal
                    )
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    cartId,
                    productId,
                    flavourId,
                    quantity,
                    subtotal
            );

        }


        recalculateCart(
                cartId
        );


        return buildCart(
                customerId,
                cartId
        );
    }


    /*
     * ============================================================
     * GET CART
     * ============================================================
     */
    @GetMapping("/{customerId}")
    public Map<String, Object> getCart(
            @PathVariable String customerId
    ) {

        Integer count =
                jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM cart
                        WHERE customer_id = ?
                        """,
                        Integer.class,
                        customerId
                );

        if (
                count == null ||
                        count == 0
        ) {

            Map<String, Object> empty =
                    new LinkedHashMap<>();

            empty.put(
                    "id",
                    null
            );

            empty.put(
                    "customerId",
                    customerId
            );

            empty.put(
                    "totalAmount",
                    BigDecimal.ZERO
            );

            empty.put(
                    "items",
                    new ArrayList<>()
            );

            return empty;
        }


        Long cartId =
                jdbcTemplate.queryForObject(
                        """
                        SELECT id
                        FROM cart
                        WHERE customer_id = ?
                        LIMIT 1
                        """,
                        Long.class,
                        customerId
                );


        recalculateCart(
                cartId
        );


        return buildCart(
                customerId,
                cartId
        );
    }


    /*
     * ============================================================
     * UPDATE QUANTITY
     * ============================================================
     */
    @PutMapping("/{customerId}/{productId}")
    public Map<String, Object> updateQuantity(
            @PathVariable String customerId,
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            @RequestParam(
                    required = false
            )
            Long flavourId
    ) {

        if (
                quantity == null ||
                        quantity < 1
        ) {

            return removeFromCart(
                    customerId,
                    productId,
                    flavourId
            );
        }


        Long cartId =
                getExistingCartId(
                        customerId
                );

        if (cartId == null) {

            throw new IllegalArgumentException(
                    "Cart not found."
            );

        }


        Long cartItemId =
                findCartItemId(
                        cartId,
                        productId,
                        flavourId
                );

        if (cartItemId == null) {

            throw new IllegalArgumentException(
                    "Cart item not found."
            );

        }


        BigDecimal itemPrice =
                getCartItemPrice(
                        productId,
                        flavourId
                );


        BigDecimal subtotal =
                itemPrice.multiply(
                        BigDecimal.valueOf(
                                quantity
                        )
                );


        jdbcTemplate.update(
                """
                UPDATE cart_items
                SET
                    quantity = ?,
                    subtotal = ?
                WHERE id = ?
                """,
                quantity,
                subtotal,
                cartItemId
        );


        recalculateCart(
                cartId
        );


        return buildCart(
                customerId,
                cartId
        );
    }


    /*
     * ============================================================
     * REMOVE
     * ============================================================
     *
     * When flavourId is supplied:
     *     remove exact product + flavour.
     *
     * When flavourId is omitted:
     *     remove all variants belonging to that parent product.
     */
    @DeleteMapping("/{customerId}/{productId}")
    public Map<String, Object> removeFromCart(
            @PathVariable String customerId,
            @PathVariable Long productId,
            @RequestParam(
                    required = false
            )
            Long flavourId
    ) {

        Long cartId =
                getExistingCartId(
                        customerId
                );

        if (cartId == null) {

            return getCart(
                    customerId
            );

        }


        if (flavourId == null) {

            jdbcTemplate.update(
                    """
                    DELETE FROM cart_items
                    WHERE cart_id = ?
                      AND product_id = ?
                    """,
                    cartId,
                    productId
            );

        } else {

            jdbcTemplate.update(
                    """
                    DELETE FROM cart_items
                    WHERE cart_id = ?
                      AND product_id = ?
                      AND flavour_id = ?
                    """,
                    cartId,
                    productId,
                    flavourId
            );

        }


        recalculateCart(
                cartId
        );


        return buildCart(
                customerId,
                cartId
        );
    }


    /*
     * ============================================================
     * CLEAR
     * ============================================================
     */
    @DeleteMapping("/{customerId}/clear")
    public void clearCart(
            @PathVariable String customerId
    ) {

        Long cartId =
                getExistingCartId(
                        customerId
                );

        if (cartId == null) {
            return;
        }


        jdbcTemplate.update(
                """
                DELETE FROM cart_items
                WHERE cart_id = ?
                """,
                cartId
        );


        jdbcTemplate.update(
                """
                UPDATE cart
                SET total_amount = 0
                WHERE id = ?
                """,
                cartId
        );
    }


    /*
     * ============================================================
     * CART HELPERS
     * ============================================================
     */
    private Long getOrCreateCart(
            String customerId
    ) {

        Long existing =
                getExistingCartId(
                        customerId
                );

        if (existing != null) {
            return existing;
        }


        jdbcTemplate.update(
                """
                INSERT INTO cart
                (
                    customer_id,
                    total_amount
                )
                VALUES (?, 0)
                """,
                customerId
        );


        return jdbcTemplate.queryForObject(
                """
                SELECT id
                FROM cart
                WHERE customer_id = ?
                ORDER BY id DESC
                LIMIT 1
                """,
                Long.class,
                customerId
        );
    }


    private Long getExistingCartId(
            String customerId
    ) {

        List<Long> ids =
                jdbcTemplate.query(
                        """
                        SELECT id
                        FROM cart
                        WHERE customer_id = ?
                        LIMIT 1
                        """,
                        (
                                rs,
                                rowNum
                        ) ->
                                rs.getLong(
                                        "id"
                                ),
                        customerId
                );

        if (ids.isEmpty()) {
            return null;
        }

        return ids.get(0);
    }


    private Long findCartItemId(
            Long cartId,
            Long productId,
            Long flavourId
    ) {

        List<Long> ids;

        if (flavourId == null) {

            ids =
                    jdbcTemplate.query(
                            """
                            SELECT id
                            FROM cart_items
                            WHERE cart_id = ?
                              AND product_id = ?
                              AND flavour_id IS NULL
                            LIMIT 1
                            """,
                            (
                                    rs,
                                    rowNum
                            ) ->
                                    rs.getLong(
                                            "id"
                                    ),
                            cartId,
                            productId
                    );

        } else {

            ids =
                    jdbcTemplate.query(
                            """
                            SELECT id
                            FROM cart_items
                            WHERE cart_id = ?
                              AND product_id = ?
                              AND flavour_id = ?
                            LIMIT 1
                            """,
                            (
                                    rs,
                                    rowNum
                            ) ->
                                    rs.getLong(
                                            "id"
                                    ),
                            cartId,
                            productId,
                            flavourId
                    );

        }


        if (ids.isEmpty()) {
            return null;
        }

        return ids.get(0);
    }


    private BigDecimal getCartItemPrice(
            Long productId,
            Long flavourId
    ) {

        if (flavourId != null) {

            return jdbcTemplate.queryForObject(
                    """
                    SELECT price
                    FROM product_flavours
                    WHERE id = ?
                    """,
                    BigDecimal.class,
                    flavourId
            );

        }


        return jdbcTemplate.queryForObject(
                """
                SELECT price
                FROM products
                WHERE id = ?
                """,
                BigDecimal.class,
                productId
        );
    }


    private void recalculateCart(
            Long cartId
    ) {

        BigDecimal total =
                jdbcTemplate.queryForObject(
                        """
                        SELECT
                            COALESCE(
                                SUM(subtotal),
                                0
                            )
                        FROM cart_items
                        WHERE cart_id = ?
                        """,
                        BigDecimal.class,
                        cartId
                );


        jdbcTemplate.update(
                """
                UPDATE cart
                SET total_amount = ?
                WHERE id = ?
                """,
                total,
                cartId
        );
    }


    private Map<String, Object> buildCart(
            String customerId,
            Long cartId
    ) {

        BigDecimal total =
                jdbcTemplate.queryForObject(
                        """
                        SELECT
                            COALESCE(
                                total_amount,
                                0
                            )
                        FROM cart
                        WHERE id = ?
                        """,
                        BigDecimal.class,
                        cartId
                );


        List<Map<String, Object>> items =
                jdbcTemplate.query(
                        """
                        SELECT
                            ci.product_id,
                            p.name AS product_name,
                            ci.flavour_id,
                            pf.flavour_name,
                            pf.weight,
                            COALESCE(
                                pf.price,
                                p.price
                            ) AS price,
                            ci.quantity,
                            ci.subtotal
                        FROM cart_items ci
                        INNER JOIN products p
                            ON p.id = ci.product_id
                        LEFT JOIN product_flavours pf
                            ON pf.id = ci.flavour_id
                        WHERE ci.cart_id = ?
                        ORDER BY ci.id ASC
                        """,
                        (
                                rs,
                                rowNum
                        ) -> {

                            Map<String, Object> item =
                                    new LinkedHashMap<>();

                            item.put(
                                    "productId",
                                    rs.getLong(
                                            "product_id"
                                    )
                            );

                            item.put(
                                    "productName",
                                    rs.getString(
                                            "product_name"
                                    )
                            );

                            Object flavourId =
                                    rs.getObject(
                                            "flavour_id"
                                    );

                            item.put(
                                    "flavourId",
                                    flavourId
                            );

                            item.put(
                                    "flavourName",
                                    rs.getString(
                                            "flavour_name"
                                    )
                            );

                            item.put(
                                    "weight",
                                    rs.getString(
                                            "weight"
                                    )
                            );

                            item.put(
                                    "price",
                                    rs.getBigDecimal(
                                            "price"
                                    )
                            );

                            item.put(
                                    "quantity",
                                    rs.getInt(
                                            "quantity"
                                    )
                            );

                            item.put(
                                    "subtotal",
                                    rs.getBigDecimal(
                                            "subtotal"
                                    )
                            );

                            return item;
                        },
                        cartId
                );


        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                cartId
        );

        response.put(
                "customerId",
                customerId
        );

        response.put(
                "totalAmount",
                total
        );

        response.put(
                "items",
                items
        );

        return response;
    }


    private Long toLong(
            Object value
    ) {

        if (value == null) {
            return null;
        }

        if (value instanceof Number) {
            return ((Number) value).longValue();
        }

        return Long.valueOf(
                String.valueOf(value)
        );
    }


    private Integer toInteger(
            Object value
    ) {

        if (value == null) {
            return null;
        }

        if (value instanceof Number) {
            return ((Number) value).intValue();
        }

        return Integer.valueOf(
                String.valueOf(value)
        );
    }
}
