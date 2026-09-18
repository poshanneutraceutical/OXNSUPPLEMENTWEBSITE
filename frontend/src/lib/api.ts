const API_URL =
  (import.meta.env.VITE_API_URL as string) ||
  (import.meta.env.DEV
    ? "http://localhost:8084/api"
    : "/api");


export type ProductFlavour = {

  id: number;

  productId: number;

  flavourName: string;

  description: string | null;

  inStock: boolean;

  price: number;

  weight: string | null;

  images: string[];

};


export type Product = {

  id: number;

  name: string;

  price: number;

  description: string | null;

  category: string | null;

  images: string[];

  badge: string | null;

  featured: boolean;

  inStock: boolean;

  flavours?: ProductFlavour[];

};


export type DistributorInquiry = {

  fullName: string;

  email: string;

  phone?: string;

  businessName?: string;

  city?: string;

  state?: string;

  message?: string;

};


export type ContactMessage = {

  name: string;

  email: string;

  subject?: string;

  message: string;

};


async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {

  const res =
    await fetch(
      `${API_URL}${path}`,
      {
        headers: {
          "Content-Type":
            "application/json",
        },
        ...options,
      }
    );


  const contentType =
    res.headers.get(
      "content-type"
    ) || "";


  if (!res.ok) {

    const text =
      await res
        .text()
        .catch(
          () =>
            "Request failed"
        );

    throw new Error(
      text ||
        `Request failed (${res.status})`
    );
  }


  if (res.status === 204) {

    return undefined as T;
  }


  /*
   * The API must return JSON.
   *
   * This prevents the confusing:
   * Unexpected token '<'
   * error when a frontend HTML page
   * is returned instead of API JSON.
   */
  if (
    !contentType
      .toLowerCase()
      .includes(
        "application/json"
      )
  ) {

    const text =
      await res
        .text()
        .catch(
          () => ""
        );

    throw new Error(
      `Expected JSON from ${API_URL}${path}, ` +
      `but received a non-JSON response: ` +
      `${text.slice(0, 120)}`
    );
  }


  return (await res.json()) as T;
}


export const api = {

  /*
   * ========================================================
   * PRODUCTS
   * ========================================================
   */

  getProducts: () =>
    request<Product[]>(
      "/products"
    ),


  getProduct: (
    id: number
  ) =>
    request<Product>(
      `/products/${id}`
    ),


  /*
   * ========================================================
   * PRODUCT FLAVOURS
   * ========================================================
   */

  getProductFlavours: (
    productId: number
  ) =>
    request<ProductFlavour[]>(
      `/product-flavours/product/${productId}`
    ),


  /*
   * ========================================================
   * DISTRIBUTOR
   * ========================================================
   */

  submitDistributor: (
    data: DistributorInquiry
  ) =>
    request<DistributorInquiry>(
      "/distributor",
      {
        method: "POST",
        body:
          JSON.stringify(
            data
          ),
      }
    ),


  /*
   * ========================================================
   * CONTACT
   * ========================================================
   */

  submitContact: (
    data: ContactMessage
  ) =>
    request<ContactMessage>(
      "/contact",
      {
        method: "POST",
        body:
          JSON.stringify(
            data
          ),
      }
    ),
};
