import { useState, useRef, useEffect } from 'react';
import './imageSelector.css';
import socksImage from './assets/bluey-room-socks.jpg';
import muffinImage from './assets/bluey-room-muffin.jpg';
import bobBilbyImage from './assets/bluey-room-bob-bilby.jpg';

const characters = [
  { name: 'Socks', xRange: [65, 69], yRange: [40, 51] },
  { name: 'Muffin', xRange: [35, 41], yRange: [74, 81] },
  { name: 'Bob Bilby', xRange: [36, 39], yRange: [12, 17] },
];

function ImageSelector({ imageUrl }) {
  const [clickedCoords, setClickedCoords] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [foundCharacters, setFoundCharacters] = useState({
    Socks: false,
    Muffin: false,
    'Bob Bilby': false,
  });
  const [foundCount, setFoundCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'incorrect', x: number, y: number }
  const dropdownRef = useRef(null);
  const imageRef = useRef(null);
  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Handle win condition
  useEffect(() => {
    console.log(`Current foundCount: ${foundCount}`);
    if (foundCount === 3) {
      console.log('You won the game!');
      clearInterval(timerRef.current);
      setShowModal(true);
    }
  }, [foundCount]);

  // Clear feedback after 2 seconds
  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => {
        setFeedback(null);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  const handleImageClick = (e) => {
    if (!imageRef.current || showModal) return;

    const rect = imageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const { width, height } = rect;

    const clickXPercent = (clickX / width) * 100;
    const clickYPercent = (clickY / height) * 100;

    console.log(`Clicked at: X = ${clickX}, Y = ${clickY}`);
    console.log(`Percentage: X = ${clickXPercent}%, Y = ${clickYPercent}%`);

    setClickedCoords({ x: clickX, y: clickY, imageWidth: width, imageHeight: height });
    setShowDropdown(true);
  };

  const handleCharacterChoice = (char, clickX, clickY) => {
    if (!clickedCoords) return;
    const { imageWidth, imageHeight } = clickedCoords;

    const charName = characters.find((character) => character.name === char);
    if (!charName) return;

    const clickXPercent = (clickX / imageWidth) * 100;
    const clickYPercent = (clickY / imageHeight) * 100;

    if (
      clickXPercent >= charName.xRange[0] &&
      clickXPercent <= charName.xRange[1] &&
      clickYPercent >= charName.yRange[0] &&
      clickYPercent <= charName.yRange[1]
    ) {
      console.log(`Found ${char}! Current foundCount before update: ${foundCount}`);
      setFeedback({ type: 'correct', x: clickX, y: clickY });
      if (!foundCharacters[char]) {
        setFoundCharacters((prev) => ({
          ...prev,
          [char]: true,
        }));
        setFoundCount((prevCount) => {
          const newCount = prevCount + 1;
          console.log(`Updating foundCount to: ${newCount}`);
          return newCount;
        });
      }
    } else {
      console.log(`Clicked outside ${char}'s range.`);
      setFeedback({ type: 'incorrect', x: clickX, y: clickY });
    }
    setShowDropdown(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (showModal) return;
    handleImageClick(e);
  };

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:3000/api/v1/ranking/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playerName,
        time: timeElapsed,
      })
    })
    console.log(`Submitting name: ${playerName}, Time: ${timeElapsed} seconds`);
    const ranking = await fetch(`http://localhost:3000/api/v1/ranking/`);
    console.log("ranking", ranking)
    setShowModal(false);
    setPlayerName('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        imageRef.current &&
        !imageRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="image-container" style={{ position: 'relative' }}>
      <div className="timer" style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', background: 'rgba(0, 0, 0, 0.7)', padding: '5px 10px', borderRadius: '5px' }}>
        Time: {formatTime(timeElapsed)}
      </div>
      <img
        className="Main"
        ref={imageRef}
        src={imageUrl}
        alt="Clickable"
        onClick={handleImageClick}
        onContextMenu={handleContextMenu}
        style={{ cursor: 'crosshair', maxWidth: '100%', height: 'auto' }}
      />
      {feedback && (
        <span
          className={`feedback feedback-${feedback.type}`}
          style={{
            position: 'absolute',
            left: feedback.x,
            top: feedback.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {feedback.type === 'correct' ? '✅' : '🚫'}
        </span>
      )}
      {showDropdown && clickedCoords && (
        <div
          ref={dropdownRef}
          className="dropdown-menu"
          style={{
            position: 'absolute',
            left: clickedCoords.x,
            top: clickedCoords.y,
            transform: 'translate(25%, -50%)',
          }}
        >
          <ul>
            <li
              style={{ position: 'relative', opacity: foundCharacters.Socks ? 0.5 : 1 }}
              onClick={() => !foundCharacters.Socks && handleCharacterChoice('Socks', clickedCoords.x, clickedCoords.y)}
            >
              <img src={socksImage} alt="Socks" />
              {foundCharacters.Socks && <span className="check-mark">✔</span>}
              Socks
            </li>
            <li
              style={{ position: 'relative', opacity: foundCharacters.Muffin ? 0.5 : 1 }}
              onClick={() => !foundCharacters.Muffin && handleCharacterChoice('Muffin', clickedCoords.x, clickedCoords.y)}
            >
              <img src={muffinImage} alt="Muffin" />
              {foundCharacters.Muffin && <span className="check-mark">✔</span>}
              Muffin
            </li>
            <li
              style={{ position: 'relative', opacity: foundCharacters['Bob Bilby'] ? 0.5 : 1 }}
              onClick={() => !foundCharacters['Bob Bilby'] && handleCharacterChoice('Bob Bilby', clickedCoords.x, clickedCoords.y)}
            >
              <img src={bobBilbyImage} alt="Bob Bilby" />
              {foundCharacters['Bob Bilby'] && <span className="check-mark">✔</span>}
              Bob Bilby
            </li>
          </ul>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Congratulations!</h2>
            <p>You found all characters in {formatTime(timeElapsed)}!</p>
            <form onSubmit={handleSubmit}>
              <label>
                Enter your name:&nbsp;
                <input
                  type="text"
                  name="name"
                  value={playerName}
                  onChange={handleNameChange}
                  placeholder="Your name"
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageSelector;