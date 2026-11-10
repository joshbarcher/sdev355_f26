import { Routes, Route } from "react-router";

import Layout from "./components/Layout.jsx";
import Home from "./components/Home.jsx";
import Shelf from "./components/Shelf.jsx";
import BookDetail from "./components/BookDetail.jsx";
import StatusList from "./components/StatusList.jsx";
import About from "./components/About.jsx";
import NotFound from "./components/NotFound.jsx";
import OldShelf from "./components/OldShelf.jsx";
import BookProvider from "./context/BookProvider.jsx";

function App() {
    return (
        <BookProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="books" element={<Shelf />} />
                    <Route
                        path="books/reading"
                        element={<StatusList 
                            status="reading" 
                            title="Currently reading" 
                        />}
                    />
                    <Route
                        path="books/want"
                        element={<StatusList 
                            status="want" 
                            title="Want to read" 
                        />}
                    />
                    <Route
                        path="books/done"
                        element={<StatusList 
                            status="finished" 
                            title="Finished"
                        />}
                    />
                    <Route path="books/:id" element={<BookDetail />} />
                    <Route path="about" element={<About />} />
                    <Route path="shelf" element={<OldShelf />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BookProvider>
    );
}

export default App;
