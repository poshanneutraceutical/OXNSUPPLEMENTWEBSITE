package OXNsupplements.service;

import OXNsupplements.dto.CheckoutRequestDTO;
import OXNsupplements.dto.OrderDTO;
import OXNsupplements.dto.OrderItemDTO;
import OXNsupplements.entity.Cart;
import OXNsupplements.entity.CartItem;
import OXNsupplements.entity.Order;
import OXNsupplements.entity.OrderItem;
import OXNsupplements.repository.CartRepository;
import OXNsupplements.repository.OrderRepository;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final CartRepository cartRepository;

    private final OrderRepository orderRepository;

    private final EmailService emailService;


    /*
     * ============================================================
     * CHECKOUT / PLACE ORDER
     * ============================================================
     *
     * Important:
     *
     * Database work is completed inside this transaction.
     * Email sending is intentionally triggered AFTER the database
     * transaction has completed.
     *
     * This prevents slow SMTP/Gmail processing from delaying the
     * customer's checkout response.
     * ============================================================
     */
    @Transactional
    public OrderDTO checkout(
            CheckoutRequestDTO request
    ) {

        /*
         * ========================================================
         * VALIDATE CUSTOMER ID
         * ========================================================
         */

        if (
                request == null ||
                        request.getCustomerId() == null ||
                        request.getCustomerId().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Customer ID is required."
            );
        }


        /*
         * ========================================================
         * FIND CUSTOMER CART
         * ========================================================
         */

        Cart cart =
                cartRepository
                        .findByCustomerId(
                                request.getCustomerId()
                        )
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Cart not found"
                                )
                        );


        /*
         * ========================================================
         * CHECK CART
         * ========================================================
         */

        if (
                cart.getItems() == null ||
                        cart.getItems().isEmpty()
        ) {

            throw new IllegalStateException(
                    "Cart is empty"
            );
        }


        /*
         * ========================================================
         * CREATE ORDER
         * ========================================================
         */

        Order order =
                Order.builder()
                        .customerName(
                                request.getCustomerName()
                        )
                        .email(
                                request.getEmail()
                        )
                        .phone(
                                request.getPhone()
                        )
                        .address(
                                request.getAddress()
                        )
                        .city(
                                request.getCity()
                        )
                        .state(
                                request.getState()
                        )
                        .pincode(
                                request.getPincode()
                        )
                        .totalAmount(
                                cart.getTotalAmount()
                        )
                        .paymentStatus(
                                "PENDING"
                        )
                        .orderStatus(
                                "PLACED"
                        )
                        .orderDate(
                                LocalDateTime.now()
                        )
                        .items(
                                new ArrayList<>()
                        )
                        .build();


        /*
         * ========================================================
         * COPY CART ITEMS INTO ORDER ITEMS
         * ========================================================
         */

        for (
                CartItem cartItem :
                cart.getItems()
        ) {

            if (
                    cartItem == null ||
                            cartItem.getProduct() == null
            ) {
                continue;
            }


            BigDecimal linePrice =
                    cartItem
                            .getProduct()
                            .getPrice();


            OrderItem orderItem =
                    OrderItem.builder()
                            .order(order)

                            .productId(
                                    cartItem
                                            .getProduct()
                                            .getId()
                            )

                            .productName(
                                    cartItem
                                            .getProduct()
                                            .getName()
                            )

                            .price(
                                    linePrice
                            )

                            .quantity(
                                    cartItem
                                            .getQuantity()
                            )

                            .subtotal(
                                    cartItem
                                            .getSubtotal()
                            )

                            .build();


            order.getItems().add(
                    orderItem
            );
        }


        /*
         * ========================================================
         * VALIDATE ORDER ITEMS
         * ========================================================
         */

        if (
                order.getItems() == null ||
                        order.getItems().isEmpty()
        ) {

            throw new IllegalStateException(
                    "Cart contains no valid order items."
            );
        }


        /*
         * ========================================================
         * SAVE ORDER
         * ========================================================
         */

        Order savedOrder =
                orderRepository.save(
                        order
                );


        log.info(
                "Order created successfully. orderId={}, customerId={}, total={}",
                savedOrder.getId(),
                request.getCustomerId(),
                savedOrder.getTotalAmount()
        );


        /*
         * ========================================================
         * CLEAR CART
         * ========================================================
         *
         * The backend is responsible for clearing the cart.
         * The frontend does NOT need to make another clear-cart
         * request after checkout.
         * ========================================================
         */

        cart.getItems().clear();

        cart.setTotalAmount(
                BigDecimal.ZERO
        );

        cartRepository.save(
                cart
        );


        log.info(
                "Cart cleared successfully after order. customerId={}",
                request.getCustomerId()
        );


        /*
         * ========================================================
         * CONVERT ORDER TO DTO
         * ========================================================
         */

        OrderDTO orderDTO =
                convertToDTO(
                        savedOrder
                );


        /*
         * ========================================================
         * EMAIL
         * ========================================================
         *
         * IMPORTANT:
         *
         * EmailService.sendOrderConfirmation() should be @Async.
         *
         * That allows the SMTP operation to happen separately
         * instead of keeping the customer waiting.
         *
         * The order has already been saved and the cart cleared.
         * ========================================================
         */

        try {

            emailService.sendOrderConfirmation(
                    savedOrder
            );

            log.info(
                    "Order confirmation email triggered. orderId={}",
                    savedOrder.getId()
            );

        } catch (Exception e) {

            /*
             * Email failure must NEVER make an otherwise successful
             * order fail.
             */

            log.error(
                    "Could not trigger order confirmation email. orderId={}",
                    savedOrder.getId(),
                    e
            );
        }


        /*
         * ========================================================
         * RETURN ORDER
         * ========================================================
         */

        return orderDTO;
    }


    /*
     * ============================================================
     * CONVERT ENTITY -> DTO
     * ============================================================
     */

    private OrderDTO convertToDTO(
            Order order
    ) {

        return OrderDTO.builder()

                .id(
                        order.getId()
                )

                .customerName(
                        order.getCustomerName()
                )

                .email(
                        order.getEmail()
                )

                .phone(
                        order.getPhone()
                )

                .address(
                        order.getAddress()
                )

                .city(
                        order.getCity()
                )

                .state(
                        order.getState()
                )

                .pincode(
                        order.getPincode()
                )

                .totalAmount(
                        order.getTotalAmount()
                )

                .paymentStatus(
                        order.getPaymentStatus()
                )

                .orderStatus(
                        order.getOrderStatus()
                )

                .orderDate(
                        order.getOrderDate()
                )

                .items(
                        order.getItems()
                                .stream()
                                .map(
                                        item ->
                                                OrderItemDTO
                                                        .builder()

                                                        .productId(
                                                                item.getProductId()
                                                        )

                                                        .productName(
                                                                item.getProductName()
                                                        )

                                                        .price(
                                                                item.getPrice()
                                                        )

                                                        .quantity(
                                                                item.getQuantity()
                                                        )

                                                        .subtotal(
                                                                item.getSubtotal()
                                                        )

                                                        .build()
                                )
                                .collect(
                                        Collectors.toList()
                                )
                )

                .build();
    }
}