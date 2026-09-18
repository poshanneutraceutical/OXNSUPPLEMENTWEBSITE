
import { X, ShoppingBag } from "lucide-react";
import { createPortal } from "react-dom";
import type { Product } from "../lib/api";
import ProductCarousel from "./ProductCarousel";

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: number) => void;
  addingProductId: number | null;
}

export default function ProductQuickView({
  product,
  isOpen,
  onClose,
  onAddToCart,
  addingProductId,
}: ProductQuickViewProps) {
  if (!isOpen || !product) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999999] bg-black/90 backdrop-blur-lg flex items-center justify-center p-5"
      onClick={onClose}
    >
      {/* Close Button */}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-6 right-6 z-[10000000] w-12 h-12 rounded-full bg-[#10283A] border border-[#1976C5]/30 hover:bg-[#1976C5] hover:text-black transition-all duration-300 flex items-center justify-center"
      >
        <X size={22} />
      </button>

      {/* Modal */}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0B1B2A] border border-[#1976C5]/20 shadow-[0_0_60px_rgba(25,118,197,0.12)]"
      >
        <div className="grid lg:grid-cols-2 gap-12 p-8 lg:p-10">

          {/* Left */}

          <div>

            <ProductCarousel
              images={product.images}
              productName={product.name}
            />

          </div>

          {/* Right */}

          <div className="flex flex-col justify-center">

            {product.badge && (

              <span className="inline-block bg-[#1976C5] text-black font-bold uppercase tracking-[0.2em] text-xs px-4 py-2 rounded-full mb-6 w-fit">

                {product.badge}

              </span>

            )}

            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5">

              {product.name}

            </h2>

            <div className="text-4xl font-black text-[#1976C5] mb-8">

              ₹{Number(product.price).toLocaleString("en-IN")}

            </div>

            <div className="mb-8">

              <h3 className="text-[#1976C5] uppercase tracking-[0.2em] text-sm font-semibold mb-3">

                Product Description

              </h3>

              <p className="text-gray-300 leading-8">

                {product.description}

              </p>

            </div>

            <div className="space-y-4 mb-10">

              <div className="flex justify-between items-center border-b border-[#1976C5]/15 pb-3">

                <span className="text-gray-400 uppercase text-sm tracking-wider">

                  Category

                </span>

                <span className="text-white font-semibold capitalize">

                  {product.category}

                </span>

              </div>

              <div className="flex justify-between items-center border-b border-[#1976C5]/15 pb-3">

                <span className="text-gray-400 uppercase text-sm tracking-wider">

                  Availability

                </span>

                <span
                  className={
                    product.inStock
                      ? "text-green-400 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>

              </div>

            </div>

            <button
              disabled={
                !product.inStock ||
                addingProductId === product.id
              }
              onClick={() => onAddToCart(product.id)}
              className="flex items-center justify-center gap-3 rounded-full bg-[#1976C5] hover:bg-[#2B86D0] text-black py-4 text-lg font-bold transition-all duration-300 shadow-[0_0_35px_rgba(25,118,197,0.25)] disabled:opacity-50"
            >

              <ShoppingBag size={20} />

              {addingProductId === product.id
                ? "ADDING..."
                : "ADD TO CART"}

            </button>

          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}
