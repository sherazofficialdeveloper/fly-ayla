import React from 'react';

interface FlyAylaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'white';
  showSubtitle?: boolean;
  className?: string;
}

export const FlyAylaLogo: React.FC<FlyAylaLogoProps> = ({
  size = 'md',
  variant = 'light',
  showSubtitle = true,
  className = ''
}) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg' || size === 'xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Vector Emblem matching the authentic Fly Ayla brand */}
      <div className="relative flex flex-col items-center">
        <svg
          viewBox="0 0 160 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`h-auto ${
            size === 'sm'
              ? 'w-24'
              : size === 'md'
              ? 'w-32'
              : size === 'lg'
              ? 'w-40'
              : 'w-48'
          }`}
        >
          {/* Top 'FLY' Label with subtle red wings */}
          <g>
            <text
              x="80"
              y="11"
              textAnchor="middle"
              fill={variant === 'white' ? '#e2e8f0' : '#d4d4d8'}
              fontSize="7.5"
              fontWeight="600"
              letterSpacing="0.45em"
              fontFamily="Inter, sans-serif"
            >
              FLY
            </text>
            {/* Red supersonic flight icon accent */}
            <path
              d="M71 9.5L67 8L69 9.5L67 11L71 9.5Z"
              fill="#E11D48"
            />
            <path
              d="M89 9.5L93 8L91 9.5L93 11L89 9.5Z"
              fill="#E11D48"
            />
          </g>

          {/* Main 'AYLA' Typographic Monogram */}
          {/* A */}
          <path
            d="M26 40L38 17L50 40H43.5L38 28.5L32.5 40H26Z"
            fill={variant === 'dark' ? '#09090b' : '#ffffff'}
          />
          {/* Red Jet Apex on First 'A' */}
          <path
            d="M38 16L33.5 24.5L38 23L42.5 24.5L38 16Z"
            fill="#E11D48"
          />

          {/* Y */}
          <path
            d="M57 17L67.5 30.5V40H74.5V30.5L85 17H77L71 25.5L65 17H57Z"
            fill={variant === 'dark' ? '#09090b' : '#ffffff'}
          />

          {/* L */}
          <path
            d="M93 17V40H112V34.5H99.5V17H93Z"
            fill={variant === 'dark' ? '#09090b' : '#ffffff'}
          />

          {/* A */}
          <path
            d="M117 40L129 17L141 40H134.5L129 28.5L123.5 40H117Z"
            fill={variant === 'dark' ? '#09090b' : '#ffffff'}
          />
          {/* Red Cross Accent */}
          <path
            d="M124.5 33.5H133.5V35.5H124.5V33.5Z"
            fill="#E11D48"
          />

          {/* Subtitle 'PRIVATE AVIATION' */}
          {showSubtitle && (
            <g>
              <line
                x1="24"
                y1="45"
                x2="143"
                y2="45"
                stroke="#E11D48"
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
              <text
                x="83.5"
                y="50"
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize="4.8"
                fontWeight="500"
                letterSpacing="0.32em"
                fontFamily="Inter, sans-serif"
              >
                PRIVATE AVIATION
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
