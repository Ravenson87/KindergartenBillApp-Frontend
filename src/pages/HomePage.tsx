import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="home-container">
            <h1>Dobrodošli u Kindergarten Bill App</h1>
            <div className="button-grid">
                <Link to="/administration" className="home-button admin">
                    🏫 Administracija vrtića
                </Link>
                <Link to="/billing" className="home-button billing">
                    💳 Generisanje računa
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
