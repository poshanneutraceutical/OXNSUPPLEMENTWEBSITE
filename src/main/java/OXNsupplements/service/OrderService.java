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
@Transactional
public class OrderService {


    private final CartRepository cartRepository;

    private final OrderRepository orderRepository;

    private final EmailService emailService;


    /*
     * ============================================================
     * CHECKOUT CART
     * ============================================================
     */
    public OrderDTO checkout(
            CheckoutRequestDTO request
    ) {


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
         * Find the customer's current cart.
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
         * The cart must contain at least one item.
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
         * Create order header.
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
         * Copy EVERY cart row into the order.
         *
         * This is important after flavour support was added:
         *
         *     product + flavour A
         *     product + flavour B
         *
         * remain separate order lines.
         *
         * The existing OrderItem entity supplied by the project
         * stores product/price/quantity/subtotal. We therefore
         * preserve those existing fields without inventing new
         * database columns here.
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
                    cartItem.getProduct()
                            .getPrice();


            /*
             * If your CartItem entity has a flavour-specific
             * price in a later version, this can be changed to
             * that field. For the current entity, keep the existing
             * product price behavior.
             */
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
         * Make sure at least one valid order line
         * was created.
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
         * Save the order.
         */
        Order savedOrder =
                orderRepository.save(
                        order
                );


        /*
         * Confirmation email should never prevent
         * a successfully saved order.
         */
        try {

            emailService.sendOrderConfirmation(
                    savedOrder
            );

        } catch (Exception e) {

            log.error(
                    "Failed to send order confirmation email.",
                    e
            );
        }


        /*
         * Clear the cart only AFTER the order
         * has been successfully saved.
         */
        cart.getItems().clear();

        cart.setTotalAmount(
                BigDecimal.ZERO
        );

        cartRepository.save(
                cart
        );


        return convertToDTO(
                savedOrder
        );
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

