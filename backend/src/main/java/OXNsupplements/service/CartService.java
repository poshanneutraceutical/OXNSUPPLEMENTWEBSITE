package OXNsupplements.service;


import lombok.RequiredArgsConstructor;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final JdbcTemplate jdbcTemplate;


    /*
     * ============================================================
     * ADD TO CART
     * ============================================================
     *
     * IMPORTANT:
     *
     * A cart row is identified by:
     *
     *     product_id + flavour_id
     *
     * Therefore:
     *
     * Bulk Mass Gainer + Malai Kulfi
     * Bulk Mass Gainer + Double Chocolate
     * Bulk Mass Gainer + Cookies & Cream
     *
     * are three different cart items.
     */
    public Map<String, Object> addToCart(
            Map<String, Object> request
    ) {

        String customerId =
                String.valueOf(
                        request.get(
                                "customerId"
                        )
                );

        Long productId =
                toLong(
                        request.get(
                                "productId"
                        )
                );

        Long flavourId =
                request.get("flavourId") == null
                        ? null
                        : toLong(
                        request.get(
                                "flavourId"
                        )
                );

        Integer quantity =
                toInteger(
                        request.get(
                                "quantity"
                        )
                );


        if (
                customerId == null ||
                        customerId.isBlank() ||
                        "null".equalsIgnoreCase(
                                customerId
                        )
        ) {

            throw new IllegalArgumentException(
                    "Customer ID is required."
            );
        }


        if (productId == null) {

            throw new IllegalArgumentException(
                    "Product ID is required."
            );
        }


        if (
                quantity == null ||
                        quantity <= 0
        ) {

            throw new IllegalArgumentException(
                    "Quantity must be greater than 0."
            );
        }


        /*
         * Make sure the parent product exists.
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
                    "Product not found: "
                            + productId
            );
        }


        /*
         * Determine the exact price.
         *
         * For a flavour cart item the flavour price is used.
         */
        BigDecimal itemPrice;

        if (flavourId != null) {

            List<Map<String, Object>>
                    flavours =
                    jdbcTemplate.queryForList(
                            """
                            SELECT
                                id,
                                product_id,
                                price,
                                in_stock
                            FROM product_flavours
                            WHERE id = ?
                            LIMIT 1
                            """,
                            flavourId
                    );


            if (flavours.isEmpty()) {

                throw new IllegalArgumentException(
                        "Selected flavour not found: "
                                + flavourId
                );
            }


            Map<String, Object>
                    flavour =
                    flavours.get(0);


            Long flavourProductId =
                    toLong(
                            flavour.get(
                                    "product_id"
                            )
                    );


            if (
                    !productId.equals(
                            flavourProductId
                    )
            ) {

                throw new IllegalArgumentException(
                        "Selected flavour does not belong to the selected product."
                );
            }


            Boolean inStock =
                    flavour.get(
                            "in_stock"
                    ) == null
                            ? true
                            : Boolean.valueOf(
                            String.valueOf(
                                    flavour.get(
                                            "in_stock"
                                    )
                            )
                    );


            if (!inStock) {

                throw new IllegalArgumentException(
                        "Selected flavour is out of stock."
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


        /*
         * Find or create the customer's cart.
         */
        Long cartId =
                getOrCreateCart(
                        customerId
                );


        /*
         * IMPORTANT:
         *
         * Find an existing row using BOTH:
         *
         *     product_id
         *     flavour_id
         *
         * A different flavour gets a different cart row.
         */
        Long cartItemId =
                findCartItemId(
                        cartId,
                        productId,
                        flavourId
                );


        BigDecimal addedSubtotal =
                itemPrice.multiply(
                        BigDecimal.valueOf(
                                quantity
                        )
                );


        if (cartItemId != null) {

            /*
             * Same exact flavour already exists:
             * increase only that row's quantity.
             */
            jdbcTemplate.update(
                    """
                    UPDATE cart_items
                    SET
                        quantity =
                            quantity + ?,
                        subtotal =
                            subtotal + ?
                    WHERE id = ?
                    """,
                    quantity,
                    addedSubtotal,
                    cartItemId
            );

        } else {

            /*
             * Different flavour:
             * ALWAYS create a new cart row.
             */
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
                    addedSubtotal
            );

        }


        recalculateTotal(
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
    public Map<String, Object> getCart(
            String customerId
    ) {

        Long cartId =
                getExistingCartId(
                        customerId
                );


        if (cartId == null) {

            Map<String, Object>
                    emptyCart =
                    new LinkedHashMap<>();

            emptyCart.put(
                    "id",
                    null
            );

            emptyCart.put(
                    "customerId",
                    customerId
            );

            emptyCart.put(
                    "totalAmount",
                    BigDecimal.ZERO
            );

            emptyCart.put(
                    "items",
                    new ArrayList<>()
            );

            return emptyCart;
        }


        recalculateTotal(
                cartId
        );


        return buildCart(
                customerId,
                cartId
        );
    }


    /*
     * ============================================================
     * UPDATE EXACT ITEM QUANTITY
     * ============================================================
     */
    public Map<String, Object> updateQuantity(
            String customerId,
            Long productId,
            Long flavourId,
            Integer quantity
    ) {

        if (
                quantity == null ||
                        quantity <= 0
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
                    "Selected cart item was not found."
            );
        }


        BigDecimal itemPrice =
                getExactItemPrice(
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


        recalculateTotal(
                cartId
        );


        return buildCart(
                customerId,
                cartId
        );
    }


    /*
     * ============================================================
     * REMOVE EXACT ITEM
     * ============================================================
     */
    public Map<String, Object> removeFromCart(
            String customerId,
            Long productId,
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


        if (flavourId != null) {

            /*
             * Remove ONLY:
             *
             * product_id = selected product
             * flavour_id = selected flavour
             */
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

        } else {

            /*
             * Parent-product removal:
             * remove rows without a flavour.
             *
             * This does not remove flavour-specific rows.
             */
            jdbcTemplate.update(
                    """
                    DELETE FROM cart_items
                    WHERE cart_id = ?
                      AND product_id = ?
                      AND flavour_id IS NULL
                    """,
                    cartId,
                    productId
            );
        }


        recalculateTotal(
                cartId
        );


        return buildCart(
                customerId,
                cartId
        );
    }


    /*
     * ============================================================
     * CLEAR CART
     * ============================================================
     */
    public void clearCart(
            String customerId
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
     * GET OR CREATE CART
     * ============================================================
     */
    private Long getOrCreateCart(
            String customerId
    ) {

        Long existingCartId =
                getExistingCartId(
                        customerId
                );


        if (existingCartId != null) {
            return existingCartId;
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


    /*
     * ============================================================
     * GET EXISTING CART ID
     * ============================================================
     */
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


    /*
     * ============================================================
     * FIND EXACT CART ITEM
     * ============================================================
     */
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
                            ORDER BY id ASC
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
                            ORDER BY id ASC
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


    /*
     * ============================================================
     * GET EXACT ITEM PRICE
     * ============================================================
     */
    private BigDecimal getExactItemPrice(
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


    /*
     * ============================================================
     * RECALCULATE CART TOTAL
     * ============================================================
     */
    private void recalculateTotal(
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


    /*
     * ============================================================
     * BUILD CART RESPONSE
     * ============================================================
     *
     * Every database row becomes one item in the response.
     *
     * Therefore:
     *
     * 7 database rows = 7 cart items.
     */
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
                            ci.id AS cart_item_id,
                            ci.product_id,
                            p.name AS product_name,

                            ci.flavour_id,
                            pf.flavour_name,
                            pf.weight,
                            pf.description AS flavour_description,

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

                            Map<String, Object>
                                    item =
                                    new LinkedHashMap<>();


                            item.put(
                                    "cartItemId",
                                    rs.getLong(
                                            "cart_item_id"
                                    )
                            );


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
                                    "description",
                                    rs.getString(
                                            "flavour_description"
                                    )
                            );


                            item.put(
                                    "imageUrl",
                                    null
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


        Map<String, Object>
                response =
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


    /*
     * ============================================================
     * SAFE CONVERSION HELPERS
     * ============================================================
     */
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
