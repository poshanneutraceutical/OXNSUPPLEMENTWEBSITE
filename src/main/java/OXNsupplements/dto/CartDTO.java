package OXNsupplements.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {

    private Long id;

    private String customerId;

    @Builder.Default
    private List<CartItemDTO> items =
            new ArrayList<>();

    private BigDecimal totalAmount;
}
