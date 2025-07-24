"use client"

import { useState } from "react";
import { FiStar } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import RatingModal from "./RatingModal";

interface PurchasedCardProps {
  id: number;
  image: string | null;
  title: string;
  authors: { name: string } | string | Array<{ name: string }>;
  rating: number | string; // Your API returns rating as string
  progress: number;
  total_lessons?: number;
  completed_lessons?: number;
  hasRated: boolean;
  onRateCourse: (courseId: number, rating: number, review?: string) => Promise<{ success: boolean; message?: string }>;
}

const PurchasedCard = ({
  id,
  image,
  title,
  authors,
  rating,
  progress,
  total_lessons,
  completed_lessons,
  hasRated,
  onRateCourse
}: PurchasedCardProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  // Convert rating to number if it's a string
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;

  // Calculate progress if not provided directly
  const calculatedProgress = progress ||
    (total_lessons && completed_lessons ? Math.round((completed_lessons / total_lessons) * 100) : 0);

  const getAuthorName = () => {
    if (typeof authors === 'string') return authors;
    if (Array.isArray(authors)) return authors[0]?.name || "Unknown Instructor";
    return authors?.name || "Unknown Instructor";
  };

  const handleStarClick = () => {
    if (hasRated) {
      setRatingError("You've already rated this course");
      setTimeout(() => setRatingError(null), 3000);
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitRating = async (rating: number, review?: string) => {
    const result = await onRateCourse(id, rating, review);
    if (!result.success) {
      setRatingError(result.message || "Failed to submit rating");
      setTimeout(() => setRatingError(null), 3000);
    } else {
      // Update local state if rating was successful
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white shadow-md shadow-gray rounded-lg overflow-hidden relative">
      <Link href={`/Course/${id}`} passHref>
        <div>
          <Image
            src={image || '/assets/images/course-placeholder.jpg'}
            alt={title}
            className="w-full h-48 object-cover"
            height={350}
            width={350}
          />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-xs text-gray-500">By: {getAuthorName()}</p>

        <div className="flex items-center mt-2 relative">
          <div
            className="flex"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                onMouseEnter={() => !hasRated && setHoverRating(index + 1)}
                onMouseLeave={() => !hasRated && setHoverRating(0)}
                onClick={handleStarClick}
                className={`focus:outline-none ${hasRated ? "cursor-default" : "cursor-pointer"}`}
                disabled={hasRated}
                aria-disabled={hasRated}
              >
                <FiStar
                  className={
                    index < (hoverRating || numericRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          {showTooltip && (
            <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {hasRated
                ? "You've already rated this course"
                : "Click to rate this course"}
              <div className="absolute bottom-0 left-3 w-2 h-2 bg-gray-800 transform rotate-45 -mb-1"></div>
            </div>
          )}

          <span className="ml-2 text-gray-700 text-sm">
            {hasRated ? "Your Rating" : "Rate This"}
          </span>
        </div>

        {ratingError && (
          <div className="mt-2 text-red-500 text-xs">{ratingError}</div>
        )}

        <div className="mt-3 flex">
          {calculatedProgress > 0 && (
            <div className="h-2 bg-gray-300 rounded-full mt-1 w-1/2 mr-3">
              <div
                className="h-2 bg-[#88D613] rounded-full"
                style={{ width: `${calculatedProgress}%` }}
              ></div>
            </div>
          )}
          <p className="text-xs">
            {calculatedProgress === 0
              ? "START LEARNING"
              : `${calculatedProgress}% complete`}
          </p>
        </div>
      </div>

      {!hasRated && (
        <RatingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitRating}
          initialRating={numericRating}
        />
      )}
    </div>
  );
};

export default PurchasedCard;