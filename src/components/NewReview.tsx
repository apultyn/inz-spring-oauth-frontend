import { useState, useRef, useEffect } from "react";
import { api } from "../utils/api";
import type { SpringError, ReviewCreateReq } from "../utils/interfaces";
import axios from "axios";

interface NewReviewProps {
    bookId: number;
    setIsNewReview: (open: boolean) => void;
}

export default function NewReview({ bookId, setIsNewReview }: NewReviewProps) {
    const [stars, setStars] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [violations, setViolations] = useState<string[]>();

    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsNewReview(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [setIsNewReview]);

    const handleBackdrop = (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) setIsNewReview(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setViolations([]);
        if (!stars) {
            setError("Please select a rating.");
            return;
        }
        if (!comment) {
            setError("Please write a comment.");
            return;
        }
        setIsSubmitting(true);
        try {
            const req: ReviewCreateReq = {
                bookId,
                stars,
                comment,
            };
            await api.post(`/reviews/`, req);
            setIsNewReview(false);
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
        <div
            ref={backdropRef}
            onClick={handleBackdrop}
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                    Write a review
                </h3>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <p className="text-sm font-medium text-red-600">
                            {error}
                        </p>
                    )}

                    {violations?.map((v) => (
                        <p key={v} className="text-sm font-medium text-red-600">
                            {v}
                        </p>
                    ))}

                    {/* Star rating */}
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                type="button"
                                key={n}
                                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                                onClick={() => setStars(n)}
                                className={`text-2xl transition-colors focus:outline-none ${
                                    n <= stars
                                        ? "text-yellow-400"
                                        : "text-gray-300 hover:text-yellow-500"
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your thoughts…"
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsNewReview(false)}
                            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting…" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
