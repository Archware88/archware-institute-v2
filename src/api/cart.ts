import { get, post, del } from "./api";
import { ICartItem, ICourse, ISavedItem } from "../types/types";
import { API_URL } from "./constants";

/*********************
 * CART API FUNCTIONS *
 *********************/

/**
 * Adds a course to the user's cart
 * @param courseId - ID of the course to add
 * @returns Promise with the updated cart or null if failed
 */
export const addToCart = async (
  courseId: string | number
): Promise<boolean> => {
  try {
    const response = await post<{
      status: boolean;
      message: string;
      cart: ICartItem[];
    }>(`/course/${courseId}/add-to-cart`);
    return response.status;
  } catch (error) {
    console.error("Add to cart API error:", error);
    return false;
  }
};

/**
 * Gets all items in the user's cart
 * @returns Promise with cart items array or null if failed
 */
export const getCartItems = async (): Promise<ICartItem[] | null> => {
  try {
    const response = await get<{
      status: boolean;
      cart_courses: ICartItem[];
    }>("/get-course-cart");
    return response.status ? response.cart_courses : null;
  } catch (error) {
    console.error("Get cart items API error:", error);
    return null;
  }
};

/**
 * Removes an item from the cart
 * @param courseId - ID of the course to remove
 * @returns Promise with success status
 */
export const removeFromCart = async (
  courseId: string | number
): Promise<boolean> => {
  try {
    const response = await del<{
      status: boolean;
      message: string;
    }>(`/remove-from-cart/${courseId}`);
    return response.status;
  } catch (error) {
    console.error("Remove from cart API error:", error);
    return false;
  }
};

/**
 * Checks out the cart and processes payment
 * @param paymentMethod - Selected payment method
 * @returns Promise with order confirmation or null if failed
 */
export const checkoutCart = async (
  paymentMethod: string
): Promise<{
  orderId: string;
  courses: ICourse[];
} | null> => {
  try {
    const response = await post<{
      status: boolean;
      order: {
        orderId: string;
        courses: ICourse[];
      };
    }>("/checkout", { paymentMethod });
    return response.status ? response.order : null;
  } catch (error) {
    console.error("Checkout API error:", error);
    return null;
  }
};

/**
 * Gets cart item count
 * @returns Promise with item count
 */
export const getCartItemCount = async (): Promise<number> => {
  try {
    const cart = await getCartItems();
    return cart ? cart.length : 0;
  } catch (error) {
    console.error("Get cart count error:", error);
    return 0;
  }
};

/**
 * Checks if a course is already in the cart
 * @param courseId - ID of the course to check
 * @returns Promise with boolean indicating if course exists in cart
 */
export const isCourseInCart = async (
  courseId: string | number
): Promise<boolean> => {
  try {
    const cart = await getCartItems();
    return cart ? cart.some((item) => item?.course?.id === courseId) : false;
  } catch (error) {
    console.error("Check course in cart error:", error);
    return false;
  }
};

/*************************
 * SAVED ITEMS API FUNCTIONS *
 *************************/

/**
 * Gets all saved items for the user
 * @returns Promise with saved items array or null if failed
 */
export const getSavedItems = async (): Promise<ISavedItem[] | null> => {
  try {
    const response = await get<ISavedItem[]>("/saved-items");
    return Array.isArray(response) ? response : null;
  } catch (error) {
    console.error("Get saved items API error:", error);
    return null;
  }
};

/**
 * Adds a course to saved items
 * @param courseId - ID of the course to save
 * @returns Promise with success status
 */
export const addToSavedItems = async (
  courseId: string | number
): Promise<boolean> => {
  try {
    const response = await post<{
      status: boolean;
      message: string;
      saved_item: ISavedItem;
    }>(`/saved-items/${courseId}`);
    return response.status;
  } catch (error) {
    console.error("Add to saved items API error:", error);
    return false;
  }
};

/**
 * Removes a course from saved items
 * @param courseId - ID of the course to remove
 * @returns Promise with success status
 */
export const removeFromSavedItems = async (
  courseId: string | number
): Promise<boolean> => {
  try {
    const response = await del<{
      status: boolean;
      message: string;
    }>(`/saved-items/${courseId}`);
    return response.status;
  } catch (error) {
    console.error("Remove from saved items API error:", error);
    return false;
  }
};

/**
 * Checks if a course is in saved items
 * @param courseId - ID of the course to check
 * @returns Promise with boolean indicating if course exists in saved items
 */
export const isCourseSaved = async (
  courseId: string | number
): Promise<boolean> => {
  try {
    const savedItems = await getSavedItems();
    return savedItems
      ? savedItems.some((item) => item?.course?.id === courseId)
      : false;
  } catch (error) {
    console.error("Check course in saved items error:", error);
    return false;
  }
};

/**
 * Moves all saved items to cart
 * @returns Promise with operation result
 */
export const moveSavedItemsToCart = async (): Promise<{
  moved_items: number[];
  failed_items: Array<{ course_id: number; reason: string }>;
  moved_count: number;
  failed_count: number;
} | null> => {
  try {
    const response = await post<{
      status: boolean;
      message: string;
      moved_items: number[];
      failed_items: Array<{ course_id: number; reason: string }>;
      moved_count: number;
      failed_count: number;
    }>("/saved-items/move-to-cart");
    return response.status
      ? {
          moved_items: response.moved_items,
          failed_items: response.failed_items,
          moved_count: response.moved_count,
          failed_count: response.failed_count,
        }
      : null;
  } catch (error) {
    console.error("Move saved items to cart API error:", error);
    return null;
  }
};

/**
 * Moves a single saved item to cart
 * @param courseId - ID of the course to move
 * @returns Promise with success status
 */
export const moveSavedItemToCart = async (
  courseId: string | number
): Promise<boolean> => {
  try {
    const response = await post<{
      status: boolean;
      message: string;
      cart_item: ICartItem;
    }>(`/saved-items/${courseId}/move-to-cart`);
    return response.status;
  } catch (error) {
    console.error("Move saved item to cart API error:", error);
    return false;
  }
};

/**
 * Gets saved items count
 * @returns Promise with item count
 */
export const getSavedItemsCount = async (): Promise<number> => {
  try {
    const savedItems = await getSavedItems();
    return savedItems ? savedItems.length : 0;
  } catch (error) {
    console.error("Get saved items count error:", error);
    return 0;
  }
};



export const clearCart = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/cart/clear`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to clear cart");
    }

    return true;
  } catch (error) {
    console.error("Clear cart error:", error);
    return false;
  }
};

export const clearCartAfterPayment = async (
  courseIds: number[]
): Promise<boolean> => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const response = await fetch(`${API_URL}/cart/clear-after-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      body: JSON.stringify({
        course_ids: courseIds.map((id) => Number(id)), // Ensure numbers
        user_id: userData.id,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      throw new Error(data.message || "Failed to clear cart");
    }

    return true;
  } catch (error) {
    console.error("Clear cart error:", error);
    throw error;
  }
};