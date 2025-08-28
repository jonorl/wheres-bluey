// React import

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// CSS import
import "./scenario.css";

// Data helper import
import sceneData from "./utils/sceneData";

// Helper function to format time
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// Hostname (can be also added to a .env file)
const host = "http://localhost:3000/";

function Scene() {
  interface SceneNameParams {
    [key: string]: string;
    sceneName: string;
  }

  interface Characters {
    name: string;
    xrange: number | Array<number>;
    yrange: number | Array<number>;
  }

  interface CharName {
    xRange: Array<number>;
    yRange: Array<number>;
  }

  interface Entry {
    id: number;
    name: string;
    time: number;
  }

  interface ClickedCoords {
    x: number;
    y: number;
    imageWidth: number;
    imageHeight: number;
  }

  interface Feedback {
    type: string;
    x: number;
    y: number;
  }

  // Hooks
  const { sceneName } = useParams<SceneNameParams>();
  const { background, characters: characterImages } =
    sceneData[sceneName!] || {};
  const [clickedCoords, setClickedCoords] = useState<ClickedCoords | null>(
    null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [rankings, setRankings] = useState([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [characters, setCharacters] = useState([]);
  const [characterError, setCharacterError] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [rankingId, setRankingId] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  // load background
  const imageUrl = background;

  // to redirect
  const navigate = useNavigate();

  // Fetch characters for the specific scene on mount
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(
          `${host}api/v1/characters?scene=${sceneName}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch characters: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data.coordinates)) {
          throw new Error("Invalid data format: coordinates must be an array");
        }

        const validatedCharacters = data.coordinates.map((char: Characters) => {
          if (
            !char.name ||
            typeof char.name !== "string" ||
            !Array.isArray(char.xrange) ||
            char.xrange.length !== 2 ||
            !char.xrange.every(
              (num: number) => Number.isInteger(num) && num >= 0 && num <= 100
            ) ||
            !Array.isArray(char.yrange) ||
            char.yrange.length !== 2 ||
            !char.yrange.every(
              (num: number) => Number.isInteger(num) && num >= 0 && num <= 100
            )
          ) {
            throw new Error(
              `Invalid character data for ${char.name || "unknown"}`
            );
          }
          return {
            name: char.name,
            xRange: char.xrange,
            yRange: char.yrange,
          };
        });

        setCharacters(validatedCharacters);
      } catch (error: unknown) {
        console.error("Error fetching characters:", error);
        setCharacterError(
          "Failed to load character data. Please try again later."
        );
      }
    };

    fetchCharacters();
  }, [sceneName]);

  // Start game timer - just for show, there's a different logic for recording it
  useEffect(() => {
    if (gameStarted) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timerRef.current!);
    }
  }, [gameStarted]);

  // Handle win condition
  useEffect(() => {
    if (foundCount === 3) {
      clearInterval(timerRef.current!);
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

  // This hides the dropdown menu when clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        imageRef.current &&
        !imageRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowSlowMessage(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowSlowMessage(false);
    }
  }, [isLoading]);

  const [foundCharacters, setFoundCharacters] = useState(() => {
    const safeCharacters = characterImages;
    return Object.keys(safeCharacters).reduce(
      (acc: Record<string, boolean>, name) => {
        acc[name] = false;
        return acc;
      },
      {}
    );
  });

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${host}api/v1/ranking/start/${sceneName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to start game: ${response.status}`);
      }

      const data = await response.json();
      setRankingId(data.id);
      setGameStarted(true);
    } catch (error: unknown) {
      console.error("Error starting game:", error);
      setCharacterError("Failed to start game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (!imageRef.current || showModal || characterError || !gameStarted)
      return;

    const rect = imageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const { width, height } = rect;

    setClickedCoords({
      x: clickX,
      y: clickY,
      imageWidth: width,
      imageHeight: height,
    });
    setShowDropdown(true);
  };

  const handleCharacterChoice = (
    char: string,
    clickX: number,
    clickY: number
  ) => {
    if (!clickedCoords) return;
    const { imageWidth, imageHeight } = clickedCoords as {
      imageWidth: number;
      imageHeight: number;
    };

    const charName: CharName = characters.find(
      (character: Characters) => character.name === char
    )!;
    if (!charName) return;

    const clickXPercent: number = (clickX / imageWidth) * 100;
    const clickYPercent: number = (clickY / imageHeight) * 100;

    if (
      clickXPercent >= charName.xRange[0] &&
      clickXPercent <= charName.xRange[1] &&
      clickYPercent >= charName.yRange[0] &&
      clickYPercent <= charName.yRange[1]
    ) {
      setFeedback({ type: "correct", x: clickX, y: clickY });
      if (!foundCharacters[char]) {
        setFoundCharacters((prev) => ({
          ...prev,
          [char]: true,
        }));
        setFoundCount((prevCount) => prevCount + 1);
      }
    } else {
      setFeedback({ type: "incorrect", x: clickX, y: clickY });
    }
    setShowDropdown(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (showModal || characterError || !gameStarted) return;
    handleImageClick(e);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!playerName.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      const submitResponse = await fetch(`${host}api/v1/ranking/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      const rankingResponse = await fetch(`${host}api/v1/ranking/${sceneName}`);
      if (!rankingResponse.ok) {
        throw new Error(`Failed to fetch rankings: ${rankingResponse.status}`);
      }

      const rankingData = await rankingResponse.json();
      setRankings(rankingData.ranking);
      setShowModal(false);
      setShowLeaderboardModal(true);
      setPlayerName("");
    } catch (error: unknown) {
      console.error("Error:", error);
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaderboardClose = () => {
    setShowLeaderboardModal(false);
    setFoundCount(0);
    setTimeElapsed(0);
    setClickedCoords(null);
    setGameStarted(false);
    setRankingId("");
    navigate("/"); // Redirect to Index
  };

  return (
    <div className="image-container" style={{ position: "relative" }}>
      {characterError ? (
        <div className="modal">
          <div className="modal-content">
            <h2>Error</h2>
            <p>{characterError}</p>
            <button onClick={() => navigate("/")}>Go Back</button>
          </div>
        </div>
      ) : !gameStarted && !isLoading ? (
        <div className="modal">
          <div className="modal-content">
            <h2>Welcome to Bluey's Hide and Seek!</h2>
            <p>
              Find{" "}
              {Object.keys(characterImages)
                .map((name, i, arr) => {
                  if (i === arr.length - 1 && arr.length > 1)
                    return `and ${name}`;
                  return name;
                })
                .join(", ")}{" "}
              as fast as you can!
            </p>
            <button onClick={handleStartGame}>Start Game</button>
            <p className="warning">This site is designed for desktop screens</p>
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="modal">
              <div className="modal-content loading-content">
                <div className="loading-spinner"></div>
                <p>
                  {gameStarted ? "Loading leaderboard..." : "Starting game..."}
                </p>
                {showSlowMessage && (
                  <p>
                    Be patient, the whole thing is hosted in super slow free
                    services
                  </p>
                )}
              </div>
            </div>
          )}
          {gameStarted && (
            <>
              <div
                className="timer"
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  color: "white",
                  background: "rgba(0, 0, 0, 0.7)",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                Time: {formatTime(timeElapsed)}
              </div>
              <img
                className="Main"
                ref={imageRef}
                src={imageUrl}
                alt="Clickable"
                onClick={handleImageClick}
                onContextMenu={handleContextMenu}
                style={{
                  cursor: "crosshair",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              {feedback && (
                <span
                  className={`feedback feedback-${feedback.type}`}
                  style={{
                    position: "absolute",
                    left: feedback.x,
                    top: feedback.y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {feedback.type === "correct" ? "✅" : "🚫"}
                </span>
              )}
              {showDropdown && clickedCoords && (
                <div
                  ref={dropdownRef}
                  className="dropdown-menu"
                  style={{
                    position: "absolute",
                    left: clickedCoords.x,
                    top: clickedCoords.y,
                    transform: "translate(25%, -50%)",
                  }}
                >
                  {characterImages && (
                    <ul>
                      {Object.entries(characterImages).map(([name, imgSrc]) => (
                        <li
                          key={name}
                          style={{
                            position: "relative",
                            opacity: foundCharacters[name] ? 0.5 : 1,
                          }}
                          onClick={() =>
                            !foundCharacters[name] &&
                            handleCharacterChoice(
                              name,
                              clickedCoords.x,
                              clickedCoords.y
                            )
                          }
                        >
                          <img src={imgSrc} alt={name} />
                          {foundCharacters[name] && (
                            <span className="check-mark">✔</span>
                          )}
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {showModal && !isLoading && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>Congratulations!</h2>
                    <p>
                      You found all characters in {formatTime(timeElapsed)}!
                    </p>
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
                          rankings.map((entry: Entry, index) => (
                            <tr key={entry.id}>
                              <td>{index + 1}</td>
                              <td>{entry.name}</td>
                              <td>{formatTime(entry.time)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3}>No rankings available</td>
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

export default Scene;
