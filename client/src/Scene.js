import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./scenario.css";
import HOST from "./config";
// Data helper import
import sceneData from "./utils/sceneData";
var FeedbackType;
(function (FeedbackType) {
    FeedbackType["CORRECT"] = "correct";
    FeedbackType["INCORRECT"] = "incorrect";
})(FeedbackType || (FeedbackType = {}));
// Helper function to format time
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
};
function Scene() {
    // Hooks
    const { sceneName } = useParams();
    const { background, characters: characterImages } = sceneData[sceneName] || {};
    const [clickedCoords, setClickedCoords] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [foundCount, setFoundCount] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [rankings, setRankings] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [characterError, setCharacterError] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [rankingId, setRankingId] = useState("");
    const dropdownRef = useRef(null);
    const imageRef = useRef(null);
    const timerRef = useRef(null);
    const [showSlowMessage, setShowSlowMessage] = useState(false);
    const [foundCharacters, setFoundCharacters] = useState(() => {
        const safeCharacters = characterImages;
        return Object.keys(safeCharacters).reduce((acc, name) => {
            acc[name] = false;
            return acc;
        }, {});
    });
    // load background
    const imageUrl = background;
    // to redirect
    const navigate = useNavigate();
    // Fetch characters for the specific scene on mount
    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch(`${HOST}api/v1/characters?scene=${sceneName}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch characters: ${response.status}`);
                }
                const data = await response.json();
                if (!Array.isArray(data.coordinates)) {
                    throw new Error("Invalid data format: coordinates must be an array");
                }
                const validatedCharacters = data.coordinates.map((char) => {
                    if (!char.name ||
                        typeof char.name !== "string" ||
                        !Array.isArray(char.xrange) ||
                        char.xrange.length !== 2 ||
                        !char.xrange.every((num) => Number.isInteger(num) && num >= 0 && num <= 100) ||
                        !Array.isArray(char.yrange) ||
                        char.yrange.length !== 2 ||
                        !char.yrange.every((num) => Number.isInteger(num) && num >= 0 && num <= 100)) {
                        throw new Error(`Invalid character data for ${char.name || "unknown"}`);
                    }
                    return {
                        name: char.name,
                        xrange: char.xrange,
                        yrange: char.yrange,
                    };
                });
                setCharacters(validatedCharacters);
            }
            catch (error) {
                console.error("Error fetching characters:", error);
                setCharacterError("Failed to load character data. Please try again later.");
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
            return () => clearInterval(timerRef.current);
        }
    }, [gameStarted]);
    // Handle win condition
    useEffect(() => {
        if (foundCount === 3) {
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
    // This hides the dropdown menu when clicked outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                imageRef.current &&
                !imageRef.current.contains(event.target)) {
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
        }
        else {
            setShowSlowMessage(false);
        }
    }, [isLoading]);
    const handleStartGame = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${HOST}api/v1/ranking/start/${sceneName}`, {
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
        }
        catch (error) {
            console.error("Error starting game:", error);
            setCharacterError("Failed to start game. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleImageClick = (e) => {
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
    const handleCharacterChoice = (char, clickX, clickY) => {
        if (!clickedCoords)
            return;
        const { imageWidth, imageHeight } = clickedCoords;
        const charName = characters.find((character) => character.name === char);
        if (!charName)
            return;
        const clickXPercent = (clickX / imageWidth) * 100;
        const clickYPercent = (clickY / imageHeight) * 100;
        if (clickXPercent >= charName.xrange[0] &&
            clickXPercent <= charName.xrange[1] &&
            clickYPercent >= charName.yrange[0] &&
            clickYPercent <= charName.yrange[1]) {
            setFeedback({ type: FeedbackType.CORRECT, x: clickX, y: clickY });
            if (!foundCharacters[char]) {
                setFoundCharacters((prev) => ({
                    ...prev,
                    [char]: true,
                }));
                setFoundCount((prevCount) => prevCount + 1);
            }
        }
        else {
            setFeedback({ type: FeedbackType.INCORRECT, x: clickX, y: clickY });
        }
        setShowDropdown(false);
    };
    const handleContextMenu = (e) => {
        e.preventDefault();
        if (showModal || characterError || !gameStarted)
            return;
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
            const submitResponse = await fetch(`${HOST}api/v1/ranking/`, {
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
            const rankingResponse = await fetch(`${HOST}api/v1/ranking/${sceneName}`);
            if (!rankingResponse.ok) {
                throw new Error(`Failed to fetch rankings: ${rankingResponse.status}`);
            }
            const rankingData = await rankingResponse.json();
            setRankings(rankingData.ranking);
            setShowModal(false);
            setShowLeaderboardModal(true);
            setPlayerName("");
        }
        catch (error) {
            console.error("Error:", error);
            setShowModal(false);
        }
        finally {
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
    return (_jsx("div", { className: "image-container", style: { position: "relative" }, children: characterError ? (_jsx("div", { className: "modal", children: _jsxs("div", { className: "modal-content", children: [_jsx("h2", { children: "Error" }), _jsx("p", { children: characterError }), _jsx("button", { onClick: () => navigate("/"), children: "Go Back" })] }) })) : !gameStarted && !isLoading ? (_jsx("div", { className: "modal", children: _jsxs("div", { className: "modal-content", children: [_jsx("h2", { children: "Welcome to Bluey's Hide and Seek!" }), _jsxs("p", { children: ["Find", " ", Object.keys(characterImages)
                                .map((name, i, arr) => {
                                if (i === arr.length - 1 && arr.length > 1)
                                    return `and ${name}`;
                                return name;
                            })
                                .join(", "), " ", "as fast as you can!"] }), _jsx("button", { onClick: handleStartGame, children: "Start Game" }), _jsx("p", { className: "warning", children: "This site is designed for desktop screens" })] }) })) : (_jsxs(_Fragment, { children: [isLoading && (_jsx("div", { className: "modal", children: _jsxs("div", { className: "modal-content loading-content", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: gameStarted ? "Loading leaderboard..." : "Starting game..." }), showSlowMessage && (_jsx("p", { children: "Be patient, the whole thing is hosted in super slow free services" }))] }) })), gameStarted && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "timer", style: {
                                position: "absolute",
                                top: "10px",
                                left: "10px",
                                color: "white",
                                background: "rgba(0, 0, 0, 0.7)",
                                padding: "5px 10px",
                                borderRadius: "5px",
                            }, children: ["Time: ", formatTime(timeElapsed)] }), _jsx("img", { className: "Main", ref: imageRef, src: imageUrl, alt: "Clickable", onClick: handleImageClick, onContextMenu: handleContextMenu, style: {
                                cursor: "crosshair",
                                maxWidth: "100%",
                                height: "auto",
                            } }), feedback && (_jsx("span", { className: `feedback feedback-${feedback.type}`, style: {
                                position: "absolute",
                                left: feedback.x,
                                top: feedback.y,
                                transform: "translate(-50%, -50%)",
                            }, children: feedback.type === "correct" ? "✅" : "🚫" })), showDropdown && clickedCoords && (_jsx("div", { ref: dropdownRef, className: "dropdown-menu", style: {
                                position: "absolute",
                                left: clickedCoords.x,
                                top: clickedCoords.y,
                                transform: "translate(25%, -50%)",
                            }, children: characterImages && (_jsx("ul", { children: Object.entries(characterImages).map(([name, imgSrc]) => (_jsxs("li", { style: {
                                        position: "relative",
                                        opacity: foundCharacters[name] ? 0.5 : 1,
                                    }, onClick: () => !foundCharacters[name] &&
                                        handleCharacterChoice(name, clickedCoords.x, clickedCoords.y), children: [_jsx("img", { src: imgSrc, alt: name }), foundCharacters[name] && (_jsx("span", { className: "check-mark", children: "\u2714" })), name] }, name))) })) })), showModal && !isLoading && (_jsx("div", { className: "modal", children: _jsxs("div", { className: "modal-content", children: [_jsx("h2", { children: "Congratulations!" }), _jsxs("p", { children: ["You found all characters in ", formatTime(timeElapsed), "!"] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("label", { children: ["Enter your name:", _jsx("input", { type: "text", name: "name", value: playerName, onChange: handleNameChange, placeholder: "Your name", required: true })] }), _jsx("button", { type: "submit", children: "Submit" })] })] }) })), showLeaderboardModal && !isLoading && (_jsx("div", { className: "modal", children: _jsxs("div", { className: "modal-content", children: [_jsx("h2", { children: "Leaderboard" }), _jsxs("table", { className: "leaderboard-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Rank" }), _jsx("th", { children: "Name" }), _jsx("th", { children: "Time" })] }) }), _jsx("tbody", { children: rankings.length > 0 ? (rankings.map((entry, index) => (_jsxs("tr", { children: [_jsx("td", { children: index + 1 }), _jsx("td", { children: entry.name }), _jsx("td", { children: formatTime(entry.time) })] }, entry.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 3, children: "No rankings available" }) })) })] }), _jsx("button", { onClick: handleLeaderboardClose, children: "Play Again" })] }) }))] }))] })) }));
}
export default Scene;
