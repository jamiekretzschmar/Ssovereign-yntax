
import React from 'react';

export const COLORS = {
  parchment: '#fdfcf0',
  forest: '#0a161a',
  blueprint: '#314d61',
  accent: '#8fc0ce',
  moss: '#1b333a'
};

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} relative group transition-all duration-700 select-none`}>
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-full drop-shadow-[2px_4px_8px_rgba(49,77,97,0.2)]"
    >
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#314d61" strokeWidth="0.1" strokeOpacity="0.2"/>
        </pattern>
      </defs>

      {/* Grid Background */}
      <rect width="100" height="100" fill="url(#grid)" />

      {/* Construction Lines (The "Drafting" Phase) */}
      <g className="opacity-40 stroke-accent transition-all duration-700 group-hover:opacity-80">
        <line x1="10" y1="50" x2="90" y2="50" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="50" y1="10" x2="50" y2="90" strokeWidth="0.5" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="35" strokeWidth="0.5" strokeDasharray="1 3" />
        <path d="M20 20 L80 80 M80 20 L20 80" strokeWidth="0.3" strokeOpacity="0.5" />
      </g>

      {/* Hand-Drawn Main Hexagon (The "Artifact") */}
      <g className="stroke-blueprint transition-transform duration-700 group-hover:scale-105 origin-center">
        {/* Wobbly hexagon paths for sketchy feel */}
        <path 
          d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="transition-all duration-500 group-hover:stroke-accent"
          style={{ 
            strokeDasharray: '280', 
            strokeDashoffset: '0',
            // Slight path wiggles would be better with real wobbly lines, 
            // but wobbly paths in SVG usually require many points.
            // Using multiple paths slightly offset can simulate it.
          }} 
        />
        <path 
          d="M51 16 L81 33 L81 69 L51 86 L21 69 L21 33 Z" 
          strokeWidth="1" 
          strokeOpacity="0.3" 
          strokeLinecap="round" 
        />
        
        {/* Inner Details: Architectural Pillars/Dividers */}
        <path d="M50 15 V85" strokeWidth="1.5" strokeDasharray="4 2" strokeOpacity="0.6" />
        <path d="M20 32 L80 32 M20 68 L80 68" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.4" />

        {/* The "S" Architectural curves */}
        <path 
          d="M40 35 C 40 35, 65 30, 65 45 C 65 60, 35 60, 35 75 C 35 90, 60 85, 60 85" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          className="opacity-90 transition-all duration-500 group-hover:stroke-accent" 
          transform="translate(-2, -15) scale(1.1)"
        />
        
        {/* Measurement Ticks */}
        <g className="text-[4px] fill-blueprint/40 font-mono">
          <text x="82" y="32">01</text>
          <text x="82" y="68">02</text>
          <text x="48" y="12">VLT</text>
        </g>
      </g>

      {/* Center Pivot Point */}
      <circle cx="50" cy="50" r="1.5" fill="#8fc0ce" className="animate-pulse" />
    </svg>
  </div>
);
