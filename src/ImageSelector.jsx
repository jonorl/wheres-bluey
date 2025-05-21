import React, { useState, useRef, useEffect } from 'react';
import './imageSelector.css';
import socksImage from "./assets/bluey-room-socks.jpg";
import muffinImage from "./assets/bluey-room-muffin.jpg";
import bobBilbyImage from "./assets/bluey-room-bob-bilby.jpg";

const characters = [
  {
    name: 'Socks',
    xRange: [65, 69],
    yRange: [40, 51],
  },
  {
    name: 'Muffin',
    xRange: [35, 41],
    yRange: [74, 81],
  },
  {
    name: 'Bob Bilby',
    xRange: [36, 39],
    yRange: [12, 17],
  },
];

function ImageSelector({ imageUrl }) {
  const [clickedCoords, setClickedCoords] = useState(null); // { x: number, y: number, imageWidth: number, imageHeight: number }
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const imageRef = useRef(null);
  // REMOVED: const rect = useRef(imageUrl.current.getBoundingClientRect())


  const handleImageClick = (e) => {
    if (!imageRef.current) return; // Guard against unmounted ref

    // Get image's bounding rectangle
    const rect = imageRef.current.getBoundingClientRect(); // This is correct!

    // Get click coordinates relative to the image
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Get image dimensions
    const { width, height } = rect; // Destructure width and height here

    // Convert to percentages for character detection
    const clickXPercent = (clickX / width) * 100;
    const clickYPercent = (clickY / height) * 100;

    // Log coordinates for debugging
    console.log(`Clicked at: X = ${clickX}, Y = ${clickY}`);
    console.log(`Percentage: X = ${clickXPercent}%, Y = ${clickYPercent}%`);

    // Check if click hits a character
    characters.forEach((character) => {
      if (
        clickXPercent >= character.xRange[0] &&
        clickXPercent <= character.xRange[1] &&
        clickYPercent >= character.yRange[0] &&
        clickYPercent <= character.yRange[1]
      ) {
        console.log(`Found ${character.name}!`);
      }
    });

    // Store image-relative coordinates AND image dimensions for dropdown positioning and later calculations
    setClickedCoords({ x: clickX, y: clickY, imageWidth: width, imageHeight: height });
    setShowDropdown(true);
  };

  // Pass imageWidth and imageHeight from clickedCoords
  function handleCharacterChoice(char, clickX, clickY) {
    // Ensure clickedCoords is available, and get the image dimensions from it
    if (!clickedCoords) return;
    const { imageWidth, imageHeight } = clickedCoords;

    const charName = characters.find(character => character.name === char); // Use find if you expect a single match
    if (!charName) return; // Guard against character not found

    const clickXPercent = (clickX / imageWidth) * 100; // Use imageWidth here
    const clickYPercent = (clickY / imageHeight) * 100; // Use imageHeight here

    console.log("charName", charName);
    console.log("charName.xRange", charName.xRange); // Corrected: access directly, not charName[0]
    console.log("clickXPercent", clickXPercent);

    if (
      clickXPercent >= charName.xRange[0] &&
      clickXPercent <= charName.xRange[1] &&
      clickYPercent >= charName.yRange[0] &&
      clickYPercent <= charName.yRange[1]
    ) {
      console.log(`Found ${char}!!!!!!!!!`);
      // You might want to do something here, like close the dropdown or mark the character as found
      setShowDropdown(false); // Close dropdown after a choice is made
    } else {
      console.log(`Clicked outside ${char}'s range.`);
    }
  }

  // Handle right-click (contextmenu event)
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent default context menu
    handleImageClick(e); // Reuse click handler
  };

  // Close dropdown when clicking outside
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

  return (
    <div className="image-container" style={{ position: 'relative' }}>
      <img
        className='Main'
        ref={imageRef}
        src={imageUrl}
        alt="Clickable"
        onClick={handleImageClick}
        onContextMenu={handleContextMenu}
        style={{ cursor: 'crosshair', maxWidth: '100%', height: 'auto' }}
      />

      {showDropdown && clickedCoords && (
        <div
          ref={dropdownRef}
          className="dropdown-menu"
          style={{
            position: 'absolute',
            left: clickedCoords.x,
            top: clickedCoords.y,
            transform: 'translate(25%, -50%)', // Center dropdown on click
          }}
        >
          <ul>
            <li>
              <img src={socksImage} alt="Socks" onClick={() => handleCharacterChoice("Socks", clickedCoords.x, clickedCoords.y)} />
              Socks
            </li>
            <li>
              <img src={muffinImage} alt="Muffin" onClick={() => handleCharacterChoice("Muffin", clickedCoords.x, clickedCoords.y)} />
              Muffin
            </li>
            <li>
              <img src={bobBilbyImage} alt="Bob Bilby" onClick={() => handleCharacterChoice("Bob Bilby", clickedCoords.x, clickedCoords.y)} />
              Bob Bilby
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageSelector;