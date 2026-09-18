package OXNsupplements.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;

    private String name;

    private BigDecimal price;

    private String description;

    private String category;

    private String badge;

    private Boolean featured;

    private Boolean inStock;
}