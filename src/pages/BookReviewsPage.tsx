import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Book } from "../utils/interfaces";
import { api } from "../utils/api";
import ReviewComponent from "../components/ReviewComponent";
import DeleteBook from "../components/DeleteBook";
import NewReview from "../components/NewReview";
import { useIsAdmin, useIsUser } from "../utils/useHasRole";

export default function BookReviewsPage() {
    const { bookId } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [isDeletingBook, setIsDeletingBook] = useState(false);
    const [isNewReview, setIsNewReview] = useState(false);

    const isAdmin = useIsAdmin();
    const isUser = useIsUser();

    const fetchBook = useCallback(async () => {
        try {
            const response = await api.get(`/books/${bookId}/`);
            setBook(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [bookId]);

    useEffect(() => {
        fetchBook();
    }, [fetchBook, isNewReview]);

    return (
        <>
            {book ? (
                <main className="mx-auto max-w-4xl px-4 py-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">
                        {book.title}
                        <span className="ml-1 text-gray-500">
                            — {book.author}
                        </span>
                    </h2>

                    <div className="mb-8 flex flex-wrap gap-3">
                        {isUser && (
                            <button
                                onClick={() => setIsNewReview(true)}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                + New&nbsp;review
                            </button>
                        )}

                        {isAdmin && (
                            <button
                                onClick={() => setIsDeletingBook(true)}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Delete&nbsp;book
                            </button>
                        )}
                    </div>

                    {isNewReview && (
                        <NewReview
                            bookId={book.id}
                            setIsNewReview={setIsNewReview}
                        />
                    )}

                    <div className="space-y-4">
                        {book.reviews.length ? (
                            book.reviews.map((r) => (
                                <ReviewComponent
                                    key={r.id}
                                    reviewId={r.id}
                                    fetchBook={fetchBook}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No reviews found.</p>
                        )}
                    </div>
                </main>
            ) : (
                <p className="text-gray-500">Book not found.</p>
            )}
            {isDeletingBook && book && (
                <DeleteBook
                    bookId={book.id}
                    bookTitle={book.title}
                    setIsDeletingBook={setIsDeletingBook}
                />
            )}
        </>
    );
}
