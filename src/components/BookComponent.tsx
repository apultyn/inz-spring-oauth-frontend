import { useNavigate } from "react-router-dom";
import type { Book } from "../utils/interfaces";

interface IBookComponent {
    book: Book;
}

export default function BookComponent({ book }: IBookComponent) {
    const navigate = useNavigate();
    return (
        <article
            className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => navigate(`/book/${book.id}`)}
        >
            <h3 className="text-lg font-semibold text-gray-800">
                {book.title}
            </h3>
            <p className="text-sm text-gray-500">{book.author}</p>
        </article>
    );
}
