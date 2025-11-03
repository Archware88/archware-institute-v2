"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getCartItems,
  removeFromCart,
  addToCart,
  getSavedItems,
  removeFromSavedItems,
  moveSavedItemsToCart,
  clearCartAfterPayment,
} from "@/api/cart";
import { ICartItem, ICourse, ISavedItem } from "@/types/types";
import Layout from "@/components/GeneralComponents/GeneralLayout";
import { initializePaystackPayment, verifyPaystackPayment, handlePaystackCallback } from "@/api/payment";

const ShoppingCart = () => {
  const router = useRouter();
  const [cart, setCart] = useState<ICourse[]>([]);
  const [savedItems, setSavedItems] = useState<ISavedItem[]>([]);
  const [voucher, setVoucher] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [movingAllToCart, setMovingAllToCart] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    status: "idle" | "success" | "failed";
    message: string;
  }>({ status: "idle", message: "" });

  const paystackWindowRef = useRef<Window | null>(null);

  // Fetch both cart and saved items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        // Handle payment callback if returning from Paystack
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('reference') || urlParams.has('payment_status')) {
          const callbackResult = await handlePaystackCallback();
          if (callbackResult.status) {
            setPaymentStatus({
              status: "success",
              message: "Payment successful! Updating your cart...",
            });
            await clearLocalCart();
          } else {
            setPaymentStatus({
              status: "failed",
              message: callbackResult.message || "Payment verification failed",
            });
          }
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Fetch both cart and saved items in parallel
        const [cartItems, savedItemsData] = await Promise.all([
          getCartItems(),
          getSavedItems(),
        ]);

        if (cartItems) {
          setCart(formatCartItems(cartItems));
        }

        if (savedItemsData) {
          setSavedItems(formatSavedItems(savedItemsData));
        }
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCartItems = (items: ICartItem[]): ICourse[] => {
    return items.map((course) => ({
      id: Number(course.id),
      title: course.title || "Unknown Course",
      image: course.image || "/assets/images/default-course.jpg",
      authors: [course.instructor || "Unknown Instructor"],
      updated: "N/A",
      level: "Beginner",
      rating: course.average_rating || 0,
      reviews: course.students_count || 0,
      price: course.courseprices?.[0]?.course_price || 0,
      description: "",
      thumbnail: "",
      data: "",
    }));
  };

  const formatSavedItems = (items: ISavedItem[]): ISavedItem[] => {
    return items.map((item) => {
      // Handle both number and object price formats
      let priceValue = 0;

      if (item.course?.price) {
        if (typeof item.course.price === 'number') {
          priceValue = item.course.price;
        } else if (typeof item.course.price === 'object' && item.course.price !== null) {
          // Handle case where price is an object with course_price property
          priceValue = (item.course.price as unknown as { course_price: number }).course_price || 0;
        }
      }

      return {
        id: item.id,
        user_id: item.user_id,
        course_id: item.course_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        course: {
          id: item.course?.id || item.course_id,
          title: item.course?.title || "Untitled Course",
          image: item.course?.image,
          instructors: item.course?.instructors || "Unknown Instructor",
          level: item.course?.level || "Beginner",
          price: priceValue, // Use the properly extracted price
          students_count: item.course?.students_count || 0,
          average_rating: item.course?.average_rating || 0,
          description: item.course?.description || "",
          thumbnail: item.course?.thumbnail || "",
          data: item.course?.data || "",
        },
      };
    });
  };

  const refreshData = async () => {
    try {
      const [cartItems, savedItemsData] = await Promise.all([
        getCartItems(),
        getSavedItems(),
      ]);

      if (cartItems) setCart(formatCartItems(cartItems));
      if (savedItemsData) setSavedItems(formatSavedItems(savedItemsData));
    } catch (err) {
      console.error("Failed to refresh data:", err);
    }
  };

  const clearLocalCart = async () => {
    try {
      // Clear frontend state immediately
      setCart([]);

      // Clear backend cart via API
      await clearCartAfterPayment(cart.map(course => course.id));

      // Refresh data from server
      await refreshData();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleRemoveFromCart = async (id: number) => {
    try {
      const success = await removeFromCart(id);
      if (success) {
        await refreshData();
      }
    } catch (err) {
      setError("Failed to remove item from cart");
      console.error(err);
    }
  };

  const handleProceedToCheckout = async () => {
    if (cart.length === 0) return;

    setIsProcessingPayment(true);
    setPaymentStatus({ status: "idle", message: "" });

    try {
      const courseIds = cart.map(course => course.id);
      const amount = totalPrice;
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userEmail = userData?.email;

      if (!userEmail) throw new Error("User email not found");

      // Store current cart in session in case of page refresh
      sessionStorage.setItem("pending_cart", JSON.stringify(cart));

      // Initialize payment
      const { authorization_url, reference } = await initializePaystackPayment(
        amount,
        courseIds,
        userEmail
      );

      // Store reference and course IDs
      sessionStorage.setItem("paystack_reference", reference);
      sessionStorage.setItem("paystack_course_ids", JSON.stringify(courseIds));

      // Mobile detection and handling
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

      if (isMobile) {
        // For mobile devices, redirect in the same tab
        window.location.href = authorization_url;
        return;
      }

      // For desktop, open in new tab
      paystackWindowRef.current = window.open(
        authorization_url,
        'paystackWindow',
        'width=500,height=800'
      );

      if (!paystackWindowRef.current) {
        throw new Error("Popup blocked - please allow popups for this site");
      }

      // Poll for payment completion
      let attempts = 0;
      const maxAttempts = 20; // ~1 minute
      const pollInterval = setInterval(async () => {
        attempts++;

        try {
          const verification = await verifyPaystackPayment(reference);

          if (verification.data?.status === 'success') {
            // Payment successful - clear cart
            clearInterval(pollInterval);
            await clearLocalCart();

            // Close payment window if still open
            if (paystackWindowRef.current && !paystackWindowRef.current.closed) {
              paystackWindowRef.current.close();
            }

            setPaymentStatus({
              status: "success",
              message: "Payment successful! Loading your courses..."
            });

            // Redirect to success page
             router.push('/Payment/Status?status=success');
          } else if (attempts >= maxAttempts) {
            throw new Error("Payment verification timed out");
          }
        } catch (error) {
          clearInterval(pollInterval);
          setPaymentStatus({
            status: "failed",
            message: error instanceof Error ? error.message : "Payment failed"
          });
        }
      }, 3000);

    } catch (error) {
      console.error("Checkout error:", error);
      setPaymentStatus({
        status: "failed",
        message: error instanceof Error ? error.message : "Payment failed"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleRemoveSavedItem = async (id: number) => {
    try {
      const success = await removeFromSavedItems(id);
      if (success) {
        await refreshData();
      }
    } catch (err) {
      setError("Failed to remove saved item");
      console.error(err);
    }
  };

  const handleAddToCart = async (courseId: number) => {
    try {
      setAddingToCart(courseId);
      const success = await addToCart(courseId);
      if (success) {
        await removeFromSavedItems(courseId);
        await refreshData();
      }
    } catch (err) {
      setError("Failed to add item to cart");
      console.error(err);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleMoveAllToCart = async () => {
    try {
      setMovingAllToCart(true);
      const result = await moveSavedItemsToCart();
      if (result) {
        await refreshData();
      }
    } catch (err) {
      setError("Failed to move items to cart");
      console.error(err);
    } finally {
      setMovingAllToCart(false);
    }
  };

  const totalPrice = cart.reduce((acc, course) => acc + course.price, 0);

  if (initialLoading) {
    return (
      <div className="mx-auto pt-32 md:pt-44 px-4 md:px-[120px]">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto pt-32 md:pt-44 px-4 md:px-[120px]">
        <div className="text-red-500 p-4">{error}</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="mx-auto pt-32 md:pt-10 mb-20 px-4 md:px-[120px]">
        <h1 className="text-2xl font-medium">SHOPPING CART ({cart.length})</h1>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Cart Items */}
          <div className="mt-5 space-y-4 w-full lg:w-7/12">
            {cart.length > 0 ? (
              cart.map((course) => (
                <CartItem
                  key={course.id}
                  course={course}
                  onRemove={() => handleRemoveFromCart(course.id)}
                />
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-lg">
                <p>Your cart is empty</p>
              </div>
            )}
          </div>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <CheckoutSection
              totalPrice={totalPrice}
              voucher={voucher}
              onVoucherChange={setVoucher}
              isProcessingPayment={isProcessingPayment}
              paymentStatus={paymentStatus}
              onCheckout={handleProceedToCheckout}
            />
          )}
        </div>

        {/* Saved Items Section */}
        <div className="mt-8 w-full lg:w-7/12">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#1B09A2]">
              Saved Items ({savedItems.length})
            </h2>
            {savedItems.length > 0 && (
              <button
                onClick={handleMoveAllToCart}
                disabled={movingAllToCart}
                className={`text-sm bg-[#1B09A2] text-white px-3 py-1 rounded ${movingAllToCart ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {movingAllToCart ? "Moving..." : "Add All to Cart"}
              </button>
            )}
          </div>
          <div className="mt-3 space-y-4">
            {savedItems.length > 0 ? (
              savedItems.map((item) => (
                <SavedItem
                  key={item.id}
                  item={item}
                  isAdding={addingToCart === item.course_id}
                  onAddToCart={() => handleAddToCart(item.course_id)}
                  onRemove={() => handleRemoveSavedItem(item.course_id)}
                />
              ))
            ) : (
              <div className="p-4 text-center bg-gray-100 rounded-lg">
                <p>No saved items</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Reusable Cart Item Component
const CartItem = ({
  course,
  onRemove,
}: {
  course: ICourse;
  onRemove: () => void;
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-white border-2 border-[#01010111] rounded-lg">
    <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0">
      <Image
        src={course.image || ""}
        alt={course.title}
        className="w-full h-full object-cover rounded-md"
        height={100}
        width={100}
      />
    </div>
    <div className="ml-0 sm:ml-4 flex-grow w-full">
      <h2 className="font-medium text-sm sm:text-base">{course.title}</h2>
      <div className="flex flex-wrap items-center h-6 pt-2">
        <p className="text-xs text-[#010101] mr-2">By {course.authors}</p>
        <div className="hidden sm:block w-[1px] h-3 bg-[#010101] mr-2"></div>
        <p className="text-xs text-[#010101]"> • {course.level}</p>
      </div>
      <div className="flex flex-wrap items-center h-6 pt-2">
        <p className="text-xs text-[#010101]">Updated {course.updated}</p>
        <p className="text-xs text-[#010101] ml-2">
          {" "}
          • ⭐ {course.rating} ({course.reviews} Reviews)
        </p>
      </div>
      <div className="flex justify-between items-center pt-2">
        <p className="text-lg font-bold text-[#1B09A2]">
          N {course.price.toLocaleString()}
        </p>
        <button
          onClick={onRemove}
          className="text-[#1B09A2] hover:underline flex items-start cursor-pointer text-sm sm:text-base"
        >
          🗑 Remove
        </button>
      </div>
    </div>
  </div>
);

// Reusable Saved Item Component
const SavedItem = ({
  item,
  onAddToCart,
  onRemove,
  isAdding,
}: {
  item: ISavedItem;
  onAddToCart: () => void;
  onRemove: () => void;
  isAdding: boolean;
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-gray-100 rounded-lg">
    <div className="w-full sm:w-20 h-20 mb-4 sm:mb-0">
      <Image
        src={item.course.image || "/assets/images/default-course.jpg"}
        alt={item.course.title}
        className="w-full h-full object-cover rounded-md"
        height={100}
        width={100}
      />
    </div>
    <div className="ml-0 sm:ml-4 flex-grow w-full">
      <h2 className="font-semibold text-sm sm:text-base">
        {item.course.title}
      </h2>
      <p className="text-sm text-gray-500">
        By {item.course.instructors || "Unknown Instructor"} •{" "}
        {item.course.level || "Beginner"}
      </p>
      <div className="flex justify-between items-center pt-2">
        <p className="text-lg font-bold text-blue-600">
          N {(typeof item.course.price === 'number' ? item.course.price : 0).toLocaleString()}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onAddToCart}
            disabled={isAdding}
            className={`text-blue-600 ${isAdding ? "opacity-50 cursor-not-allowed" : "hover:underline"
              } text-sm sm:text-base`}
          >
            {isAdding ? "Adding..." : "➕ Add to cart"}
          </button>

          <button
            onClick={onRemove}
            className="text-red-600 hover:underline cursor-pointer text-sm sm:text-base"
          >
            🗑 Remove
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Reusable Checkout Section Component
const CheckoutSection = ({
  totalPrice,
  voucher,
  onVoucherChange,
  isProcessingPayment,
  paymentStatus,
  onCheckout,
}: {
  totalPrice: number;
  voucher: string;
  onVoucherChange: (value: string) => void;
  isProcessingPayment: boolean;
  paymentStatus: {
    status: "idle" | "success" | "failed";
    message: string;
  };
  onCheckout: () => void;
}) => (
  <div className="mt-6 lg:mt-10 p-5 bg-white shadow-lg rounded-lg w-full lg:w-5/12">
    <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
      <input
        type="text"
        placeholder="Have a voucher code?"
        className="border p-2 w-full sm:flex-grow rounded-md mb-2 sm:mb-0 sm:mr-2"
        value={voucher}
        onChange={(e) => onVoucherChange(e.target.value)}
      />
      <button className="bg-[#1B09A2] text-white px-4 py-2 rounded-md w-full sm:w-auto">
        Apply
      </button>
    </div>
    <div className="flex justify-between font-semibold text-lg my-4">
      <span>Price</span>
      <span>N {totalPrice.toLocaleString()}</span>
    </div>
    <button
      onClick={onCheckout}
      disabled={isProcessingPayment}
      className={`w-full bg-[#1B09A2] text-white py-3 mt-4 rounded-md text-center ${isProcessingPayment ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
        }`}
    >
      {isProcessingPayment ? "Processing..." : "Proceed to Checkout"}
    </button>
    {paymentStatus.status !== "idle" && (
      <div
        className={`mt-3 p-2 text-center rounded ${paymentStatus.status === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
          }`}
      >
        {paymentStatus.message}
      </div>
    )}
  </div>
);

export default ShoppingCart;