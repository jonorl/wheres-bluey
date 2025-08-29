import { Link } from "react-router-dom";
import "./index.css";
import { FaGithub } from "react-icons/fa";

// Assets import
import roomImage from "./assets/bluey-room-1440p.jpg";
import beachImage from "./assets/bluey-beach-1440p.jpg";
import streetImage from "./assets/bluey-street.jpg";

function Index() {
  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>Where's Bluey project</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="scene-title">Choose a scene</h2>
        <div className="image-container-index">
          <div className="banner">
            <Link to="/scene/playroom" className="banner-link">
              <img src={roomImage} alt="Playroom Scene" className="Main" />
              <div className="overlay">Playroom</div>
            </Link>
          </div>
          <div className="banner">
            <Link to="/scene/beach" className="banner-link">
              <img src={beachImage} alt="Beach Scene" className="Main" />
              <div className="overlay">Beach</div>
            </Link>
          </div>
          <div className="banner">
            <Link to="/scene/street" className="banner-link">
              <img src={streetImage} alt="Street Scene" className="Main" />
              <div className="overlay">Street</div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>
            Where's Bluey project jonorl@gmail.com
            <a
              href="https://github.com/jonorl/wheres-bluey/tree/ts-conversion"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center align-middle ml-2 hover:text-white/80"
            >
              <FaGithub className="mb-1" aria-label="GitHub" />
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Index;
