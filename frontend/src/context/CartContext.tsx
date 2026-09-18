import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCustomerId } from "../utils/customer";

import cartService, {
  type Cart,
  type CartItem,
} from "../services/cartService";


/* =========================================================
   CONTEXT TYPE
========================================================= */

interface CartContextType {

  cart: Cart | null;

  loading: boolean;

  addToCart: (
    productId: number,
    quantity?: number,
    flavourId?: number
  ) => Promise<void>;

  removeItem: (
    productId: number,
    flavourId?: number
  ) => Promise<void>;

  updateQuantity: (
    productId: number,
    quantity: number,
    flavourId?: number
  ) => Promise<void>;

  refreshCart: () => Promise<void>;

  cartCount: number;

  clearCart: () => Promise<void>;
}


/* =========================================================
   CONTEXT
========================================================= */

const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined);


/* =========================================================
   CUSTOMER ID
========================================================= */

const CUSTOMER_ID =
  getCustomerId();


/* =========================================================
   CART PROVIDER
========================================================= */

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [cart, setCart] =
    useState<Cart | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);


  /* =======================================================
     REFRESH CART
  ======================================================= */

  const refreshCart =
    async () => {

      try {

        setLoading(true);

        const data =
          await cartService.getCart(
            CUSTOMER_ID
          );

        setCart(data);

      } catch (
        error: any
      ) {

        if (
          error?.response?.status ===
          404
        ) {

          setCart(null);

        } else {

          console.error(
            "Failed to load cart:",
            error
          );

          setCart(null);

        }

      } finally {

        setLoading(false);

      }
    };


  /* =======================================================
     LOAD CART WHEN WEBSITE STARTS
  ======================================================= */

  useEffect(() => {

    refreshCart();

  }, []);


  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart =
    async (
      productId: number,
      quantity: number = 1,
      flavourId?: number
    ) => {

      try {

        setLoading(true);

        console.log(
          "Adding item to cart:",
          {
            customerId:
              CUSTOMER_ID,
            productId,
            flavourId,
            quantity,
          }
        );

        const data =
          await cartService.addToCart(
            {
              customerId:
                CUSTOMER_ID,

              productId,

              flavourId:
                flavourId ?? null,

              quantity,
            }
          );

        console.log(
          "Cart updated:",
          data
        );

        setCart(data);

      } catch (
        error
      ) {

        console.error(
          "Failed to add item to cart:",
          error
        );

        throw error;

      } finally {

        setLoading(false);

      }
    };


  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  const removeItem =
    async (
      productId: number,
      flavourId?: number
    ) => {

      try {

        setLoading(true);

        const data =
          await cartService.removeItem(
            CUSTOMER_ID,
            productId,
            flavourId
          );

        setCart(data);

      } catch (
        error
      ) {

        console.error(
          "Failed to remove item:",
          error
        );

        throw error;

      } finally {

        setLoading(false);

      }
    };


  /* =======================================================
     UPDATE QUANTITY
  ======================================================= */

  const updateQuantity =
    async (
      productId: number,
      quantity: number,
      flavourId?: number
    ) => {

      try {

        /*
         * If quantity reaches 0,
         * remove the exact flavour
         * instead.
         */

        if (
          quantity <= 0
        ) {

          await removeItem(
            productId,
            flavourId
          );

          return;

        }


        setLoading(true);

        const data =
          await cartService.updateQuantity(
            CUSTOMER_ID,
            productId,
            quantity,
            flavourId
          );

        setCart(data);

      } catch (
        error
      ) {

        console.error(
          "Failed to update quantity:",
          error
        );

        throw error;

      } finally {

        setLoading(false);

      }
    };


  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart =
    async () => {

      try {

        setLoading(true);

        await cartService.clearCart(
          CUSTOMER_ID
        );

        setCart(null);

        localStorage.removeItem(
          "cart"
        );

      } catch (
        error
      ) {

        console.error(
          "Failed to clear cart:",
          error
        );

        throw error;

      } finally {

        setLoading(false);

      }
    };


  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount =
    cart?.items?.reduce(
      (
        sum: number,
        item: CartItem
      ) => {

        return (
          sum + item.quantity
        );

      },
      0
    ) || 0;


  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <CartContext.Provider
      value={{
        cart,

        loading,

        addToCart,

        removeItem,

        updateQuantity,

        refreshCart,

        cartCount,

        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


/* =========================================================
   USE CART HOOK
========================================================= */

export const useCart =
  () => {

    const context =
      useContext(
        CartContext
      );

    if (!context) {

      throw new Error(
        "useCart must be used inside CartProvider"
      );
    }

    return context;
  };
