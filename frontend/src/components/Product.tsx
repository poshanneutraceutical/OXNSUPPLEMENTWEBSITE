import { useEffect, useRef, useState } from "react";
import {
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  X,
} from "lucide-react";

import { type Product, type ProductFlavour } from "../lib/api";
import { useCart } from "../context/CartContext";
import ProductCarousel from "./ProductCarousel";
import ProductBackground from "./ProductBackground";
import { api } from "../lib/api";

/*
 * ============================================================
 * OXN PRODUCTS
 * ============================================================
 *
 * These are the OXN parent products displayed on
 * the main Products section.

 * Product IDs should match the OXN backend.
 * ============================================================
 */

const fallbackProducts: Product[] = [
  {
    id: 10,
    name: "OXN Whey Protein",
    price: 0,
    description:
      "OXN Whey Protein in a premium range of flavour profiles.",
    category: "Whey Protein",
    images: [
      "/products/oxn/birthday-cake.png",
      "/products/oxn/cookies-and-cream.png",
      "/products/oxn/chocolate-hazelnut.png",
      "/products/oxn/double-rich-chocolate.png",
      "/products/oxn/strawberry-cheesecake.png",
    ],
    badge: "OXN",
    featured: true,
    inStock: true,
  },
];

/*
 * ============================================================
 * PRODUCT GROUPS
 * ============================================================
 */

const productGroups = [
  {
    id: "oxn-whey-protein",
    productId: 10,
    title: "OXN Whey Protein",
    category: "Whey Protein",
    description:
      "Premium whey protein with five flavour profiles from the supplied OXN range.",
    flavourCount: 5,
    flavourImages: [
      "/products/oxn/birthday-cake.png",
      "/products/oxn/cookies-and-cream.png",
      "/products/oxn/chocolate-hazelnut.png",
      "/products/oxn/double-rich-chocolate.png",
      "/products/oxn/strawberry-cheesecake.png",
    ],
    flavourNames: [
      "Birthday Cake",
      "Cookies and Cream",
      "Chocolate Hazelnut",
      "Double Rich Chocolate",
      "Strawberry Cheesecake",
    ],
  },
];

/*
 * ============================================================
 * FLAVOUR IMAGE FALLBACK
 * ============================================================
 *
 * The backend remains the source for flavour information such
 * as flavourId, price, description, weight and stock.
 *
 * These local images are used as the OXN product photography
 * fallback when a backend flavour does not provide an image.
 * ============================================================
 */

const flavourImageMap: Record<
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

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function normaliseFlavourName(
  flavourName?: string | null
) {
  return (flavourName || "")
    .trim()
    .toLowerCase();
}

function getFlavourImage(
  productId: number,
  flavour: ProductFlavour,
  fallbackImage: string
) {
  const name = normaliseFlavourName(
    flavour.flavourName
  );

  /*
   * First preference:
   * backend image
   */
  if (
    flavour.images &&
    flavour.images.length > 0
  ) {
    return flavour.images[0];
  }

  /*
   * Second preference:
   * our new OXN local image
   */
  const mappedImage =
    flavourImageMap[productId]?.[name];

  if (mappedImage) {
    return mappedImage;
  }

  /*
   * Final fallback:
   * parent product image
   */
  return fallbackImage;
}

/*
 * ============================================================
 * MAIN COMPONENT
 * ============================================================
 */

export default function Products() {
  const { addToCart } = useCart();

  const [products, setProducts] =
    useState<Product[]>(fallbackProducts);

  const [loading, setLoading] =
    useState(true);

  /*
   * Which parent product's flavour catalogue is open?
   */
  const [selectedGroupId, setSelectedGroupId] =
    useState<string | null>(null);

  const [flavourLoading, setFlavourLoading] =
    useState(false);

  /*
   * Currently selected product/flavour.
   *
   * This is only used for the detailed flavour view.
   */
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [selectedFlavour, setSelectedFlavour] =
    useState<ProductFlavour | null>(null);

  const [addingFlavourId, setAddingFlavourId] =
    useState<number | null>(null);

  const cardRefs = useRef<
    (HTMLDivElement | null)[]
  >([]);

  /*
   * ============================================================
   * LOAD PRODUCTS FROM BACKEND
   * ============================================================
   *
   * We keep the frontend fallback images/text but merge the
   * real backend flavour data into the three products.
   * ============================================================
   */

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      /*
       * Load parent products and flavour rows separately.
       *
       * The OXN backend keeps flavour data in the
       * product_flavours table and exposes it through the
       * ProductFlavourController.
       */
      let backendProducts: Product[] = [];

      try {
        backendProducts =
          await api.getProducts();
      } catch (error) {
        /*
         * Keep the working frontend fallback cards even if
         * the normal product endpoint temporarily fails.
         */
        console.error(
          "Unable to load OXN parent products:",
          error
        );
      }

      const flavourResults =
        await Promise.all(
          fallbackProducts.map(
            async (frontendProduct) => {
              try {
                return await api.getProductFlavours(
                  frontendProduct.id
                );
              } catch (error) {
                console.error(
                  `Unable to load flavours for product ${frontendProduct.id}:`,
                  error
                );

                return [];
              }
            }
          )
        );

      if (cancelled) {
        return;
      }

      setProducts(
        fallbackProducts.map(
          (frontendProduct, index) => {

            const backendProduct =
              backendProducts.find(
                (backend) =>
                  backend.id ===
                  frontendProduct.id
              );

            return {
              ...frontendProduct,

              /*
               * Keep the existing OXN frontend
               * names/prices/images as the visual source,
               * while still respecting backend availability.
               */
              name:
                backendProduct?.name ||
                frontendProduct.name,

              price:
                backendProduct?.price ??
                frontendProduct.price,

              category:
                backendProduct?.category ||
                frontendProduct.category,

              description:
                frontendProduct.description ||
                backendProduct?.description ||
                null,

              inStock:
                backendProduct?.inStock ??
                frontendProduct.inStock,

              badge:
                backendProduct?.badge ||
                frontendProduct.badge,

              featured:
                backendProduct?.featured ??
                frontendProduct.featured,

              /*
               * This is the important part:
               * use the real ProductFlavour rows from
               * the OXN backend.
               */
              flavours:
                flavourResults[index],
            };
          }
        )
      );

      setLoading(false);
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ============================================================
   * GET PARENT PRODUCT
   * ============================================================
   */

  const getProductById = (
    productId: number
  ) => {
    return (
      products.find(
        (product) =>
          product.id === productId
      ) || null
    );
  };

  /*
   * ============================================================
   * OPEN FLAVOUR CATALOGUE
   * ============================================================
   */

  const openFlavourCatalogue = async (
    groupId: string
  ) => {
    setSelectedGroupId(groupId);

    setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 0);

    const group =
      productGroups.find(
        (item) => item.id === groupId
      );

    if (!group) {
      return;
    }

    setFlavourLoading(true);

    try {
      const backendFlavours =
        await api.getProductFlavours(
          group.productId
        );

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === group.productId
            ? {
                ...product,
                flavours: backendFlavours,
              }
            : product
        )
      );
    } catch (error) {
      console.error(
        `Unable to load flavours for ${group.title}:`,
        error
      );
    } finally {
      setFlavourLoading(false);
    }
  };

  /*
   * ============================================================
   * CLOSE FLAVOUR CATALOGUE
   * ============================================================
   */

  const closeFlavourCatalogue = () => {
    setSelectedGroupId(null);
  };

  /*
   * ============================================================
   * GET FLAVOURS
   * ============================================================
   */

  const getFlavoursForProduct = (
    product: Product
  ): ProductFlavour[] => {
    if (
      product.flavours &&
      product.flavours.length > 0
    ) {
      return product.flavours;
    }

    return [];
  };

  /*
   * ============================================================
   * OPEN INDIVIDUAL FLAVOUR DETAIL
   * ============================================================
   */

  const openFlavourDetail = (
    product: Product,
    flavour: ProductFlavour
  ) => {
    setSelectedProduct(product);
    setSelectedFlavour(flavour);
  };

  const closeFlavourDetail = () => {
    setSelectedProduct(null);
    setSelectedFlavour(null);
  };

  /*
   * ============================================================
   * ADD FLAVOUR TO CART
   * ============================================================
   */

  const handleAddFlavour = async (
    product: Product,
    flavour: ProductFlavour
  ) => {
    if (!product) {
      return;
    }

    if (!flavour) {
      return;
    }

    if (
      flavour.inStock === false ||
      product.inStock === false
    ) {
      return;
    }

    try {
      setAddingFlavourId(
        flavour.id
      );

      await addToCart(
        product.id,
        1,
        flavour.id
      );

      alert(
        `${product.name} - ${
          flavour.flavourName
        } added to cart`
      );
    } catch (error) {
      console.error(
        "Failed to add flavour to cart:",
        error
      );

      alert(
        "Unable to add product to cart."
      );
    } finally {
      setAddingFlavourId(null);
    }
  };

  /*
   * ============================================================
   * DIRECT PARENT ADD
   * ============================================================
   */

  const handleParentAdd = (
    productId: number
  ) => {
    const group =
      productGroups.find(
        (item) =>
          item.productId === productId
      );

    if (!group) {
      return;
    }

    openFlavourCatalogue(
      group.id
    );
  };

  /*
   * ============================================================
   * MOUSE TILT
   * ============================================================
   */

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const card =
      cardRefs.current[index];

    if (!card) {
      return;
    }

    const rect =
      card.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;

    const centerX =
      rect.width / 2;

    const centerY =
      rect.height / 2;

    const rotateX =
      ((y - centerY) / centerY) *
      -4;

    const rotateY =
      ((x - centerX) / centerX) *
      4;

    card.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = (
    index: number
  ) => {
    const card =
      cardRefs.current[index];

    if (!card) {
      return;
    }

    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  /*
   * ============================================================
   * CURRENT GROUP
   * ============================================================
   */

  const selectedGroup =
    productGroups.find(
      (group) =>
        group.id === selectedGroupId
    ) || null;

  const selectedGroupProduct =
    selectedGroup
      ? getProductById(
          selectedGroup.productId
        )
      : null;

  /*
   * ============================================================
   * FLAVOUR CATALOGUE VIEW
   * ============================================================
   */

  if (
    selectedGroup &&
    selectedGroupProduct
  ) {
    const flavours =
      getFlavoursForProduct(
        selectedGroupProduct
      );

    return (
      <section
        id="products"
        className="
          relative
          min-h-screen
          py-16
          md:py-20
          bg-[#071824]
          stripe-bg
          overflow-hidden
        "
      >
        <ProductBackground />

        <div
          className="
            relative
            z-10
            max-w-[1400px]
            mx-auto
            px-4
            sm:px-6
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              mb-8
            "
          >
            <button
              type="button"
              onClick={
                closeFlavourCatalogue
              }
              className="
                flex
                items-center
                gap-2
                text-white/70
                hover:text-white
                transition-colors
                text-sm
                uppercase
                tracking-wider
              "
            >
              <ChevronLeft
                size={20}
              />

              Back to Products
            </button>

            <div
              className="
                text-[#FF6A00]
                text-xs
                sm:text-sm
                tracking-[0.25em]
                uppercase
                font-bold
              "
            >
              {selectedGroup.flavourCount}{" "}
              Flavours
            </div>
          </div>

          <div
            className="
              mb-10
              md:mb-12
            "
          >
            <div
              className="
                text-[#FF6A00]
                text-xs
                sm:text-sm
                tracking-[0.3em]
                uppercase
                font-bold
                mb-3
              "
            >
              {selectedGroup.category}
            </div>

            <h2
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                font-black
                uppercase
                tracking-tight
                text-white
              "
            >
              {selectedGroup.title}
            </h2>

            <p
              className="
                mt-3
                text-white/55
                text-sm
                sm:text-base
                max-w-2xl
                leading-relaxed
              "
            >
              {selectedGroup.description}
            </p>
          </div>

          {flavourLoading ? (
            <div
              className="
                min-h-[300px]
                flex
                items-center
                justify-center
                text-[#FF6A00]
                text-sm
                uppercase
                tracking-wider
                font-bold
              "
            >
              Loading flavours...
            </div>
          ) : loading ? (
            <div
              className="
                py-20
                text-center
                text-white/60
              "
            >
              Loading flavours...
            </div>
          ) : flavours.length === 0 ? (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
              "
            >
              {selectedGroup.flavourImages.map(
                (image, index) => (
                  <article
                    key={image}
                    className="
                      bg-[#10283A]
                      border
                      border-[#FF6A00]/20
                      rounded-2xl
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        aspect-square
                        bg-[#0B2031]
                        flex
                        items-center
                        justify-center
                        p-8
                      "
                    >
                      <img
                        src={image}
                        alt={
                          selectedGroup
                            .flavourNames[
                            index
                          ]
                        }
                        className="
                          w-full
                          h-full
                          object-contain
                        "
                      />
                    </div>

                    <div
                      className="p-6"
                    >
                      <div
                        className="
                          text-[#FF6A00]
                          text-xs
                          tracking-[0.2em]
                          uppercase
                          font-bold
                          mb-2
                        "
                      >
                        {
                          selectedGroup.category
                        }
                      </div>

                      <h3
                        className="
                          text-2xl
                          font-black
                          text-white
                          uppercase
                        "
                      >
                        {
                          selectedGroup
                            .flavourNames[
                            index
                          ]
                        }
                      </h3>

                      <p
                        className="
                          text-white/45
                          text-sm
                          mt-3
                        "
                      >
                        Product flavour
                        information will
                        appear here once
                        this flavour is
                        added to the
                        backend.
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
                pb-10
              "
            >
              {flavours.map(
                (
                  flavour,
                  index
                ) => {
                  const image =
                    getFlavourImage(
                      selectedGroupProduct.id,
                      flavour,
                      selectedGroup
                        .flavourImages[
                        index
                      ] ||
                        selectedGroup
                          .flavourImages[0]
                    );

                  const flavourName =
                    flavour.flavourName ||
                    selectedGroup
                      .flavourNames[
                      index
                    ] ||
                    "Flavour";

                  const price =
                    flavour.price ??
                    selectedGroupProduct.price;

                  const description =
                    flavour.description ||
                    selectedGroupProduct.description ||
                    "Premium OXN nutrition formula.";

                  const inStock =
                    flavour.inStock ??
                    selectedGroupProduct.inStock;

                  const isAdding =
                    addingFlavourId ===
                    flavour.id;

                  return (
                    <article
                      key={flavour.id}
                      className="
                        group
                        relative
                        bg-[#0D2131]
                        border
                        border-white/10
                        hover:border-[#FF6A00]/50
                        rounded-2xl
                        overflow-hidden
                        transition-all
                        duration-300
                        shadow-2xl
                        flex
                        flex-col
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openFlavourDetail(
                            selectedGroupProduct,
                            flavour
                          )
                        }
                        className="
                          relative
                          aspect-square
                          bg-[#0B1B2A]
                          overflow-hidden
                          cursor-pointer
                          text-left
                          w-full
                        "
                      >
                        {selectedGroupProduct.badge && (
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
                            {
                              selectedGroupProduct.badge
                            }
                          </span>
                        )}

                        <img
                          src={image}
                          alt={`${selectedGroupProduct.name} ${flavourName}`}
                          className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-contain
                            p-8
                            transition-transform
                            duration-500
                            group-hover:scale-[1.04]
                          "
                        />

                        <div
                          className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/70
                            via-transparent
                            to-transparent
                          "
                        />

                        {!inStock && (
                          <div
                            className="
                              absolute
                              inset-0
                              z-30
                              bg-black/65
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <span
                              className="
                                text-white
                                font-black
                                tracking-[0.25em]
                                uppercase
                              "
                            >
                              Sold Out
                            </span>
                          </div>
                        )}
                      </button>

                      <div
                        className="
                          p-5
                          sm:p-6
                          flex
                          flex-col
                          flex-1
                        "
                      >
                        <div
                          className="
                            text-[#FF6A00]
                            text-[10px]
                            sm:text-xs
                            tracking-[0.22em]
                            uppercase
                            font-bold
                            mb-2
                          "
                        >
                          {
                            selectedGroup.category
                          }
                        </div>

                        <h3
                          className="
                            text-xl
                            sm:text-2xl
                            font-black
                            uppercase
                            text-white
                            tracking-tight
                          "
                        >
                          {
                            selectedGroupProduct.name
                          }
                        </h3>

                        <div
                          className="
                            mt-2
                            text-white
                            text-lg
                            font-bold
                            uppercase
                          "
                        >
                          {flavourName}
                        </div>

                        {flavour.weight && (
                          <div
                            className="
                              mt-2
                              inline-flex
                              w-fit
                              items-center
                              border
                              border-white/10
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              text-white/60
                            "
                          >
                            Weight:{" "}
                            <span
                              className="
                                ml-1
                                text-white
                                font-semibold
                              "
                            >
                              {
                                flavour.weight
                              }
                            </span>
                          </div>
                        )}

                        <p
                          className="
                            mt-4
                            text-sm
                            leading-relaxed
                            text-white/55
                            min-h-[72px]
                          "
                        >
                          {
                            description
                          }
                        </p>

                        <div
                          className="
                            mt-5
                            pt-4
                            border-t
                            border-white/10
                            flex
                            items-center
                            justify-between
                            gap-4
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
                              {Number(price) > 0
                                ? `₹${Number(price).toLocaleString("en-IN")}`
                                : "Price will be updated"}
                            </div>
                          </div>

                          <div
                            className={`
                              text-xs
                              uppercase
                              tracking-wider
                              font-bold
                              ${
                                inStock
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            `}
                          >
                            {inStock
                              ? "In Stock"
                              : "Sold Out"}
                          </div>
                        </div>

                        <div
                          className="
                            mt-5
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-3
                          "
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openFlavourDetail(
                                selectedGroupProduct,
                                flavour
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
                              hover:bg-white/[0.08]
                              hover:border-white/30
                              transition-all
                            "
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            disabled={
                              !inStock ||
                              isAdding
                            }
                            onClick={() =>
                              handleAddFlavour(
                                selectedGroupProduct,
                                flavour
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
                              : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>

        {selectedProduct &&
          selectedFlavour && (
            <div
              className="
                fixed
                inset-0
                z-[999999]
                bg-black/85
                backdrop-blur-md
                flex
                items-center
                justify-center
                p-4
              "
              onClick={
                closeFlavourDetail
              }
            >
              <div
                className="
                  relative
                  w-full
                  max-w-5xl
                  max-h-[92vh]
                  overflow-y-auto
                  bg-[#10283A]
                  border
                  border-[#FF6A00]/30
                  rounded-2xl
                  shadow-2xl
                "
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <button
                  type="button"
                  onClick={
                    closeFlavourDetail
                  }
                  className="
                    absolute
                    top-4
                    right-4
                    z-30
                    w-11
                    h-11
                    rounded-full
                    bg-black
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-[#FF6A00]
                    hover:text-black
                    transition-all
                  "
                >
                  <X
                    size={22}
                  />
                </button>

                <div
                  className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                  "
                >
                  <div
                    className="
                      min-h-[360px]
                      lg:min-h-[620px]
                      bg-[#0A1D2D]
                      flex
                      items-center
                      justify-center
                      p-8
                    "
                  >
                    <img
                      src={getFlavourImage(
                        selectedProduct.id,
                        selectedFlavour,
                        selectedProduct
                          .images?.[0] ||
                          ""
                      )}
                      alt={`${selectedProduct.name} ${selectedFlavour.flavourName}`}
                      className="
                        w-full
                        h-full
                        max-h-[580px]
                        object-contain
                      "
                    />
                  </div>

                  <div
                    className="
                      p-7
                      sm:p-10
                      flex
                      flex-col
                      justify-center
                    "
                  >
                    <div
                      className="
                        text-[#FF6A00]
                        text-xs
                        tracking-[0.3em]
                        uppercase
                        font-bold
                      "
                    >
                      {
                        selectedProduct.category
                      }
                    </div>

                    <h2
                      className="
                        mt-3
                        text-4xl
                        sm:text-5xl
                        font-black
                        uppercase
                        text-white
                      "
                    >
                      {
                        selectedProduct.name
                      }
                    </h2>

                    <div
                      className="
                        mt-3
                        text-2xl
                        font-bold
                        uppercase
                        text-white
                      "
                    >
                      {
                        selectedFlavour.flavourName
                      }
                    </div>

                    {selectedFlavour.weight && (
                      <div
                        className="
                          mt-4
                          text-sm
                          text-white/55
                        "
                      >
                        Weight:{" "}
                        <span
                          className="
                            text-white
                            font-semibold
                          "
                        >
                          {
                            selectedFlavour.weight
                          }
                        </span>
                      </div>
                    )}

                    <div
                      className="
                        mt-6
                        text-3xl
                        font-black
                        text-white
                      "
                    >
                      ₹
                      {Number(
                        selectedFlavour.price ??
                          selectedProduct.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </div>

                    <div
                      className="
                        mt-6
                        h-px
                        bg-white/10
                      "
                    />

                    <div
                      className="
                        mt-6
                        text-xs
                        uppercase
                        tracking-[0.2em]
                        text-[#FF6A00]
                        font-bold
                      "
                    >
                      Product Description
                    </div>

                    <p
                      className="
                        mt-3
                        text-sm
                        sm:text-base
                        leading-relaxed
                        text-white/60
                      "
                    >
                      {
                        selectedFlavour.description ||
                        selectedProduct.description
                      }
                    </p>

                    <div
                      className="
                        mt-7
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >
                      <div
                        className={`
                          text-sm
                          font-bold
                          uppercase
                          tracking-wider
                          ${
                            (
                              selectedFlavour.inStock ??
                              selectedProduct.inStock
                            )
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        `}
                      >
                        {(
                          selectedFlavour.inStock ??
                          selectedProduct.inStock
                        )
                          ? "In Stock"
                          : "Sold Out"}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        !(
                          selectedFlavour.inStock ??
                          selectedProduct.inStock
                        ) ||
                        addingFlavourId ===
                          selectedFlavour.id
                      }
                      onClick={() =>
                        handleAddFlavour(
                          selectedProduct,
                          selectedFlavour
                        )
                      }
                      className="
                        mt-7
                        min-h-[56px]
                        rounded-xl
                        bg-[#FF6A00]
                        text-black
                        font-black
                        uppercase
                        tracking-wider
                        flex
                        items-center
                        justify-center
                        gap-3
                        hover:bg-[#FF8A1F]
                        transition-all
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >
                      <ShoppingBag
                        size={20}
                      />

                      {addingFlavourId ===
                      selectedFlavour.id
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </section>
    );
  }

  /*
   * ============================================================
   * MAIN 3 PRODUCT CARDS
   * ============================================================
   */

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

          {/* SEO-FRIENDLY BRAND + PRODUCT HEADING */}

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
            OXN{" "}
            <span
              className="text-[#FF6A00]"
            >
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
            Premium sports nutrition
            products designed for your
            training, performance and
            goals.
          </p>
        </div>

        {/* ==================================================
            3 PARENT PRODUCTS
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          {productGroups.map(
            (group, index) => {
              const product =
                getProductById(
                  group.productId
                );

              if (!product) {
                return null;
              }

              const isAdding =
                addingFlavourId ===
                product.id;

              return (
                <article
                  key={group.id}
                  ref={(element) => {
                    cardRefs.current[
                      index
                    ] = element;
                  }}
                  onClick={() =>
                    openFlavourCatalogue(
                      group.id
                    )
                  }
                  onMouseMove={(event) =>
                    handleMouseMove(
                      event,
                      index
                    )
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(
                      index
                    )
                  }
                  className="
                    product-card
                    group
                    relative
                    bg-[#10283A]
                    border
                    border-[#FF6A00]/20
                    hover:border-[#FF6A00]/50
                    overflow-hidden
                    rounded-2xl
                    cursor-pointer
                    transition-all
                    duration-300
                    flex
                    flex-col
                  "
                >
                  <div
                    className="
                      relative
                      aspect-square
                      overflow-hidden
                      bg-[#0B2031]
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
                      "
                    >
                      NEW
                    </span>

                    <div
                      onClick={() =>
                        openFlavourCatalogue(
                          group.id
                        )
                      }
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        cursor-pointer
                      "
                    >
                      <ProductCarousel
                        images={
                          group.flavourImages
                        }
                        productName={
                          group.title
                        }
                      />
                    </div>

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/80
                        via-transparent
                        to-transparent
                      "
                    />
                  </div>

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
                      {group.category}
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
                      {group.title}
                    </h3>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mt-4
                      "
                    >
                      {group.flavourNames.map(
                        (
                          flavour,
                          flavourIndex
                        ) => (
                          <span
                            key={flavour}
                            title={flavour}
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <span
                              className="
                                w-3
                                h-3
                                rounded-full
                                bg-white
                                border
                                border-white/20
                              "
                            />

                            {flavourIndex <
                              group
                                .flavourNames
                                .length -
                                1 && (
                              <span className="text-white/20">
                                /
                              </span>
                            )}
                          </span>
                        )
                      )}

                      <span
                        className="
                          ml-1
                          text-xs
                          text-white/45
                          uppercase
                          tracking-wider
                          font-semibold
                        "
                      >
                        {
                          group.flavourCount
                        }{" "}
                        Flavours
                      </span>
                    </div>

                    <p
                      className="
                        mt-4
                        text-sm
                        text-white/50
                        leading-relaxed
                        min-h-[50px]
                      "
                    >
                      {
                        group.description
                      }
                    </p>

                    <div
                      className="
                        mt-5
                        pt-4
                        border-t
                        border-white/10
                      "
                    >
                      {/* MRP + PRICE */}
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          mb-1
                        "
                      >
                        {Number(product.price) > 0 && (
                          <span
                            className="
                              text-sm
                              text-white/40
                            "
                          >
                            MRP ₹
                            {Number(
                              product.price
                            ).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {/* FINAL PRICE */}
                      <div
                        className="
                          text-3xl
                          font-black
                          text-white
                        "
                      >
                        {Number(product.price) > 0
                          ? `₹${Number(product.price).toLocaleString("en-IN")}/-`
                          : "Price will be updated"}
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
                        onClick={(event) => {
                          event.stopPropagation();
                          openFlavourCatalogue(
                            group.id
                          );
                        }}
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
                        View More

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
                        onClick={(event) => {
                          event.stopPropagation();
                          handleParentAdd(
                            product.id
                          );
                        }}
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

                        Add
                      </button>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}