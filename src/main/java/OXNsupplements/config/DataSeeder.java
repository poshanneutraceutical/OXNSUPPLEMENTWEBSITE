package OXNsupplements.config;


import OXNsupplements.entity.Product;
import OXNsupplements.repository.ProductRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@Slf4j
public class DataSeeder {

    @Bean
    CommandLineRunner seedProducts(
            ProductRepository repo,
            JdbcTemplate jdbcTemplate
    ) {

        return args -> {

            /*
             * ============================================================
             * KEEP EXISTING PRODUCTS
             * ============================================================
             *
             * This project may already contain the original products.
             * We therefore DO NOT stop the flavour/product setup just
             * because the products table is non-empty.
             *
             * We seed/update the three Iron Mass parent products that
             * the current frontend uses.
             */

            ensureParentProduct(
                    repo,
                    "Bulk Mass Gainer",
                    "4200",
                    "High-performance mass gainer available in three delicious flavours.",
                    "Mass Gainer",
                    "NEW"
            );

            ensureParentProduct(
                    repo,
                    "Nitro Surge Pre-Workout",
                    "1899",
                    "High-performance pre-workout available in two powerful flavours.",
                    "Pre-Workout",
                    "NEW"
            );

            ensureParentProduct(
                    repo,
                    "Mech-Warrior",
                    "2199",
                    "Cybernetic stimulation formula available in two flavours.",
                    "Pre-Workout",
                    "NEW"
            );


            /*
             * ============================================================
             * PRODUCT FLAVOUR TABLE
             * ============================================================
             */

            createProductFlavourTable(
                    jdbcTemplate
            );


            /*
             * ============================================================
             * CART VARIANT COLUMN
             * ============================================================
             *
             * The existing cart tables were created before flavour
             * support was introduced. Add the nullable flavour_id column
             * only when it is missing.
             */

            ensureCartItemFlavourColumn(
                    jdbcTemplate
            );


            /*
             * ============================================================
             * GET CURRENT IRON MASS PARENT IDS
             * ============================================================
             */

            Long bulkMassGainerId =
                    getProductId(
                            jdbcTemplate,
                            "Bulk Mass Gainer"
                    );

            Long nitroSurgeId =
                    getProductId(
                            jdbcTemplate,
                            "Nitro Surge Pre-Workout"
                    );

            Long mechWarriorId =
                    getProductId(
                            jdbcTemplate,
                            "Mech-Warrior"
                    );


            /*
             * ============================================================
             * BULK MASS GAINER FLAVOURS
             * ============================================================
             */

            if (bulkMassGainerId != null) {

                seedFlavour(
                        jdbcTemplate,
                        bulkMassGainerId,
                        "Malai Kulfi",
                        "Mass Gainer in Malai Kulfi flavour. High-calorie lean mass gainer designed for maximum muscle size and strength.",
                        "4200",
                        "3 KG"
                );

                seedFlavour(
                        jdbcTemplate,
                        bulkMassGainerId,
                        "Double Chocolate",
                        "Mass Gainer in Double Chocolate flavour. High-calorie lean mass gainer designed for maximum muscle size and strength.",
                        "4200",
                        "3 KG"
                );

                seedFlavour(
                        jdbcTemplate,
                        bulkMassGainerId,
                        "Cookies & Cream",
                        "Mass Gainer in Cookies & Cream flavour. High-calorie lean mass gainer designed for maximum muscle size and strength.",
                        "4200",
                        "3 KG"
                );

            }


            /*
             * ============================================================
             * NITRO SURGE FLAVOURS
             * ============================================================
             */

            if (nitroSurgeId != null) {

                seedFlavour(
                        jdbcTemplate,
                        nitroSurgeId,
                        "Pina Colada",
                        "Nitro Surge Pre-Workout in Pina Colada flavour. High-performance pre-workout designed to support energy, focus, training intensity and performance.",
                        "1899",
                        "180 GM"
                );

                seedFlavour(
                        jdbcTemplate,
                        nitroSurgeId,
                        "Candy Orange",
                        "Nitro Surge Pre-Workout in Candy Orange flavour. High-performance pre-workout designed to support energy, focus, training intensity and performance.",
                        "1899",
                        "180 GM"
                );

            }


            /*
             * ============================================================
             * MECH-WARRIOR FLAVOURS
             * ============================================================
             */

            if (mechWarriorId != null) {

                seedFlavour(
                        jdbcTemplate,
                        mechWarriorId,
                        "Pina Colada",
                        "Mech-Warrior in Pina Colada flavour. Cybernetic stimulation pre-workout formula designed to support intense training performance.",
                        "2199",
                        "300 GM"
                );

                seedFlavour(
                        jdbcTemplate,
                        mechWarriorId,
                        "Candy Orange",
                        "Mech-Warrior in Candy Orange flavour. Cybernetic stimulation pre-workout formula designed to support intense training performance.",
                        "2199",
                        "300 GM"
                );

            }

        };
    }


    /*
     * ================================================================
     * ENSURE PARENT PRODUCT
     * ================================================================
     *
     * Existing product:
     *     update the Iron Mass parent fields.
     *
     * Missing product:
     *     create it.
     */
    private void ensureParentProduct(
            ProductRepository repo,
            String name,
            String price,
            String description,
            String category,
            String badge
    ) {

        List<Product> products =
                repo.findAll();

        Product product =
                products.stream()
                        .filter(
                                item ->
                                        name.equals(
                                                item.getName()
                                        )
                        )
                        .findFirst()
                        .orElse(null);


        if (product == null) {

            product =
                    Product.builder()
                            .name(name)
                            .price(
                                    new BigDecimal(price)
                            )
                            .description(
                                    description
                            )
                            .category(
                                    category
                            )
                            .badge(
                                    badge
                            )
                            .featured(true)
                            .inStock(true)
                            .build();

            Product saved =
                    repo.save(product);

            log.info(
                    "Seeded Iron Mass parent product: id={}, name={}",
                    saved.getId(),
                    saved.getName()
            );

            return;
        }


        /*
         * Update only the parent product information that belongs
         * to the Iron Mass catalogue.
         */
        product.setPrice(
                new BigDecimal(price)
        );

        product.setDescription(
                description
        );

        product.setCategory(
                category
        );

        product.setBadge(
                badge
        );

        product.setFeatured(true);

        product.setInStock(true);

        repo.save(product);

        log.info(
                "Updated Iron Mass parent product: id={}, name={}",
                product.getId(),
                product.getName()
        );

    }


    /*
     * ================================================================
     * CREATE PRODUCT FLAVOUR TABLE
     * ================================================================
     */
    private void createProductFlavourTable(
            JdbcTemplate jdbcTemplate
    ) {

        jdbcTemplate.execute(
                """
                CREATE TABLE IF NOT EXISTS product_flavours (
                    id BIGINT NOT NULL AUTO_INCREMENT,
                    flavour_name VARCHAR(255) NOT NULL,
                    description TEXT,
                    in_stock BOOLEAN DEFAULT TRUE,
                    price DECIMAL(10,2) NOT NULL,
                    product_id BIGINT NOT NULL,
                    weight VARCHAR(255),
                    PRIMARY KEY (id),
                    UNIQUE KEY uk_product_flavour (
                        product_id,
                        flavour_name,
                        weight
                    )
                )
                """
        );

    }


    /*
     * ================================================================
     * ENSURE CART FLAVOUR COLUMN
     * ================================================================
     */
    private void ensureCartItemFlavourColumn(
            JdbcTemplate jdbcTemplate
    ) {

        Integer count =
                jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM information_schema.columns
                        WHERE table_schema = DATABASE()
                          AND table_name = 'cart_items'
                          AND column_name = 'flavour_id'
                        """,
                        Integer.class
                );


        if (count != null && count > 0) {
            return;
        }


        jdbcTemplate.execute(
                """
                ALTER TABLE cart_items
                ADD COLUMN flavour_id BIGINT NULL
                """
        );

        log.info(
                "Added flavour_id column to cart_items."
        );

    }


    /*
     * ================================================================
     * FIND PRODUCT ID
     * ================================================================
     */
    private Long getProductId(
            JdbcTemplate jdbcTemplate,
            String productName
    ) {

        List<Long> ids =
                jdbcTemplate.query(
                        """
                        SELECT id
                        FROM products
                        WHERE name = ?
                        LIMIT 1
                        """,
                        (
                                rs,
                                rowNum
                        ) ->
                                rs.getLong(
                                        "id"
                                ),
                        productName
                );

        if (ids.isEmpty()) {
            return null;
        }

        return ids.get(0);

    }


    /*
     * ================================================================
     * SEED / UPDATE FLAVOUR
     * ================================================================
     */
    private void seedFlavour(
            JdbcTemplate jdbcTemplate,
            Long productId,
            String flavourName,
            String description,
            String price,
            String weight
    ) {

        Integer count =
                jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM product_flavours
                        WHERE product_id = ?
                          AND flavour_name = ?
                          AND weight = ?
                        """,
                        Integer.class,
                        productId,
                        flavourName,
                        weight
                );


        if (count != null && count > 0) {

            jdbcTemplate.update(
                    """
                    UPDATE product_flavours
                    SET
                        description = ?,
                        in_stock = TRUE,
                        price = ?
                    WHERE product_id = ?
                      AND flavour_name = ?
                      AND weight = ?
                    """,
                    description,
                    new BigDecimal(price),
                    productId,
                    flavourName,
                    weight
            );

            return;
        }


        jdbcTemplate.update(
                """
                INSERT INTO product_flavours
                (
                    flavour_name,
                    description,
                    in_stock,
                    price,
                    product_id,
                    weight
                )
                VALUES (?, ?, TRUE, ?, ?, ?)
                """,
                flavourName,
                description,
                new BigDecimal(price),
                productId,
                weight
        );

        log.info(
                "Seeded Iron Mass flavour: productId={}, flavour={}, weight={}",
                productId,
                flavourName,
                weight
        );

    }

}
