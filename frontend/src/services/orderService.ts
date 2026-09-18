import axios from "axios";
import type { AxiosInstance } from "axios";


/*
 * OXN backend:
 *
 * Development:
 *     http://localhost:8084/api
 *
 * Production:
 *     /api
 *
 * Keeping the development port explicit prevents the frontend
 * from sending the checkout request to the wrong server/port.
 */
const API_URL =
  (import.meta.env.VITE_API_URL as string) ||
  (import.meta.env.DEV
    ? "http://localhost:8084/api"
    : "/api");


const api: AxiosInstance =
  axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type":
        "application/json",
    },
  });


export interface CheckoutRequest {
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}


export interface OrderItem {
  productId: number;
  productName: string;
  imageUrl: string | null;

  /*
   * Flavour details are optional so this remains
   * compatible with existing order responses.
   */
  flavourId?: number | null;
  flavourName?: string | null;
  weight?: string | null;

  price: number;
  quantity: number;
  subtotal: number;
}


export interface Order {
  id: number;

  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  totalAmount: number;

  paymentStatus: string;
  orderStatus: string;

  orderDate: string;

  items: OrderItem[];
}


export const orderService = {

  /*
   * ========================================================
   * PLACE ORDER / CHECKOUT
   * ========================================================
   */
  async checkout(
    request: CheckoutRequest
  ): Promise<Order> {

    const response =
      await api.post<Order>(
        "/orders/checkout",
        request
      );

    return response.data;
  },


  /*
   * ========================================================
   * GET ORDER
   * ========================================================
   */
  async getOrder(
    orderId: number
  ): Promise<Order> {

    const response =
      await api.get<Order>(
        `/orders/${orderId}`
      );

    return response.data;
  },


  /*
   * ========================================================
   * CUSTOMER ORDERS
   * ========================================================
   */
  async getCustomerOrders(
    customerId: string
  ): Promise<Order[]> {

    const response =
      await api.get<Order[]>(
        `/orders/customer/${encodeURIComponent(
          customerId
        )}`
      );

    return response.data;
  },
};


export default orderService;
