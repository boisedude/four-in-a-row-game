/**
 * DefeatGraphic Component
 * Game over graphic with broken disc and MC branding
 * Designed by M. Cooper for www.mcooper.com
 */

interface DefeatGraphicProps {
  size?: number
  className?: string
}

export function DefeatGraphic({ size = 150, className }: DefeatGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Game Over Graphic by MC"
    >
      <defs>
        {/* Grey/sad gradient for broken disc */}
        <radialGradient id="brokenDiscGradient" cx="35%" cy="35%">
          <stop offset="0%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6b7280', stopOpacity: 1 }} />
        </radialGradient>

        {/* Red tint for defeat */}
        <radialGradient id="defeatTintGradient" cx="40%" cy="40%">
          <stop offset="0%" style={{ stopColor: '#fca5a5', stopOpacity: 0.6 }} />
          <stop offset="50%" style={{ stopColor: '#ef4444', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 0.3 }} />
        </radialGradient>

        {/* MC brand gradient */}
        <linearGradient id="mcDefeatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.4 }} />
        </linearGradient>

        {/* Cloud gradient */}
        <radialGradient id="cloudGradient">
          <stop offset="0%" style={{ stopColor: '#f3f4f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
        </radialGradient>
      </defs>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
          }
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
          .floating {
            animation: float 3s ease-in-out infinite;
          }
          .shaking {
            animation: shake 0.5s ease-in-out infinite;
          }
          .fading {
            animation: fadeInOut 2s ease-in-out infinite;
          }
        `}
      </style>

      {/* Sad cloud background */}
      <g className="floating" transform="translate(100, 40)">
        <ellipse cx="-15" cy="0" rx="20" ry="18" fill="url(#cloudGradient)" />
        <ellipse cx="0" cy="-5" rx="25" ry="22" fill="url(#cloudGradient)" />
        <ellipse cx="15" cy="0" rx="20" ry="18" fill="url(#cloudGradient)" />
        <ellipse cx="0" cy="10" rx="30" ry="15" fill="url(#cloudGradient)" />
      </g>

      {/* Broken disc pieces */}
      <g className="shaking" transform="translate(100, 110)">
        {/* Left piece */}
        <path
          d="M -45 0 Q -45 -25, -30 -35 Q -20 -40, -10 -42 L 0 0 Q -10 10, -20 15 Q -35 20, -45 0 Z"
          fill="url(#brokenDiscGradient)"
          stroke="#4b5563"
          strokeWidth="2"
        />
        <path
          d="M -45 0 Q -45 -25, -30 -35 Q -20 -40, -10 -42 L 0 0 Q -10 10, -20 15 Q -35 20, -45 0 Z"
          fill="url(#defeatTintGradient)"
        />
        {/* Highlight on left piece */}
        <ellipse cx="-25" cy="-15" rx="8" ry="12" fill="white" opacity="0.3" />

        {/* Right piece */}
        <path
          d="M 45 0 Q 45 -25, 30 -35 Q 20 -40, 10 -42 L 0 0 Q 10 10, 20 15 Q 35 20, 45 0 Z"
          fill="url(#brokenDiscGradient)"
          stroke="#4b5563"
          strokeWidth="2"
        />
        <path
          d="M 45 0 Q 45 -25, 30 -35 Q 20 -40, 10 -42 L 0 0 Q 10 10, 20 15 Q 35 20, 45 0 Z"
          fill="url(#defeatTintGradient)"
        />
        {/* Highlight on right piece */}
        <ellipse cx="25" cy="-15" rx="8" ry="12" fill="white" opacity="0.3" />

        {/* Crack line */}
        <line x1="0" y1="-42" x2="0" y2="15" stroke="#374151" strokeWidth="2" />
        <line
          x1="0"
          y1="-42"
          x2="0"
          y2="15"
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.5"
        />

        {/* MC branding on broken disc */}
        <text
          x="-25"
          y="0"
          fontSize="10"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="url(#mcDefeatGradient)"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          M
        </text>
        <text
          x="25"
          y="0"
          fontSize="10"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="url(#mcDefeatGradient)"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          C
        </text>
      </g>

      {/* Falling pieces/fragments */}
      <g className="fading">
        <circle cx="60" cy="140" r="3" fill="#9ca3af" opacity="0.5" />
        <circle cx="140" cy="145" r="2" fill="#6b7280" opacity="0.5" />
        <circle cx="80" cy="155" r="2.5" fill="#9ca3af" opacity="0.5" />
        <circle cx="120" cy="150" r="2" fill="#6b7280" opacity="0.5" />
      </g>

      {/* "X" marks or sad face elements */}
      <g transform="translate(100, 40)">
        {/* Left eye X */}
        <line x1="-18" y1="-2" x2="-12" y2="4" stroke="#6b7280" strokeWidth="2" opacity="0.5" />
        <line x1="-12" y1="-2" x2="-18" y2="4" stroke="#6b7280" strokeWidth="2" opacity="0.5" />

        {/* Right eye X */}
        <line x1="12" y1="-2" x2="18" y2="4" stroke="#6b7280" strokeWidth="2" opacity="0.5" />
        <line x1="18" y1="-2" x2="12" y2="4" stroke="#6b7280" strokeWidth="2" opacity="0.5" />

        {/* Sad mouth */}
        <path
          d="M -10 15 Q 0 10, 10 15"
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </g>

      {/* Ground shadow */}
      <ellipse cx="100" cy="175" rx="50" ry="8" fill="black" opacity="0.15" />

      {/* "Try Again" subtle text */}
      <text
        x="100"
        y="190"
        fontSize="10"
        fontFamily="Arial, sans-serif"
        fill="#9ca3af"
        textAnchor="middle"
        opacity="0.6"
      >
        Better luck next time!
      </text>
    </svg>
  )
}
