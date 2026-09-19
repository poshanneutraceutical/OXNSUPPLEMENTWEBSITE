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
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
@Slf4j
public class DataSeeder {

    private static final List<OxnProductSeed> OXN_PRODUCTS = List.of(
            new OxnProductSeed(
                    "Birthday Cake",
                    "OXN Whey Protein in Birthday Cake flavour. The supplied OXN label identifies this as a 4.5 KG whey protein product with 24g protein per serving."
            ),
            new OxnProductSeed(
                    "Cookies & Cream",
                    "OXN Whey Protein in Cookies & Cream flavour. The supplied OXN product artwork is used for this product."
            ),
            new OxnProductSeed(
                    "Chocolate Hazelnut",
                    "OXN Whey Protein in Chocolate Hazelnut flavour. The supplied OXN product artwork is used for this product."
            ),
            new OxnProductSeed(
                    "Double Rich Chocolate",
                    "OXN Whey Protein in Double Rich Chocolate flavour. The supplied OXN label identifies this as a 4.5 KG whey protein product with 24g protein per serving."
            ),
            new OxnProductSeed(
                    "Strawberry Cheesecake",
                    "OXN Whey Protein in Strawberry Cheesecake flavour. The supplied OXN product artwork is used for this product."
            )
    );

    @Bean
    CommandLineRunner seedProducts(
            ProductRepository productRepository,
            JdbcTemplate jdbcTemplate
    ) {
        return args -> {

            /*
             * ============================================================
             * OXN PRODUCT CATALOGUE MIGRATION
             * ============================================================
             *
             * Each OXN flavour is an independent Product row.
             *
             * Required products:
             *
             * 1. Birthday Cake
             * 2. Cookies & Cream
             * 3. Chocolate Hazelnut
             * 4. Double Rich Chocolate
             * 5. Strawberry Cheesecake
             *
             * All products have a selling price of ₹16,999.
             * ============================================================
             */

            createProductFlavourTable(jdbcTemplate);

            List<Product> existingProducts =
                    productRepository.findAll();

            Set<String> existingNames =
                    existingProducts.stream()
                            .map(Product::getName)
                            .filter(name -> name != null)
                            .map(String::trim)
                            .map(String::toLowerCase)
                            .collect(Collectors.toSet());

            Set<String> requiredNames =
                    OXN_PRODUCTS.stream()
                            .map(OxnProductSeed::name)
                            .map(String::trim)
                            .map(String::toLowerCase)
                            .collect(Collectors.toSet());

            boolean alreadyMigrated =
                    existingProducts.size() == OXN_PRODUCTS.size()
                            && existingNames.equals(requiredNames);

            /*
             * IMPORTANT:
             *
             * If the five products already exist, we still update their
             * prices to ₹16,999.
             *
             * This is necessary because the old version of the seeder
             * created them with price = 0.
             */
            if (alreadyMigrated) {

                log.info(
                        "OXN catalogue already contains the five required products. Updating prices to ₹16,999."
                );

                for (Product product : existingProducts) {

                    product.setPrice(
                            BigDecimal.valueOf(16999)
                    );

                    productRepository.save(product);

                    log.info(
                            "Updated OXN product price: id={}, name={}, price={}",
                            product.getId(),
                            product.getName(),
                            product.getPrice()
                    );
                }

                log.info(
                        "All five OXN product prices are now set to ₹16,999."
                );

                return;
            }

            log.info(
                    "Existing catalogue does not match the five-product OXN catalogue. Performing product reset."
            );

            /*
             * Active carts reference products through a foreign key,
             * so clear cart rows before deleting old products.
             *
             * Historical order_items are intentionally preserved.
             */
            jdbcTemplate.update("DELETE FROM cart_items");

            jdbcTemplate.update("DELETE FROM product_flavours");

            productRepository.deleteAllInBatch();

            /*
             * Reset product IDs.
             */
            try {

                jdbcTemplate.execute(
                        "ALTER TABLE products AUTO_INCREMENT = 1"
                );

            } catch (Exception exception) {

                log.warn(
                        "Could not reset products AUTO_INCREMENT. New OXN IDs will still work normally.",
                        exception
                );
            }

            /*
             * Create the five OXN products.
             */
            for (OxnProductSeed seed : OXN_PRODUCTS) {

                Product product = Product.builder()
                        .name(seed.name())

                        /*
                         * OXN selling price
                         */
                        .price(BigDecimal.valueOf(16999))

                        .description(seed.description())
                        .category("Whey Protein")
                        .badge("OXN WHEY")
                        .featured(true)
                        .inStock(true)
                        .build();

                Product saved =
                        productRepository.save(product);

                log.info(
                        "Seeded OXN product: id={}, name={}, price={}",
                        saved.getId(),
                        saved.getName(),
                        saved.getPrice()
                );
            }

            log.info(
                    "OXN catalogue reset complete. Exactly {} products are now configured with price ₹16,999.",
                    OXN_PRODUCTS.size()
            );
        };
    }

    /*
     * Keep the legacy table available so an existing database upgrade
     * does not fail because the table is missing.
     *
     * The new OXN storefront does not use flavour rows.
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

    private record OxnProductSeed(
            String name,
            String description
    ) {
    }
}