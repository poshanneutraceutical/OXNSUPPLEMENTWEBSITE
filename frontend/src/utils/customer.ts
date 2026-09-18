import { v4 as uuid } from "uuid";

const CUSTOMER_ID_KEY = "customerId";

/**
 * Returns the current customer ID.
 * Creates a new guest ID if one doesn't exist.
 */
export function getCustomerId(): string {
  try {
    let customerId = localStorage.getItem(CUSTOMER_ID_KEY);

    if (!customerId) {
      customerId = `guest-${uuid()}`;
      localStorage.setItem(CUSTOMER_ID_KEY, customerId);
    }

    return customerId;
  } catch (error) {
    console.error("Unable to access localStorage:", error);

    // Fallback (not persisted)
    return `guest-${uuid()}`;
  }
}

/**
 * Remove the current customer ID.
 * Useful when implementing logout.
 */
export function clearCustomerId(): void {
  try {
    localStorage.removeItem(CUSTOMER_ID_KEY);
  } catch (error) {
    console.error("Unable to clear customer ID:", error);
  }
}

/**
 * Replace the guest ID with a real customer ID.
 * Useful after login/signup.
 */
export function setCustomerId(customerId: string): void {
  try {
    localStorage.setItem(CUSTOMER_ID_KEY, customerId);
  } catch (error) {
    console.error("Unable to save customer ID:", error);
  }
}

/**
 * Check whether the current visitor is a guest.
 */
export function isGuestCustomer(): boolean {
  const customerId = getCustomerId();
  return customerId.startsWith("guest-");
}
