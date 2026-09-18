import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";
import { getCustomerId } from "../utils/customer";

const CUSTOMER_ID = getCustomerId();

/* =========================================================
   PRODUCT IMAGES
   Backend IDs:
   10 = OXN Whey Protein
   11 = OXN Whey Protein
   12 = OXN Whey Protein
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

const normaliseFlavourName = (
  flavourName?: string | null
) => {
  return (flavourName || "")
    .trim()
    .toLowerCase();
};

const getProductImage = (
  productId: number,
  flavourName?: string | null,
  imageUrl?: string | null
) => {
  /*
   * First use a backend-provided image if one exists.
   */
  if (imageUrl) {
    return imageUrl;
  }

  /*
   * Then use the exact local image mapped to
   * the selected flavour.
   */
  const mappedImage =
    flavourImages[productId]?.[
      normaliseFlavourName(flavourName)
    ];

  if (mappedImage) {
    return mappedImage;
  }

  /*
   * Final fallback to the parent product image.
   */
  const productImages: Record<
    number,
    string
  > = {
    10:
      "/products/oxn/double-rich-chocolate.png",
  };

  return (
    productImages[productId] ||
    "/products/oxn/double-rich-chocolate.png"
  );
};

/* =========================================================
   CHECKOUT
========================================================= */

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    loading: cartLoading,
    clearCart,
  } = useCart();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* =======================================================
     WAIT FOR CART TO LOAD
  ======================================================= */

  useEffect(() => {
    /*
     * IMPORTANT:
     * Do not redirect while the cart is still
     * being loaded from the backend.
     */

    if (cartLoading) {
      return;
    }

    /*
     * Once loading has finished, if there is
     * no cart or no items, go back to cart.
     */

    if (
      !cart ||
      !cart.items ||
      cart.items.length === 0
    ) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [
    cart,
    cartLoading,
    navigate,
  ]);

  /* =======================================================
     CART LOADING SCREEN
  ======================================================= */

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="flex flex-col items-center">

          <div className="w-11 h-11 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin" />

          <p className="mt-5 text-white/60">
            Loading checkout...
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     EMPTY CART / REDIRECTING
  ======================================================= */

  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">

        <div className="text-center">

          <div className="w-10 h-10 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-white/60">
            Redirecting to cart...
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =======================================================
     PLACE ORDER
  ======================================================= */

  const placeOrder = async () => {

    /*
     * Check required fields
     */

    if (
      !form.customerName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    /*
     * Email validation
     */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        form.email.trim()
      )
    ) {
      alert(
        "Please enter a valid email."
      );
      return;
    }

    /*
     * Indian mobile validation
     */

    if (
      !/^[6-9]\d{9}$/.test(
        form.phone.trim()
      )
    ) {
      alert(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    /*
     * Pincode validation
     */

    if (
      !/^\d{6}$/.test(
        form.pincode.trim()
      )
    ) {
      alert(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    try {

      setLoading(true);

      /*
       * Send order to backend
       */

      const order =
        await orderService.checkout({
          customerId: CUSTOMER_ID,
          customerName:
            form.customerName.trim(),
          email:
            form.email.trim(),
          phone:
            form.phone.trim(),
          address:
            form.address.trim(),
          city:
            form.city.trim(),
          state:
            form.state.trim(),
          pincode:
            form.pincode.trim(),
        });

      /*
       * Clear backend cart
       */

      await clearCart();

      /*
       * Remove any old local cart
       */

      localStorage.removeItem(
        "cart"
      );

      /*
       * Go to success page
       */

      navigate(
        "/order-success",
        {
          state: {
            order,
          },
        }
      );

    } catch (error) {

      console.error(
        "Unable to place order:",
        error
      );

      alert(
        "Unable to place order. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  /* =======================================================
     TOTAL ITEMS
  ======================================================= */

  const totalItems =
    cart.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  /* =======================================================
     CHECKOUT PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
            className="inline-flex items-center gap-2 text-white/50 hover:text-yellow-400 transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <p className="text-yellow-400 uppercase tracking-[0.2em] text-xs font-bold mb-3">
                OXN
              </p>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
                Checkout
              </h1>

              <p className="text-white/50 mt-3">
                Complete your details to place your order.
              </p>

            </div>

            <div className="flex items-center gap-2 text-white/50 text-sm">

              <ShieldCheck
                size={18}
                className="text-yellow-400"
              />

              Secure Checkout

            </div>

          </div>

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* =================================================
              CUSTOMER INFORMATION
          ================================================= */}

          <div className="lg:col-span-3">

            <div className="bg-[#0D2131] border border-white/10 rounded-2xl overflow-hidden">

              {/* HEADER */}

              <div className="px-6 sm:px-8 py-6 border-b border-white/10">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">

                    <User
                      size={19}
                      className="text-yellow-400"
                    />

                  </div>

                  <div>

                    <h2 className="text-xl sm:text-2xl font-bold">
                      Customer Details
                    </h2>

                    <p className="text-white/40 text-sm mt-1">
                      Enter your delivery information
                    </p>

                  </div>

                </div>

              </div>

              {/* FORM */}

              <div className="p-6 sm:p-8 space-y-5">

                {/* NAME */}

                <div>

                  <label className="block text-sm text-white/60 mb-2">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      type="text"
                      name="customerName"
                      value={
                        form.customerName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your full name"
                      className="w-full bg-[#142D40] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/60 transition-colors"
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label className="block text-sm text-white/60 mb-2">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      type="email"
                      name="email"
                      value={
                        form.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your email address"
                      className="w-full bg-[#142D40] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/60 transition-colors"
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div>

                  <label className="block text-sm text-white/60 mb-2">
                    Phone Number
                  </label>

                  <div className="relative">

                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full bg-[#142D40] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/60 transition-colors"
                    />

                  </div>

                </div>

                {/* ADDRESS */}

                <div>

                  <label className="block text-sm text-white/60 mb-2">
                    Delivery Address
                  </label>

                  <div className="relative">

                    <MapPin
                      size={18}
                      className="absolute left-4 top-4 text-white/30"
                    />

                    <input
                      type="text"
                      name="address"
                      value={
                        form.address
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="House no., street, area"
                      className="w-full bg-[#142D40] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/60 transition-colors"
                    />

                  </div>

                </div>

                {/* CITY + STATE */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm text-white/60 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={
                        form.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="City"
                      className="w-full bg-[#142D40] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/60 transition-colors"
                    />

                  </div>

                  <div>

                    <label className="block text-sm text-white/60 mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={
                        form.state
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="State"
                      className="w-full bg-[#142D40] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/60 transition-colors"
                    />

                  </div>

                </div>

                {/* PINCODE */}

                <div>

                  <label className="block text-sm text-white/60 mb-2">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={
                      form.pincode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="6-digit pincode"
                    maxLength={6}
                    inputMode="numeric"
                    className="w-full bg-[#142D40] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/25 outline-none focus:border-yellow-400/60 transition-colors"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="lg:col-span-2">

            <div className="lg:sticky lg:top-24">

              <div className="bg-[#0D2131] border border-white/10 rounded-2xl overflow-hidden">

                {/* HEADER */}

                <div className="px-6 sm:px-7 py-6 border-b border-white/10">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-yellow-400 uppercase tracking-[0.18em] text-xs font-bold mb-2">
                        Your Order
                      </p>

                      <h2 className="text-2xl font-black">
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

                {/* PRODUCTS */}

                <div className="p-6 sm:p-7">

                  <div className="space-y-4">

                    {cart.items.map(
                      (item) => (

                        <div
                          key={`${item.productId}-${item.flavourId ?? "parent"}`}
                          className="flex gap-4 pb-4 border-b border-white/10"
                        >

                          {/* IMAGE */}

                          <div className="w-16 h-16 flex-shrink-0 bg-[#142D40] border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">

                            <img
                              src={getProductImage(
                                item.productId,
                                item.flavourName,
                                item.imageUrl
                              )}
                              alt={
                                item.flavourName
                                  ? `${item.productName} ${item.flavourName}`
                                  : item.productName
                              }
                              className="w-full h-full object-contain p-1"
                              onError={(
                                event
                              ) => {
                                const target =
                                  event.currentTarget;

                                if (
                                  !target.src.endsWith(
                                    "/products/oxn/double-rich-chocolate.png"
                                  )
                                ) {
                                  target.src =
                                    "/products/oxn/double-rich-chocolate.png";
                                }
                              }}
                            />

                          </div>

                          {/* DETAILS */}

                          <div className="flex-1 min-w-0">

                            <p className="font-semibold leading-tight">
                              {
                                item.productName
                              }
                            </p>

                            {item.flavourName && (
                              <p className="text-sm text-yellow-400 mt-1">
                                Flavour:{" "}
                                {item.flavourName}
                              </p>
                            )}

                            {item.weight && (
                              <p className="text-xs text-white/40 mt-1">
                                Weight:{" "}
                                {item.weight}
                              </p>
                            )}

                            <p className="text-sm text-white/40 mt-1">
                              Qty:{" "}
                              {
                                item.quantity
                              }
                            </p>

                          </div>

                          {/* PRICE */}

                          <p className="font-bold whitespace-nowrap">

                            ₹
                            {item.subtotal.toLocaleString(
                              "en-IN"
                            )}

                          </p>

                        </div>

                      )
                    )}

                  </div>

                  {/* ITEMS */}

                  <div className="flex justify-between mt-5 text-white/50">

                    <span>
                      Total Items
                    </span>

                    <span className="text-white font-semibold">
                      {totalItems}
                    </span>

                  </div>

                  {/* TOTAL */}

                  <div className="border-t border-white/10 mt-5 pt-5">

                    <div className="flex items-end justify-between gap-4">

                      <div>

                        <p className="text-white/50 text-sm">
                          Order Total
                        </p>

                        <p className="text-xs text-white/30 mt-1">
                          No additional charges
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

                  {/* PLACE ORDER */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={
                      placeOrder
                    }
                    className="w-full mt-7 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 disabled:cursor-not-allowed text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                  >

                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />

                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle2
                          size={19}
                        />

                        Place Order
                      </>
                    )}

                  </button>

                  {/* BACK TO CART */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      navigate(
                        "/cart"
                      )
                    }
                    className="w-full mt-3 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                  >

                    <ArrowLeft
                      size={17}
                    />

                    Back to Cart

                  </button>

                </div>

                {/* SECURITY */}

                <div className="px-6 sm:px-7 py-4 bg-[#0B1B2A] border-t border-white/10">

                  <div className="flex items-center justify-center gap-2 text-white/40 text-xs">

                    <ShieldCheck
                      size={16}
                      className="text-yellow-400/70"
                    />

                    Your information is securely processed

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
