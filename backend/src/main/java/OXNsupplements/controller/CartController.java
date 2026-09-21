package OXNsupplements.controller;


import OXNsupplements.service.CartService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;


    /*
     * ============================================================
     * ADD TO CART
     * ============================================================
     *
     * The request may contain:
     *
     * {
     *   customerId: "...",
     *   productId: 10,
     *   flavourId: 123,
     *   quantity: 1
     * }
     *
     * productId + flavourId are treated as one unique
     * cart variant.
     */
    @PostMapping("/add")
    public Map<String, Object> addToCart(
            @RequestBody Map<String, Object> request
    ) {

        return cartService.addToCart(request);
    }


    /*
     * ============================================================
     * GET CART
     * ============================================================
     */
    @GetMapping("/{customerId}")
    public Map<String, Object> getCart(
            @PathVariable String customerId
    ) {

        return cartService.getCart(
                customerId
        );
    }


    /*
     * ============================================================
     * UPDATE QUANTITY
     * ============================================================
     *
     * flavourId is optional.
     *
     * When flavourId is present:
     *     update only that exact flavour.
     */
    @PutMapping("/{customerId}/{productId}")
    public Map<String, Object> updateQuantity(
            @PathVariable String customerId,
            @PathVariable Long productId,

            @RequestParam Integer quantity,

            @RequestParam(
                    required = false
            )
            Long flavourId
    ) {

        return cartService.updateQuantity(
                customerId,
                productId,
                flavourId,
                quantity
        );
    }


    /*
     * ============================================================
     * REMOVE ITEM
     * ============================================================
     *
     * When flavourId is present:
     *     remove only that exact flavour variant.
     *
     * When flavourId is omitted:
     *     remove all variants of the parent product.
     */
    @DeleteMapping("/{customerId}/{productId}")
    public Map<String, Object> removeFromCart(
            @PathVariable String customerId,
            @PathVariable Long productId,

            @RequestParam(
                    required = false
            )
            Long flavourId
    ) {

        return cartService.removeFromCart(
                customerId,
                productId,
                flavourId
        );
    }


    /*
     * ============================================================
     * CLEAR CART
     * ============================================================
     */
    @DeleteMapping("/{customerId}/clear")
    public void clearCart(
            @PathVariable String customerId
    ) {

        cartService.clearCart(
                customerId
        );
    }
}
