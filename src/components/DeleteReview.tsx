import { useState } from "react";
import type { Review } from "../utils/interfaces";
import { api } from "../utils/api";

interface DeleteReviewProps {
    review: Review;
    setShowConfirm: (arg0: boolean) => void;
    fetchBook: () => void;
}

export default function DeleteReview({
    review,
    setShowConfirm,
    fetchBook,
}: DeleteReviewProps) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (email !== review.user_email) {
            setError("Email mismatch");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.delete(`/reviews/${review.id}/`);
            fetchBook();
            setShowConfirm(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Delete review
                </h2>
                <form className="space-y-4" onSubmit={handleDelete}>
                    <p className="mb-4 text-gray-800">
                        To confirm deleting review, enter it's author's email:
                    </p>
                    {error && (
                        <p className="text-sm font-medium text-red-600">
                            {error}
                        </p>
                    )}
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowConfirm(false)}
                            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Deleting…" : "Delete"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
