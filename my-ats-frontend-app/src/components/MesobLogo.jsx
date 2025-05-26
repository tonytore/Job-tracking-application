import React, { useState } from 'react';

const MesobLogo = ({ size = 'medium' }) => { // Added size prop with default 'medium'
  const [isHovered, setIsHovered] = useState(false);

  // Define classes based on size prop
  let svgSizeClasses = 'w-16 h-16 sm:w-20 sm:h-20';
  let textSizeClasses = 'text-4xl sm:text-5xl';
  let textMarginClass = 'ml-3'; // Default margin

  if (size === 'small') {
    svgSizeClasses = 'w-10 h-10 sm:w-12 sm:h-12'; // Smaller for sidebar
    textSizeClasses = 'text-2xl sm:text-3xl'; // Smaller text for sidebar
    textMarginClass = 'ml-2';
  } else if (size === 'medium') {
    svgSizeClasses = 'w-16 h-16 sm:w-20 sm:h-20';
    textSizeClasses = 'text-4xl sm:text-5xl';
    textMarginClass = 'ml-3';
  }
  // Add more sizes if needed

  return (
    <div
      className="flex items-center justify-center cursor-pointer relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container for SVG and Text to ensure flex layout */}
      <div className="flex items-center justify-center">
        {/* Main Mesob SVG */}
        <svg
          className={`${svgSizeClasses} text-indigo-600 transition-all duration-300 ease-in-out transform`} // Applied dynamic size classes
          viewBox="0 0 100 100"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base of Mesob */}
          <path
            d="M10 90 Q 50 100 90 90 L 85 70 Q 50 75 15 70 Z"
            className="fill-current text-indigo-700"
          />
          {/* Body of Mesob */}
          <path
            d="M15 70 C 5 50 5 30 15 10 L 85 10 C 95 30 95 50 85 70 Z"
            className="fill-current text-indigo-600"
          />

          {/* Inner glow/sparkle - Appears on hover, symbolizing "worthy kept inside" */}
          <circle
            cx="50"
            cy="40"
            r="15"
            className={`fill-current text-yellow-300 transition-opacity duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
          />
          <circle
            cx="40"
            cy="50"
            r="10"
            className={`fill-current text-yellow-200 transition-opacity duration-300 ease-in-out delay-75 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
          />

          {/* New Hat Group - Lifts on hover */}
          <g className={`transition-transform duration-300 ease-in-out ${isHovered ? 'translate-y-[-8px]' : 'translate-y-0'}`}>
            {/* Hat - Triangular part (bottom of the hat) */}
            <path
              d="M15 10 L 50 0 L 85 10 Z"
              className="fill-current text-indigo-800"
            />
            {/* Hat - Circle part (top of the hat) */}
            <circle
              cx="50"
              cy="0"
              r="5"
              className="fill-current text-indigo-900"
            />
          </g>

          {/* Triangular bottom closure */}
          <path
            d="M10 90 L 50 98 L 90 90 Z"
            className="fill-current text-indigo-900"
          />
        </svg>

        {/* Mesobe Text - Changed to "Mesobe" and styled */}
        <span className={`${textSizeClasses} font-bold text-indigo-700 ${textMarginClass} italic tracking-wider`}>Mesobe</span>
      </div>

      {/* Meaning Text - Appears below on hover */}
      <div
        className={`absolute top-full mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-md shadow-lg
                    transition-opacity duration-300 ease-in-out whitespace-nowrap
                    ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        "Something worthy kept inside of it"
      </div>
    </div>
  );
};

export default MesobLogo;
