"use client"

import { useState } from "react";
import { FiStar } from "react-icons/fi";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, review?: string) => Promise<void>;
    initialRating?: number;
}

const RatingModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialRating = 0
}: RatingModalProps) => {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", isError: false });

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit(rating, review);
            setToast({ show: true, message: "Rating submitted successfully", isError: false });
            setTimeout(() => {
                setToast({ show: false, message: "", isError: false });
                onClose();
            }, 1500);
        } catch  {
            setToast({ show: true, message: "Error submitting rating", isError: true });
            setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Rate This Course</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>

                <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="text-2xl mx-1 focus:outline-none"
                        >
                            <FiStar
                                className={
                                    star <= (hoverRating || rating)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                }
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your thoughts about this course..."
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {toast.show && (
                    <div className={`mt-2 p-2 rounded-md ${toast.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {toast.message}
                    </div>
                )}

                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0}
                        className={`px-4 py-2 text-white rounded-md ${rating === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;