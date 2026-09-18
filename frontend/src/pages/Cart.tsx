import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

/* =========================================================
   PRODUCT / FLAVOUR IMAGES

   Backend product IDs:
   10 = OXN Whey Protein
   11 = OXN Whey Protein
   12 = OXN Whey Protein

   The flavour image is selected from the exact flavour name.
========================================================= */

const flavourImages: Record<
  number,
  Record<string, string>
> = {
  10: {
    "birthday cake":
      "/products/oxn/birthday-cake.png",

    "cookies & cream":
      "/products/oxn/cookies-and-cream.png",

    "cookies and cream":
      "/products/oxn/cookies-and-cream.png",

    "chocolate hazelnut":
      "/products/oxn/chocolate-hazelnut.png",

    "double rich chocolate":
      "/products/oxn/double-rich-chocolate.png",

    "strawberry cheesecake":
      "/products/oxn/strawberry-cheesecake.png",
  },
};


/* =========================================================
   NORMALISE FLAVOUR NAME
========================================================= */

const normaliseFlavourName = (
  flavourName?: string | null
) => {
  return (
    flavourName || ""
  )
    .trim()
    .toLowerCase();
};


/* =========================================================
   GET CART IMAGE
========================================================= */

const getCartImage = (
  productId: number,
  flavourName?: string | null,
  imageUrl?: string | null
) => {

  /*
   * First preference:
   * image returned directly by backend.
   */
  if (imageUrl) {
    return imageUrl;
  }


  /*
   * Second preference:
   * exact OXN flavour image.
   */
  const normalisedName =
    normaliseFlavourName(
      flavourName
    );

  const flavourImage =
    flavourImages[
      productId
    ]?.[normalisedName];

  if (flavourImage) {
    return flavourImage;
  }


  /*
   * Final fallback:
   * parent product image.
   */
  const productImages: Record<
    number,
    string
  > = {
    10:
      "/products/oxn/birthday-cake.png",

    11:
      "/products/oxn/chocolate-hazelnut.png",

    12:
      "/products/oxn/chocolate-hazelnut.png",
  };


  return (
    productImages[
      productId
    ] ||
    "/products/oxn/double-rich-chocolate.png"
  );
};


/* =========================================================
   CART PAGE
========================================================= */

export default function Cart() {

  const {
    cart,
    loading,
    updateQuantity,
    removeItem,
  } = useCart();

  const navigate =
    useNavigate();


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">

        <div className="flex flex-col items-center gap-4">

          <div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />

          <p className="text-white/70 text-lg">
            Loading Cart...
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <div className="mx-auto mb-7 w-20 h-20 rounded-full border border-yellow-400/30 bg-yellow-400/10 flex items-center justify-center">

            <ShoppingBag
              size={34}
              className="text-yellow-400"
            />

          </div>


          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Cart is Empty
          </h1>


          <p className="text-white/50 text-lg mb-8">
            Add some OXN products to get started.
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-7 py-3.5 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }


  /* =======================================================
     TOTAL QUANTITY
  ======================================================= */

  const totalItems =
    cart.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-16">


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-10 md:mb-12">

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="inline-flex items-center gap-2 text-white/50 hover:text-yellow-400 transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>


          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            Shopping Cart
          </h1>


          <p className="text-white/50 mt-3 text-base md:text-lg">
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>

        </div>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">


          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="lg:col-span-2 space-y-5">

            {cart.items.map(
              (item) => {

                const image =
                  getCartImage(
                    item.productId,
                    item.flavourName,
                    item.imageUrl
                  );


                const hasFlavour =
                  Boolean(
                    item.flavourName
                  );


                return (

                  <div
                    key={`${item.productId}-${item.flavourId ?? "parent"}`}
                    className="relative bg-[#0D2131] border border-white/10 hover:border-yellow-400/30 rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-300"
                  >

                    <div className="flex flex-col sm:flex-row gap-5">


                      {/* =======================================
                          PRODUCT IMAGE
                      ======================================= */}

                      <div className="w-full sm:w-32 md:w-36 h-36 sm:h-32 md:h-36 flex-shrink-0 bg-[#142D40] border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">

                        <img
                          src={image}
                          alt={
                            hasFlavour
                              ? `${item.productName} ${item.flavourName}`
                              : item.productName
                          }
                          className="w-full h-full object-contain p-2"
                          onError={(event) => {

                            const target =
                              event.currentTarget;

                            if (
                              target.src.endsWith(
                                "/products/oxn/double-rich-chocolate.png"
                              )
                            ) {
                              return;
                            }

                            target.src =
                              "/products/oxn/double-rich-chocolate.png";
                          }}
                        />

                      </div>


                      {/* =======================================
                          PRODUCT INFORMATION
                      ======================================= */}

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col md:flex-row md:justify-between gap-3">


                          <div>

                            <p className="text-yellow-400 uppercase tracking-[0.18em] text-xs font-bold mb-2">
                              OXN
                            </p>


                            <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                              {item.productName}
                            </h2>


                            {item.flavourName && (
                              <div className="mt-2">

                                <p className="text-white/50 text-xs uppercase tracking-[0.16em]">
                                  Flavour
                                </p>

                                <p className="text-white text-lg font-semibold">
                                  {item.flavourName}
                                </p>

                              </div>
                            )}


                            {item.weight && (
                              <div className="mt-2">

                                <p className="text-white/50 text-xs uppercase tracking-[0.16em]">
                                  Weight
                                </p>

                                <p className="text-white/80 text-sm font-medium">
                                  {item.weight}
                                </p>

                              </div>
                            )}

                          </div>


                          {/* MOBILE / TABLET PRICE */}

                          <div className="md:hidden">

                            <p className="text-yellow-400 text-xl font-bold">
                              ₹
                              {item.price.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                        </div>


                        {/* =====================================
                            PRICE
                        ===================================== */}

                        <p className="hidden md:block text-yellow-400 text-lg font-semibold mt-4">
                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}
                        </p>


                        {/* =====================================
                            CONTROLS
                        ===================================== */}

                        <div className="flex items-center justify-between mt-6">


                          {/* QUANTITY */}

                          <div className="flex items-center">

                            <button
                              type="button"
                              disabled={
                                item.quantity <= 1
                              }
                              onClick={() => {

                                if (
                                  item.quantity > 1
                                ) {

                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                    item.flavourId ??
                                      undefined
                                  );

                                }

                              }}
                              className="w-10 h-10 rounded-l-lg bg-[#142D40] border border-white/10 flex items-center justify-center hover:bg-[#1B3549] disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                              <Minus size={17} />
                            </button>


                            <div className="w-12 h-10 bg-[#142D40] border-y border-white/10 flex items-center justify-center font-bold">
                              {item.quantity}
                            </div>


                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item.flavourId ??
                                    undefined
                                )
                              }
                              className="w-10 h-10 rounded-r-lg bg-[#142D40] border border-white/10 flex items-center justify-center hover:bg-[#1B3549] transition"
                            >
                              <Plus size={17} />
                            </button>

                          </div>


                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                item.productId,
                                item.flavourId ??
                                  undefined
                              )
                            }
                            className="w-10 h-10 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center justify-center transition"
                            title={
                              hasFlavour
                                ? `Remove ${item.flavourName}`
                                : "Remove item"
                            }
                          >
                            <Trash2 size={19} />
                          </button>

                        </div>

                      </div>


                      {/* =======================================
                          DESKTOP SUBTOTAL
                      ======================================= */}

                      <div className="hidden sm:flex flex-col items-end justify-between min-w-[130px]">

                        <div className="text-right">

                          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                            Subtotal
                          </p>


                          <p className="text-2xl font-black">
                            ₹
                            {item.subtotal.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* =========================================
                        MOBILE SUBTOTAL
                    ========================================= */}

                    <div className="sm:hidden border-t border-white/10 mt-5 pt-4 flex items-center justify-between">

                      <span className="text-white/40 text-sm">
                        Subtotal
                      </span>


                      <span className="text-xl font-bold">
                        ₹
                        {item.subtotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                  </div>
                );
              }
            )}

          </div>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="lg:col-span-1">

            <div className="lg:sticky lg:top-24">

              <div className="bg-[#0D2131] border border-white/10 rounded-2xl overflow-hidden">


                {/* =========================================
                    SUMMARY HEADER
                ========================================= */}

                <div className="px-6 sm:px-7 pt-6 sm:pt-7 pb-5 border-b border-white/10">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-yellow-400 uppercase tracking-[0.18em] text-xs font-bold mb-2">
                        Your Order
                      </p>


                      <h2 className="text-2xl sm:text-3xl font-black">
                        Order Summary
                      </h2>

                    </div>


                    <div className="w-11 h-11 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">

                      <ShoppingBag
                        size={20}
                        className="text-yellow-400"
                      />

                    </div>

                  </div>

                </div>


                {/* =========================================
                    SUMMARY DETAILS
                ========================================= */}

                <div className="px-6 sm:px-7 py-6">


                  {/* ITEMS */}

                  <div className="flex items-center justify-between mb-4">

                    <span className="text-white/60">
                      Items
                    </span>


                    <span className="font-semibold">
                      {totalItems}
                    </span>

                  </div>


                  {/* PRODUCTS */}

                  <div className="flex items-center justify-between mb-6">

                    <span className="text-white/60">
                      Products
                    </span>


                    <span className="font-semibold">
                      {cart.items.length}
                    </span>

                  </div>


                  {/* DIVIDER */}

                  <div className="border-t border-white/10 pt-5">

                    <div className="flex items-end justify-between gap-4">

                      <div>

                        <p className="text-white/50 text-sm mb-1">
                          Total
                        </p>


                        <p className="text-xs text-white/30">
                          Inclusive of product price
                        </p>

                      </div>


                      <p className="text-2xl sm:text-3xl font-black text-yellow-400 whitespace-nowrap">
                        ₹
                        {cart.totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </div>


                  {/* =====================================
                      CHECKOUT BUTTON
                  ===================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/checkout")
                    }
                    className="w-full mt-7 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_25px_rgba(250,204,21,0.12)]"
                  >
                    Proceed to Checkout

                    <ArrowLeft
                      size={18}
                      className="rotate-180"
                    />
                  </button>


                  {/* =====================================
                      CONTINUE SHOPPING
                  ===================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/")
                    }
                    className="w-full mt-3 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <ArrowLeft size={17} />

                    Continue Shopping
                  </button>

                </div>


                {/* =========================================
                    SECURE CHECKOUT NOTE
                ========================================= */}

                <div className="px-6 sm:px-7 py-4 bg-[#0B1B2A] border-t border-white/10">

                  <div className="flex items-center justify-center gap-2 text-white/40 text-xs">

                    <ShieldCheck
                      size={16}
                      className="text-yellow-400/70"
                    />

                    Secure checkout & protected payment

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
