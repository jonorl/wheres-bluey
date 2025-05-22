import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './scenario.css';
import judoImage from './assets/bluey-street-judo.jpg';
import luckyImage from './assets/bluey-street-lucky.jpg';
import luckysDadImage from './assets/bluey-street-luckys-dad.jpg';
import blueyStreet from './assets/bluey-street.jpg';

function Street() {
  const { sceneName } = useParams();
  const navigate = useNavigate();

  const imageUrl = blueyStreet;

  const [clickedCoords, setClickedCoords] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [foundCharacters, setFoundCharacters] = useState({
    Judo: false,
    Lucky: false,
    "Lucky's dad": false,
  });
  const [foundCount, setFoundCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [rankings, setRankings] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [characterError, setCharacterError] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [rankingId, setRankingId] = useState('');
  const dropdownRef = useRef(null);
  const imageRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/characters?scene=${sceneName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch characters: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data.coordinates)) {
          throw new Error('Invalid data format: coordinates must be an array');
        }

        const validatedCharacters = data.coordinates.map((char) => {
          if (
            !char.name ||
            typeof char.name !== 'string' ||
            !Array.isArray(char.xrange) ||
            char.xrange.length !== 2 ||
            !char.xrange.every((num) => Number.isInteger(num) && num >= 0 && num <= 100) ||
            !Array.isArray(char.yrange) ||
            char.yrange.length !== 2 ||
            !char.yrange.every((num) => Number.isInteger(num) && num >= 0 && num <= 100)
          ) {
            throw new Error(`Invalid character data for ${char.name || 'unknown'}`);
          }
          return {
            name: char.name,
            xRange: char.xrange,
            yRange: char.yrange,
          };
        });

        setCharacters(validatedCharacters);
      } catch (error) {
        console.error('Error fetching characters:', error.message);
        setCharacterError('Failed to load character data. Please try again later.');
      }
    };

    fetchCharacters();
  }, [sceneName]);

  useEffect(() => {
    if (gameStarted) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (foundCount === 3) {
      clearInterval(timerRef.current);
      setShowModal(true);
    }
  }, [foundCount]);

  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => {
        setFeedback(null);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/v1/ranking/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to start game: ${response.status}`);
      }

      const data = await response.json();
      setRankingId(data.id);
      setGameStarted(true);
    } catch (error) {
      console.error('Error starting game:', error.message);
      setCharacterError('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (e) => {
    if (!imageRef.current || showModal || characterError || !gameStarted) return;

    const rect = imageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const { width, height } = rect;

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
      setFeedback({ type: 'correct', x: clickX, y: clickY });
      if (!foundCharacters[char]) {
        setFoundCharacters((prev) => ({
          ...prev,
          [char]: true,
        }));
        setFoundCount((prevCount) => prevCount + 1);
      }
    } else {
      setFeedback({ type: 'incorrect', x: clickX, y: clickY });
    }
    setShowDropdown(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (showModal || characterError || !gameStarted) return;
    handleImageClick(e);
  };

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      const submitResponse = await fetch('http://localhost:3000/api/v1/ranking/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: rankingId,
          name: playerName,
        }),
      });

      if (!submitResponse.ok) {
        throw new Error(`Failed to submit ranking: ${submitResponse.status}`);
      }

      const submitData = await submitResponse.json();
      setTimeElapsed(submitData.ranking.time);

      const rankingResponse = await fetch('http://localhost:3000/api/v1/ranking/');
      if (!rankingResponse.ok) {
        throw new Error(`Failed to fetch rankings: ${rankingResponse.status}`);
      }

      const rankingData = await rankingResponse.json();
      setRankings(rankingData.ranking);
      setShowModal(false);
      setShowLeaderboardModal(true);
      setPlayerName('');
    } catch (error) {
      console.error('Error:', error.message);
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaderboardClose = () => {
    setShowLeaderboardModal(false);
    setFoundCharacters({
      Judo: false,
      Lucky: false,
      "Lucky's dad": false,
    });
    setFoundCount(0);
    setTimeElapsed(0);
    setClickedCoords(null);
    setGameStarted(false);
    setRankingId('');
    navigate('/');
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
      {characterError ? (
        <div className="modal">
          <div className="modal-content">
            <h2>Error</h2>
            <p>{characterError}</p>
            <button onClick={() => navigate('/')}>Go Back</button>
          </div>
        </div>
      ) : !gameStarted && !isLoading ? (
        <div className="modal">
          <div className="modal-content">
            <h2>Welcome to Bluey's Hide and Seek!</h2>
            <p>Find Judo, Lucky, and Lucky's dad as fast as you can!</p>
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="modal">
              <div className="modal-content loading-content">
                <div className="loading-spinner"></div>
                <p>{gameStarted ? 'Loading leaderboard...' : 'Starting game...'}</p>
              </div>
            </div>
          )}
          {gameStarted && (
            <>
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
                      style={{ position: 'relative', opacity: foundCharacters.Judo ? 0.5 : 1 }}
                      onClick={() => !foundCharacters.Judo && handleCharacterChoice('Judo', clickedCoords.x, clickedCoords.y)}
                    >
                      <img src={judoImage} alt="Judo" />
                      {foundCharacters.Judo && <span className="check-mark">✔</span>}
                      Judo
                    </li>
                    <li
                      style={{ position: 'relative', opacity: foundCharacters.Lucky ? 0.5 : 1 }}
                      onClick={() => !foundCharacters.Lucky && handleCharacterChoice('Lucky', clickedCoords.x, clickedCoords.y)}
                    >
                      <img src={luckyImage} alt="Lucky" />
                      {foundCharacters.Lucky && <span className="check-mark">✔</span>}
                      Lucky
                    </li>
                    <li
                      style={{ position: 'relative', opacity: foundCharacters["Lucky's dad"] ? 0.5 : 1 }}
                      onClick={() => !foundCharacters["Lucky's dad"] && handleCharacterChoice("Lucky's dad", clickedCoords.x, clickedCoords.y)}
                    >
                      <img src={luckysDadImage} alt="Lucky's dad" />
                      {foundCharacters["Lucky's dad"] && <span className="check-mark">✔</span>}
                      Lucky's dad
                    </li>
                  </ul>
                </div>
              )}
              {showModal && !isLoading && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>Congratulations!</h2>
                    <p>You found all characters in {formatTime(timeElapsed)}!</p>
                    <form onSubmit={handleSubmit}>
                      <label>
                        Enter your name:
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
              {showLeaderboardModal && !isLoading && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>Leaderboard</h2>
                    <table className="leaderboard-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Name</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rankings.length > 0 ? (
                          rankings.map((entry, index) => (
                            <tr key={entry.id}>
                              <td>{index + 1}</td>
                              <td>{entry.name}</td>
                              <td>{formatTime(entry.time)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No rankings available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <button onClick={handleLeaderboardClose}>Play Again</button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Street;