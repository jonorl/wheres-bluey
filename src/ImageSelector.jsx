import React, { useState, useRef, useEffect } from 'react';
import './imageSelector.css';
import socksImage from "./assets/bluey-room-socks.jpg";
import muffinImage from "./assets/bluey-room-muffin.jpg";
import bobBilbyImage from "./assets/bluey-room-bob-bilby.jpg";

const characters = [
  {
    name: 'Socks',
    xRange: [65, 69], // 28%–32% of width
    yRange: [40, 51], // 38%–42% of height
  },
];

function ImageSelector({ imageUrl }) {
  const [clickedCoords, setClickedCoords] = useState(null); // { x: number, y: number }
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageClick = (e) => {
    if (!imageRef.current) return; // Guard against unmounted ref

    // Get image's bounding rectangle
    const rect = imageRef.current.getBoundingClientRect();

    // Get click coordinates relative to the image
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Get image dimensions
    const { width, height } = rect;

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

    // Store image-relative coordinates for dropdown positioning
    setClickedCoords({ x: clickX, y: clickY });
    setShowDropdown(true);
  };

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
              <img src={socksImage} alt="Socks" />
              Socks
            </li>
            <li>
              <img src={muffinImage} alt="Muffin" />
              Muffin
            </li>
            <li>
              <img src={bobBilbyImage} alt="Bob Bilby" />
              Bob Bilby
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageSelector;