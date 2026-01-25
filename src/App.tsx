import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdministrationPage from "./pages/AdministrationPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/administration" element={<AdministrationPage />} />
            </Routes>
        </Router>
    );
}

export default App;
