import React from 'react';

const JamaicanBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />
      
      {/* Jamaican architectural motifs */}
      <div className="absolute inset-0 opacity-5">
        {/* Georgian architectural pattern */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="georgian-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              {/* Georgian window pattern */}
              <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="0.5" />
              <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.5" />
              
              {/* Decorative corners */}
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <circle cx="80" cy="20" r="2" fill="currentColor" />
              <circle cx="20" cy="80" r="2" fill="currentColor" />
              <circle cx="80" cy="80" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#georgian-pattern)" className="text-primary" />
        </svg>
      </div>

      {/* Subtle geometric shapes */}
      <div className="absolute inset-0 opacity-3">
        {/* Top left decorative element */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rounded-full transform rotate-12" />
        <div className="absolute top-32 left-32 w-16 h-16 border border-secondary/20 rounded-full" />
        
        {/* Bottom right decorative element */}
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-accent/20 rounded-full transform -rotate-12" />
        <div className="absolute bottom-32 right-32 w-20 h-20 border border-primary/20 rounded-full" />
        
        {/* Center decorative elements */}
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-secondary/10 rounded-full transform rotate-45" />
        <div className="absolute top-1/3 right-1/4 w-28 h-28 border border-accent/10 rounded-full transform -rotate-45" />
      </div>

      {/* Jamaican flag inspired subtle accents */}
      <div className="absolute inset-0 opacity-2">
        {/* Diagonal lines inspired by flag */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform rotate-12 origin-left" />
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-secondary/20 to-transparent transform -rotate-12 origin-right" />
      </div>

      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-secondary/10 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute top-1/2 right-1/4 w-2.5 h-2.5 bg-accent/10 rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
      </div>
    </div>
  );
};

export default JamaicanBackground;