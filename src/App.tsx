import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import BookReviewsPage from "./pages/BookReviewsPage";
import TopBar from "./components/TopBar";

function App() {
    return (
        <Router>
            <TopBar />
            <Routes>
                <Route path="" element={<MainPage />} />
                <Route path="/book/:bookId" element={<BookReviewsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
