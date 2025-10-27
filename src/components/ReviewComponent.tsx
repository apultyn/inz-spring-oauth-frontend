import { useCallback, useEffect, useState } from "react";
import type { Review, SpringError, ReviewUpdateReq } from "../utils/interfaces";
import DeleteReview from "./DeleteReview";
import { api } from "../utils/api";
import axios from "axios";
import { useIsAdmin } from "../utils/useHasRole";

interface ReviewComponentProps {
    reviewId: number;
    fetchBook: () => void;
}

export default function ReviewComponent({
    reviewId,
    fetchBook,
}: ReviewComponentProps) {
    const [review, setReview] = useState<Review | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState("");

    const [error, setError] = useState("");
    const [violations, setViolations] = useState<string[]>();

    const isAdmin = useIsAdmin();

    const enterEdit = () => {
        if (!review) return;
        setStars(review.stars);
        setComment(review.comment);
        setIsEditing(true);
    };

    const fetchReview = useCallback(async () => {
        try {
            const response = await api.get<Review>(`/reviews/${reviewId}`);
            setReview(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [reviewId]);

    useEffect(() => {
        fetchReview();
    }, [fetchReview]);

    const handleSave = async () => {
        setError("");
        setViolations([]);
        if (!review) return;
        setIsSubmitting(true);
        try {
            const req: ReviewUpdateReq = { stars, comment };
            await api.patch(`/reviews/${reviewId}`, req);
            setIsEditing(false);
            setReview({ ...review, stars, comment });
            fetchBook();
        } catch (error) {
            if (
                axios.isAxiosError<SpringError>(error) &&
                error.response &&
                error.status === 400
            ) {
                const errorData: SpringError = error.response.data;
                if (errorData.violations) {
                    setViolations(errorData.violations);
                } else {
                    setError(errorData.detail);
                }
            } else {
                setError("Something went wrong...");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        review && (
            <article className="mb-3 rounded-lg border bg-white p-4 shadow-sm">
                {!isEditing && (
                    <>
                        <header className="mb-2 flex items-center justify-between">
                            <h4 className="break-all font-semibold text-gray-800">
                                {review.user_email}
                            </h4>
                            <p className="text-sm text-yellow-500">
                                {"★".repeat(review.stars)}
                                {"☆".repeat(5 - review.stars)}
                            </p>
                        </header>
                        <p className="text-gray-600">{review.comment}</p>
                    </>
                )}

                {isEditing && (
                    <form
                        className="space-y-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        {error && (
                            <p className="text-sm font-medium text-red-600">
                                {error}
                            </p>
                        )}

                        {violations?.map((v) => (
                            <p
                                key={v}
                                className="text-sm font-medium text-red-600"
                            >
                                {v}
                            </p>
                        ))}
                        <div className="flex gap-1 text-2xl">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setStars(n)}
                                    className={`transition-colors ${
                                        n <= stars
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? "Saving…" : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setStars(review.stars);
                                    setComment(review.comment);
                                }}
                                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {isAdmin && !isEditing && (
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={() => enterEdit()}
                            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
                        >
                            Delete
                        </button>
                    </div>
                )}

                {showConfirm && (
                    <DeleteReview
                        review={review}
                        setShowConfirm={setShowConfirm}
                        fetchBook={fetchBook}
                    />
                )}
            </article>
        )
    );
}
