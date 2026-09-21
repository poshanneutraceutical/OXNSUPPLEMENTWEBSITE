package OXNsupplements.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;

    // Customer Details
    private String customerName;
    private String email;
    private String phone;

    // Shipping Address
    private String address;
    private String city;
    private String state;
    private String pincode;

    // Order Details
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String orderStatus;
    private LocalDateTime orderDate;

    // Ordered Products
    private List<OrderItemDTO> items;
}

