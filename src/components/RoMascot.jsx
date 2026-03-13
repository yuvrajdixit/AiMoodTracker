import React from 'react';

// modes: 'idle', 'thinking', 'comfort', 'excited'
const RoMascot = ({ mode = 'idle', size = 'normal' }) => {
  const scale = size === 'large' ? 1.5 : 1;
  const coreClass = `ro-core ${mode}`;

  return (
    <div className="ro-container" style={{ transform: `scale(${scale})` }}>
      {/* Outer Rotating Ring (Only visible when thinking) */}
      {mode === 'thinking' && (
        <div style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          border: '1px dashed var(--neon-purple)',
          borderRadius: '50%',
          animation: 'spin-ring 2s linear infinite',
          opacity: 0.5
        }} />
      )}
      
      {/* The Glass Shell */}
      <div className="ro-shell">
        {/* Reflection Highlight */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '20%',
          height: '10%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
          filter: 'blur(1px)'
        }} />
      </div>

      {/* The Living Core */}
      <div className={coreClass}></div>
    </div>
  );
};

export default RoMascot;