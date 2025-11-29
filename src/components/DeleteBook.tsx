import { useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface DeleteBookProps {
    bookId: number;
    bookTitle: string;
    setIsDeletingBook: (arg0: boolean) => void;
}

export default function DeleteBook({
    bookId,
    bookTitle,
    setIsDeletingBook,
}: DeleteBookProps) {
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (title !== bookTitle) {
            setError("Title missmatch");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.delete(`/books/${bookId}/`);
            navigate("/");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.description);
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Delete book
                </h2>

                <p>To confirm deleting book, enter it's title:</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <p className="text-sm font-medium text-red-600">
                            {error}
                        </p>
                    )}

                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsDeletingBook(false)}
                            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Deleting…" : "Delete"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
