import { useEffect, useState } from "react";
import { api } from "../utils/api";
import BookComponent from "../components/BookComponent";
import type { Book } from "../utils/interfaces";
import NewBook from "../components/NewBook";
import { useIsAdmin } from "../utils/useHasRole";

export default function MainPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchString, setSearchString] = useState("");
    const [isNewBook, setisNewBook] = useState(false);

    const isAdmin = useIsAdmin();

    useEffect(() => {
        const fetchBooks = async (searchString = "") => {
            try {
                const response = await api.get("/books/", {
                    params: { searchString },
                });
                if (response.data) {
                    setBooks(response.data);
                } else setBooks([]);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchBooks(searchString);
    }, [searchString, isNewBook]);

    return (
        <>
            <main className="mx-auto max-w-7xl px-4 py-8">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Books</h1>

                <div className="mb-6 flex gap-2">
                    <input
                        type="text"
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        placeholder="Search books…"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                        onClick={() => setSearchString("")}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        Clear
                    </button>
                </div>

                {isAdmin && (
                    <button
                        onClick={() => setisNewBook(true)}
                        className="mb-6 rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-500"
                    >
                        + Add new book
                    </button>
                )}

                {books.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {books.map((book) => (
                            <BookComponent key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No books found.</p>
                )}
            </main>
            {isNewBook && <NewBook setIsNewBook={setisNewBook} />}
        </>
    );
}
