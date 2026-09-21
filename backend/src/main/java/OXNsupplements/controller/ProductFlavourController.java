package OXNsupplements.controller;


import lombok.RequiredArgsConstructor;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-flavours")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductFlavourController {

    private final JdbcTemplate jdbcTemplate;


    @GetMapping("/product/{productId}")
    public List<Map<String, Object>> getProductFlavours(
            @PathVariable Long productId
    ) {

        return jdbcTemplate.query(
                """
                SELECT
                    id,
                    product_id,
                    flavour_name,
                    description,
                    in_stock,
                    price,
                    weight
                FROM product_flavours
                WHERE product_id = ?
                ORDER BY id ASC
                """,
                (
                        rs,
                        rowNum
                ) -> {

                    Map<String, Object> flavour =
                            new java.util.LinkedHashMap<>();

                    flavour.put(
                            "id",
                            rs.getLong("id")
                    );

                    flavour.put(
                            "productId",
                            rs.getLong("product_id")
                    );

                    flavour.put(
                            "flavourName",
                            rs.getString(
                                    "flavour_name"
                            )
                    );

                    flavour.put(
                            "description",
                            rs.getString(
                                    "description"
                            )
                    );

                    flavour.put(
                            "inStock",
                            rs.getBoolean(
                                    "in_stock"
                            )
                    );

                    flavour.put(
                            "price",
                            rs.getBigDecimal(
                                    "price"
                            )
                    );

                    flavour.put(
                            "weight",
                            rs.getString(
                                    "weight"
                            )
                    );

                    /*
                     * Iron Mass flavour photography is currently
                     * handled by the frontend image map.
                     */
                    flavour.put(
                            "images",
                            new ArrayList<String>()
                    );

                    return flavour;
                },
                productId
        );

    }

}
