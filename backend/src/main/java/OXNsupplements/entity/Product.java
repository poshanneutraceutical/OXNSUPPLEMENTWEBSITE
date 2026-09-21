package OXNsupplements.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;


    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;


    @Column(columnDefinition = "TEXT")
    private String description;


    private String category;


    private String badge;


    @Column(name = "featured")
    private Boolean featured = false;


    @Column(name = "in_stock")
    private Boolean inStock = true;


    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;



    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}