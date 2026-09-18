package OXNsupplements.controller;



import OXNsupplements.dto.CheckoutRequestDTO;
import OXNsupplements.dto.OrderDTO;
import OXNsupplements.service.OrderService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {


    private final OrderService orderService;


    /*
     * ============================================================
     * CHECKOUT / PLACE ORDER
     * ============================================================
     *
     * POST /api/orders/checkout
     *
     * This is the exact endpoint used by the frontend
     * orderService.checkout() method.
     */
    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout(
            @Valid
            @RequestBody
            CheckoutRequestDTO request
    ) {

        OrderDTO order =
                orderService.checkout(
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(order);
    }

}
