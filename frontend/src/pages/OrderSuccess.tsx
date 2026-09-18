import { useEffect } from "react";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  // Prevent direct access without an order
  useEffect(() => {
    if (!order) {
      navigate("/", { replace: true });
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full bg-[#10283A] rounded-2xl border border-white/10 p-10 text-center">

        <CheckCircle
          className="mx-auto text-green-500 mb-6"
          size={90}
        />

        <h1 className="text-5xl font-bold mb-4">
          Order Placed Successfully!
        </h1>

        <p className="text-white/60 mb-8">
          Thank you for shopping with Ghost Strength.
          <br />
          Your order has been received successfully.
        </p>

        <div className="bg-[#10283A] rounded-xl border border-white/10 p-6 text-left mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Order Details
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="text-white/60">Order ID</span>
              <span>#{order.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Customer</span>
              <span>{order.customerName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Email</span>
              <span>{order.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Total Amount</span>
              <span className="font-semibold text-red-500">
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Payment Status</span>
              <span className="text-yellow-400 font-medium">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Order Status</span>
              <span className="text-green-500 font-medium">
                {order.orderStatus}
              </span>
            </div>

          </div>

        </div>

        <button
          onClick={() => navigate("/")}
          className="btn-primary flex items-center justify-center gap-2 mx-auto"
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </button>

      </div>
    </div>
  );
}

