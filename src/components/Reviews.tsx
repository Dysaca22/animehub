import React, { useState } from "react";
import { Star } from "lucide-react";

import { Review } from "../types/anime";

interface ReviewsProps {
    reviews: Review[];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
    const [showMore, setShowMore] = useState<Record<string, boolean>>({});

    const toggleShowMore = (reviewId: string) => {
        setShowMore((prev) => ({
            ...prev,
            [reviewId]: !prev[reviewId],
        }));
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="mt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h3 className="text-lg md:text-xl font-semibold mb-4">
                    Reviews
                </h3>
                <div className="text-center py-8 text-gray-500">
                    No reviews available
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Reviews</h3>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="border p-4 rounded-xl bg-gray-800 flex flex-col gap-4"
                        onClick={() => toggleShowMore(review.id)}
                    >
                        <div className="flex flex-row justify-between">
                            <p className="font-bold">
                                {new Date(
                                    review.attributes.createdAt
                                ).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 flex gap-2 items-center">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                                <span>{(review.attributes.rating / 2).toFixed(1)}</span>
                            </p>
                        </div>
                        <p className="text-gray-300">
                            {showMore[review.id]
                                ? review.attributes.content
                                : review.attributes.content
                                      .split("\n")
                                      .slice(0, 3)
                                      .join("\n") +
                                  (review.attributes.content.split("\n")
                                      .length > 3
                                      ? "..."
                                      : "")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
