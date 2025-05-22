import { Link } from 'react-router-dom';
import './index.css';
import roomImage from './assets/bluey-room-1440p.jpg';
import beachImage from './assets/bluey-beach-1440p.jpg';
import streetImage from './assets/bluey-street.jpg';

function Index() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#007bff', padding: '20px' }}>Please Choose a Scene</h1>
      <div className="image-container-index">
        <Link to="/scene/playroom">
          <div className="banner">
            <img src={roomImage} alt="Playroom Scene" className="Main" />
            <div className="overlay">Room</div>
          </div>
        </Link>
        <Link to="/scene/beach">
          <div className="banner">
            <img src={beachImage} alt="Beach Scene" className="Main" />
            <div className="overlay">Beach</div>
          </div>
        </Link>
        <Link to="/scene/street">
          <div className="banner">
            <img src={streetImage} alt="Street Scene" className="Main" />
            <div className="overlay">Street</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Index;