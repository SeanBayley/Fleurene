import React from 'react'

interface SVGFlowerProps {
  size?: number
  color?: string
  className?: string
}

export const CherryBlossom: React.FC<SVGFlowerProps> = ({ 
  size = 24, 
  color = "#FFB7C5", 
  className = "" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
  >
    <g>
      {/* Petals */}
      <circle cx="12" cy="8" r="3" fill={color} opacity="0.8" />
      <circle cx="16" cy="12" r="3" fill={color} opacity="0.8" />
      <circle cx="12" cy="16" r="3" fill={color} opacity="0.8" />
      <circle cx="8" cy="12" r="3" fill={color} opacity="0.8" />
      <circle cx="12" cy="12" r="3" fill={color} opacity="0.9" />
      
      {/* Center */}
      <circle cx="12" cy="12" r="1.5" fill="#FFE4E1" />
      <circle cx="12" cy="12" r="0.8" fill="#FFF0F5" />
    </g>
  </svg>
)

export const Sakura: React.FC<SVGFlowerProps> = ({ 
  size = 24, 
  color = "#FFCCCB", 
  className = "" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
  >
    <g>
      {/* Heart-shaped petals */}
      <path 
        d="M12 8 C10 6, 6 6, 6 10 C6 12, 12 12, 12 12 C12 12, 18 12, 18 10 C18 6, 14 6, 12 8 Z" 
        fill={color} 
        opacity="0.8"
        transform="rotate(0 12 12)"
      />
      <path 
        d="M12 8 C10 6, 6 6, 6 10 C6 12, 12 12, 12 12 C12 12, 18 12, 18 10 C18 6, 14 6, 12 8 Z" 
        fill={color} 
        opacity="0.8"
        transform="rotate(72 12 12)"
      />
      <path 
        d="M12 8 C10 6, 6 6, 6 10 C6 12, 12 12, 12 12 C12 12, 18 12, 18 10 C18 6, 14 6, 12 8 Z" 
        fill={color} 
        opacity="0.8"
        transform="rotate(144 12 12)"
      />
      <path 
        d="M12 8 C10 6, 6 6, 6 10 C6 12, 12 12, 12 12 C12 12, 18 12, 18 10 C18 6, 14 6, 12 8 Z" 
        fill={color} 
        opacity="0.8"
        transform="rotate(216 12 12)"
      />
      <path 
        d="M12 8 C10 6, 6 6, 6 10 C6 12, 12 12, 12 12 C12 12, 18 12, 18 10 C18 6, 14 6, 12 8 Z" 
        fill={color} 
        opacity="0.8"
        transform="rotate(288 12 12)"
      />
      
      {/* Center */}
      <circle cx="12" cy="12" r="2" fill="#FFF" opacity="0.9" />
      <circle cx="12" cy="12" r="1" fill="#FFE4E1" />
    </g>
  </svg>
)

export const Sparkle: React.FC<SVGFlowerProps> = ({ 
  size = 16, 
  color = "#FFD700", 
  className = "" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    className={className}
  >
    <g>
      {/* Four-pointed star */}
      <path 
        d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z" 
        fill={color} 
        opacity="0.9"
      />
      <path 
        d="M8 3 L8.8 7.2 L13 8 L8.8 8.8 L8 13 L7.2 8.8 L3 8 L7.2 7.2 Z" 
        fill="#FFF" 
        opacity="0.8"
      />
    </g>
  </svg>
)

export const Butterfly: React.FC<SVGFlowerProps> = ({ 
  size = 24, 
  color = "#DDA0DD", 
  className = "" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
  >
    <g>
      {/* Body */}
      <ellipse cx="12" cy="12" rx="0.8" ry="8" fill="#8B4513" />
      
      {/* Wings */}
      <ellipse cx="8" cy="8" rx="4" ry="3" fill={color} opacity="0.8" />
      <ellipse cx="16" cy="8" rx="4" ry="3" fill={color} opacity="0.8" />
      <ellipse cx="8" cy="16" rx="3" ry="2.5" fill={color} opacity="0.7" />
      <ellipse cx="16" cy="16" rx="3" ry="2.5" fill={color} opacity="0.7" />
      
      {/* Wing patterns */}
      <circle cx="8" cy="8" r="1.5" fill="#FFF" opacity="0.6" />
      <circle cx="16" cy="8" r="1.5" fill="#FFF" opacity="0.6" />
      <circle cx="8" cy="16" r="1" fill="#FFF" opacity="0.5" />
      <circle cx="16" cy="16" r="1" fill="#FFF" opacity="0.5" />
      
      {/* Antennae */}
      <line x1="11.5" y1="4" x2="10" y2="2" stroke="#8B4513" strokeWidth="0.5" strokeLinecap="round" />
      <line x1="12.5" y1="4" x2="14" y2="2" stroke="#8B4513" strokeWidth="0.5" strokeLinecap="round" />
      <circle cx="10" cy="2" r="0.5" fill="#8B4513" />
      <circle cx="14" cy="2" r="0.5" fill="#8B4513" />
    </g>
  </svg>
) 