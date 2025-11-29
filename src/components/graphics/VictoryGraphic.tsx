/**
 * VictoryGraphic Component
 * Animated victory trophy with MC branding
 * Designed by M. Cooper for www.mcooper.com
 */

interface VictoryGraphicProps {
  size?: number
  className?: string
}

export function VictoryGraphic({ size = 150, className }: VictoryGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Victory Trophy by MC"
    >
      <defs>
        {/* Gold gradient for trophy */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#fef3c7', stopOpacity: 1 }} />
          <stop offset="30%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
          <stop offset="70%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
        </linearGradient>

        {/* Dark gold for shadows */}
        <linearGradient id="darkGoldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#b45309', stopOpacity: 1 }} />
        </linearGradient>

        {/* MC branding gradient */}
        <linearGradient id="mcBrandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        </linearGradient>

        {/* Star gradient */}
        <radialGradient id="starGradient">
          <stop offset="0%" style={{ stopColor: '#fef3c7', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0.8 }} />
        </radialGradient>
      </defs>

      <style>
        {`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
          .rotating-stars {
            animation: rotate 8s linear infinite;
            transform-origin: center;
          }
          .pulsing-trophy {
            animation: pulse 2s ease-in-out infinite;
          }
          .twinkling {
            animation: twinkle 1.5s ease-in-out infinite;
          }
        `}
      </style>

      {/* Rotating stars background */}
      <g className="rotating-stars" transform="translate(100, 100)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const delay = i * 0.2
          return (
            <g
              key={angle}
              transform={`rotate(${angle}) translate(0, -70)`}
              style={{ animationDelay: `${delay}s` }}
            >
              <path
                d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z"
                fill="url(#starGradient)"
                className="twinkling"
              />
            </g>
          )
        })}
      </g>

      {/* Trophy base shadow */}
      <ellipse cx="100" cy="170" rx="45" ry="8" fill="black" opacity="0.2" />

      {/* Trophy main group */}
      <g className="pulsing-trophy">
        {/* Trophy base (bottom) */}
        <rect
          x="70"
          y="150"
          width="60"
          height="15"
          rx="3"
          fill="url(#darkGoldGradient)"
          stroke="#b45309"
          strokeWidth="1"
        />
        <rect x="75" y="155" width="50" height="3" rx="1" fill="#fbbf24" opacity="0.5" />

        {/* Trophy pedestal */}
        <path d="M 80 150 L 85 135 L 115 135 L 120 150 Z" fill="url(#goldGradient)" />
        <rect x="85" y="130" width="30" height="5" rx="1" fill="url(#darkGoldGradient)" />

        {/* Trophy stem */}
        <rect x="90" y="90" width="20" height="40" rx="2" fill="url(#goldGradient)" />

        {/* Trophy cup body */}
        <path
          d="M 60 50 Q 60 85, 100 90 Q 140 85, 140 50 L 135 35 Q 135 30, 130 30 L 70 30 Q 65 30, 65 35 Z"
          fill="url(#goldGradient)"
          stroke="#f59e0b"
          strokeWidth="2"
        />

        {/* Trophy cup inner shadow */}
        <ellipse cx="100" cy="35" rx="25" ry="5" fill="#b45309" opacity="0.3" />

        {/* Trophy handles - left */}
        <path
          d="M 65 40 Q 45 40, 45 55 Q 45 70, 60 75"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Trophy handles - right */}
        <path
          d="M 135 40 Q 155 40, 155 55 Q 155 70, 140 75"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Shine on trophy cup */}
        <ellipse cx="85" cy="50" rx="12" ry="20" fill="white" opacity="0.4" />
        <ellipse cx="92" cy="60" rx="8" ry="12" fill="white" opacity="0.2" />

        {/* MC Branding engraved on trophy */}
        <g transform="translate(100, 60)">
          <rect x="-18" y="-10" width="36" height="20" rx="3" fill="#b45309" opacity="0.3" />
          <text
            x="0"
            y="4"
            fontSize="16"
            fontWeight="bold"
            fontFamily="serif"
            fill="url(#mcBrandGradient)"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            MC
          </text>
        </g>

        {/* "1st" or "Winner" text on base */}
        <text
          x="100"
          y="160"
          fontSize="10"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="#fef3c7"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          WINNER
        </text>
      </g>

      {/* Sparkles around trophy */}
      <g className="twinkling">
        <circle cx="40" cy="60" r="2" fill="#fbbf24" />
        <circle cx="160" cy="70" r="2" fill="#fbbf24" />
        <circle cx="50" cy="100" r="1.5" fill="#fef3c7" />
        <circle cx="150" cy="95" r="1.5" fill="#fef3c7" />
        <circle cx="70" cy="130" r="2" fill="#f59e0b" />
        <circle cx="130" cy="125" r="2" fill="#f59e0b" />
      </g>
    </svg>
  )
}
