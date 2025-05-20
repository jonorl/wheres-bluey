// src/ImageClickDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import './imageSelector.css'

function ImageSelector({ imageUrl }) {
  const [clickedCoords, setClickedCoords] = useState(null); // { x: number, y: number }
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageClick = (e) => {
    // Get the image's position and dimensions
    const imageRect = imageRef.current.getBoundingClientRect();

    // Calculate click coordinates relative to the image
    const x = e.clientX - imageRect.left;
    const y = e.clientY - imageRect.top;

    setClickedCoords({ x, y });
    setShowDropdown(true);

    // Print coordinates to console
    console.log(`Clicked at: X = ${x}, Y = ${y}`);
  };

  // This handles right-click (contextmenu event)
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the browser's default context menu
    handleImageClick(e); // Use the same logic for getting coordinates and showing dropdown
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && imageRef.current && !imageRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="image-container">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Clickable"
        onClick={handleImageClick}
        onContextMenu={handleContextMenu} // For right-click
        style={{ cursor: 'crosshair' }}
      />

      {showDropdown && clickedCoords && (
        <div
          ref={dropdownRef}
          className="dropdown-menu"
          style={{
            position: 'absolute',
            left: clickedCoords.x,
            top: clickedCoords.y,
            // Adjust positioning to ensure it's not off-screen
            transform: 'translate(-50%, -50%)', // Centers the dropdown on the click
          }}
        >
          <ul>
            <li>Option 1 (X: {clickedCoords.x}, Y: {clickedCoords.y})</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageSelector;