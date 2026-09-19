import { useEffect, useRef, useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { type Product } from "../lib/api";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";
import ProductCarousel from "./ProductCarousel";
import ProductBackground from "./ProductBackground";
import ProductQuickView from "./ProductQuickView";

/*
 * ============================================================
 * OXN PRODUCTS
 * ============================================================
 *
 * The old OXN flow treated one parent product as a product and
 * the five flavours as a second-level catalogue.
 *
 * The new OXN flow treats each flavour as an independent product:
 *
 * 1. Birthday Cake
 * 2. Cookies & Cream
 * 3. Chocolate Hazelnut
 * 4. Double Rich Chocolate
 * 5. Strawberry Cheesecake
 *
 * The backend is the primary source of product data. These local
 * records are the fallback used when the API is unavailable.
 * ============================================================
 */

const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "Birthday Cake",
    price: 16999,
    description:
      "OXN Whey Protein in Birthday Cake flavour.",
    category: "Whey Protein",
    images: ["/products/oxn/birthday-cake.png"],
    badge: "OXN WHEY",
    featured: true,
    inStock: true,
  },
  {
    id: 2,
    name: "Cookies & Cream",
    price: 16999,
    description:
      "OXN Whey Protein in Cookies & Cream flavour.",
    category: "Whey Protein",
    images: ["/products/oxn/cookies-and-cream.png"],
    badge: "OXN WHEY",
    featured: true,
    inStock: true,
  },
  {
    id: 3,
    name: "Chocolate Hazelnut",
    price: 16999,
    description:
      "OXN Whey Protein in Chocolate Hazelnut flavour.",
    category: "Whey Protein",
    images: ["/products/oxn/chocolate-hazelnut.png"],
    badge: "OXN WHEY",
    featured: true,
    inStock: true,
  },
  {
    id: 4,
    name: "Double Rich Chocolate",
    price: 16999,
    description:
      "OXN Whey Protein in Double Rich Chocolate flavour.",
    category: "Whey Protein",
    images: ["/products/oxn/double-rich-chocolate.png"],
    badge: "OXN WHEY",
    featured: true,
    inStock: true,
  },
  {
    id: 5,
    name: "Strawberry Cheesecake",
    price: 16999,
    description:
      "OXN Whey Protein in Strawberry Cheesecake flavour.",
    category: "Whey Protein",
    images: ["/products/oxn/strawberry-cheesecake.png"],
    badge: "OXN WHEY",
    featured: true,
    inStock: true,
  },
];

/*
 * Keep the local OXN photography associated with the backend
 * product IDs. The backend seed creates these five products in
 * this order, starting from ID 1.
 */
const productImageMap: Record<number, string> = {
  1: "/products/oxn/birthday-cake.png",
  2: "/products/oxn/cookies-and-cream.png",
  3: "/products/oxn/chocolate-hazelnut.png",
  4: "/products/oxn/double-rich-chocolate.png",
  5: "/products/oxn/strawberry-cheesecake.png",
};

const productNames = [
  "Birthday Cake",
  "Cookies & Cream",
  "Chocolate Hazelnut",
  "Double Rich Chocolate",
  "Strawberry Cheesecake",
];

function getFallbackProduct(productId: number) {
  return (
    fallbackProducts.find(
      (product) => product.id === productId
    ) || fallbackProducts[0]
  );
}

export default function Products() {
  const { addToCart } = useCart();

  const [products, setProducts] =
    useState<Product[]>(fallbackProducts);

  const [loading, setLoading] = useState(true);

  const [addingProductId, setAddingProductId] =
    useState<number | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [quickViewOpen, setQuickViewOpen] =
    useState(false);

  const cardRefs = useRef<
    (HTMLDivElement | null)[]
  >([]);

  /* ============================================================
     LOAD PRODUCTS
  ============================================================ */

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const backendProducts =
          await api.getProducts();

        if (cancelled) {
          return;
        }

        /*
         * Only use the five OXN products we expect. This prevents an
         * accidental old product returned by an existing API/database
         * from appearing in the new storefront.
         */
        const oxnProducts = backendProducts
          .filter((product) =>
            productNames.some(
              (name) =>
                name.toLowerCase() ===
                product.name.trim().toLowerCase()
            )
          )
          .slice(0, 5);

        const mergedProducts =
          fallbackProducts.map((fallback) => {
            const backend = oxnProducts.find(
              (product) =>
                product.name.trim().toLowerCase() ===
                fallback.name.trim().toLowerCase()
            );

            const image =
              productImageMap[fallback.id] ||
              fallback.images[0];

            return {
              ...fallback,
              ...backend,
              id: backend?.id ?? fallback.id,
              name: backend?.name ?? fallback.name,
              price:
                backend?.price ?? fallback.price,
              description:
                backend?.description ??
                fallback.description,
              category:
                backend?.category ?? fallback.category,
              images: [image],
              badge:
                backend?.badge ?? fallback.badge,
              featured:
                backend?.featured ?? fallback.featured,
              inStock:
                backend?.inStock ?? fallback.inStock,
              flavours: undefined,
            };
          });

        setProducts(mergedProducts);
      } catch (error) {
        console.error(
          "Unable to load OXN products:",
          error
        );

        /*
         * The local five-product fallback remains visible if the
         * backend is temporarily unavailable.
         */
        setProducts(fallbackProducts);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ============================================================
     ADD PRODUCT TO CART
  ============================================================ */

  const handleAddToCart = async (
    productId: number
  ) => {
    const product =
      products.find(
        (item) => item.id === productId
      ) || getFallbackProduct(productId);

    if (!product || !product.inStock) {
      return;
    }

    try {
      setAddingProductId(productId);

      /*
       * Each flavour is now its own Product row, so there is no
       * flavourId to pass to the cart anymore.
       */
      await addToCart(productId, 1);

      alert(
        `${product.name} added to cart`
      );
    } catch (error) {
      console.error(
        "Failed to add OXN product to cart:",
        error
      );

      alert(
        "Unable to add product to cart."
      );
    } finally {
      setAddingProductId(null);
    }
  };

  /* ============================================================
     QUICK VIEW
  ============================================================ */

  const openQuickView = (
    product: Product
  ) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
    setSelectedProduct(null);
  };

  /* ============================================================
     MOUSE TILT
  ============================================================ */

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const card = cardRefs.current[index];

    if (!card) {
      return;
    }

    const rect =
      card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX =
      ((y - centerY) / centerY) * -4;

    const rotateY =
      ((x - centerX) / centerX) * 4;

    card.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const handleMouseLeave = (
    index: number
  ) => {
    const card = cardRefs.current[index];

    if (!card) {
      return;
    }

    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section
      id="products"
      className="
        relative
        py-24
        bg-[#071824]
        stripe-bg
        overflow-hidden
      "
    >
      <ProductBackground />

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          relative
          z-10
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            text-center
            mb-14
            md:mb-16
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              mb-4
            "
          >
            <div
              className="
                w-8
                h-[2px]
                bg-[#FF6A00]
              "
            />

            <span
              className="
                text-[#FF6A00]
                text-xs
                tracking-[0.3em]
                uppercase
                font-bold
              "
            >
              OXN Nutrition
            </span>

            <div
              className="
                w-8
                h-[2px]
                bg-[#FF6A00]
              "
            />
          </div>

          <h2
            className="
              text-5xl
              md:text-6xl
              font-black
              uppercase
              text-white
              tracking-tight
            "
          >
            OXN {" "}
            <span className="text-[#FF6A00]">
              Products
            </span>
          </h2>

          <p
            className="
              text-white/50
              max-w-2xl
              mx-auto
              mt-4
              text-sm
              md:text-base
            "
          >
            Explore the OXN Whey Protein
            range and choose your flavour.
          </p>
        </div>

        {/* ==================================================
            FIVE PRODUCT CARDS
        ================================================== */}

        {loading ? (
          <div
            className="
              min-h-[360px]
              flex
              items-center
              justify-center
              text-[#FF6A00]
              text-sm
              uppercase
              tracking-[0.25em]
              font-bold
            "
          >
            Loading OXN products...
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >
            {products.map((product, index) => {
              const isAdding =
                addingProductId === product.id;

              return (
                <article
                  key={product.id}
                  ref={(element) => {
                    cardRefs.current[index] =
                      element;
                  }}
                  onMouseMove={(event) =>
                    handleMouseMove(
                      event,
                      index
                    )
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(index)
                  }
                  className="
                    product-card
                    group
                    relative
                    bg-[#10283A]
                    border
                    border-[#FF6A00]/20
                    hover:border-[#FF6A00]/60
                    overflow-hidden
                    rounded-2xl
                    transition-all
                    duration-300
                    flex
                    flex-col
                  "
                >
                  {/* PRODUCT IMAGE */}
                  <button
                    type="button"
                    onClick={() =>
                      openQuickView(product)
                    }
                    className="
                      relative
                      aspect-square
                      overflow-hidden
                      bg-[#0B2031]
                      w-full
                      text-left
                      cursor-pointer
                    "
                  >
                    <span
                      className="
                        absolute
                        top-4
                        left-4
                        z-20
                        bg-[#FF6A00]
                        text-black
                        px-3
                        py-1.5
                        rounded-full
                        text-[10px]
                        font-black
                        tracking-widest
                        uppercase
                      "
                    >
                      OXN WHEY
                    </span>

                    <ProductCarousel
                      images={product.images}
                      productName={product.name}
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/75
                        via-transparent
                        to-transparent
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0
                        p-5
                        opacity-0
                        translate-y-2
                        group-hover:opacity-100
                        group-hover:translate-y-0
                        transition-all
                        duration-300
                      "
                    >
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-white/20
                          bg-black/40
                          backdrop-blur-md
                          px-4
                          py-2
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-white
                        "
                      >
                        View Product
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </button>

                  {/* PRODUCT INFORMATION */}
                  <div
                    className="
                      p-6
                      flex
                      flex-col
                      flex-1
                    "
                  >
                    <div
                      className="
                        text-[0.65rem]
                        tracking-[0.2em]
                        text-[#FF6A00]
                        uppercase
                        font-bold
                        mb-2
                      "
                    >
                      {product.category ||
                        "Whey Protein"}
                    </div>

                    <h3
                      className="
                        text-2xl
                        font-black
                        uppercase
                        text-white
                        tracking-tight
                      "
                    >
                      {product.name}
                    </h3>

                    <p
                      className="
                        mt-4
                        text-sm
                        text-white/50
                        leading-relaxed
                        min-h-[50px]
                      "
                    >
                      {product.description ||
                        "Premium OXN Whey Protein flavour."}
                    </p>

                    <div
                      className="
                        mt-5
                        pt-4
                        border-t
                        border-white/10
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        <div>
                          <div
                            className="
                              text-[10px]
                              uppercase
                              tracking-widest
                              text-white/35
                              mb-1
                            "
                          >
                            Price
                          </div>

                          <div
                            className="
                              text-2xl
                              sm:text-3xl
                              font-black
                              text-white
                            "
                          >
                            {Number(
                              product.price
                            ) > 0
                              ? `₹${Number(
                                  product.price
                                ).toLocaleString(
                                  "en-IN"
                                )}/-`
                              : "Price TBA"}
                          </div>
                        </div>

                        <div
                          className={`
                            text-xs
                            uppercase
                            tracking-wider
                            font-bold
                            ${
                              product.inStock
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          `}
                        >
                          {product.inStock
                            ? "In Stock"
                            : "Sold Out"}
                        </div>
                      </div>
                    </div>

                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openQuickView(
                            product
                          )
                        }
                        className="
                          min-h-[48px]
                          rounded-xl
                          border
                          border-white/15
                          bg-white/[0.03]
                          text-white
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          flex
                          items-center
                          justify-center
                          gap-2
                          hover:bg-white/[0.08]
                          hover:border-white/30
                          transition-all
                        "
                      >
                        View Details
                        <ArrowRight
                          size={15}
                        />
                      </button>

                      <button
                        type="button"
                        disabled={
                          !product.inStock ||
                          isAdding
                        }
                        onClick={() =>
                          handleAddToCart(
                            product.id
                          )
                        }
                        className="
                          min-h-[48px]
                          rounded-xl
                          bg-[#FF6A00]
                          text-black
                          text-xs
                          font-black
                          uppercase
                          tracking-wider
                          flex
                          items-center
                          justify-center
                          gap-2
                          hover:bg-[#FF8A1F]
                          transition-all
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                      >
                        <ShoppingBag
                          size={16}
                        />

                        {isAdding
                          ? "Adding..."
                          : "Add"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <ProductQuickView
        product={selectedProduct}
        isOpen={quickViewOpen}
        onClose={closeQuickView}
        onAddToCart={handleAddToCart}
        addingProductId={addingProductId}
      />
    </section>
  );
}
