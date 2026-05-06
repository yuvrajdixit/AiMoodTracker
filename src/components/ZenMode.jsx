import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ZenMode = ({ onClose }) => {
  const [text, setText] = useState('Inhale');
  
  // Simple Box Breathing Timer
  useEffect(() => {
    const cycle = [
      { action: 'Inhale', time: 4000 },
      { action: 'Hold', time: 4000 },
      { action: 'Exhale', time: 4000 },
      { action: 'Hold', time: 4000 },
    ];
    
    let step = 0;
    
    const runCycle = () => {
      setText(cycle[step].action);
      step = (step + 1) % 4;
    };

    runCycle(); // Start immediately
    const interval = setInterval(runCycle, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#0a0a12', zIndex: 1000,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      animation: 'fadeIn 1s ease'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '40px', right: '40px', background: 'transparent', border: 'none', color: 'var(--text-soft)', cursor: 'pointer' }}>
        <X size={40} />
      </button>

      <div className="breathing-circle">
        <div className="inner-glow"></div>
      </div>

      <h1 style={{ marginTop: '60px', fontSize: '3rem', color: 'var(--accent-primary)', fontWeight: '300', letterSpacing: '5px' }}>
        {text}
      </h1>
      <p style={{ color: 'var(--text-soft)' }}>Focus on the movement.</p>

      <style>{`
        .breathing-circle {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 2px solid rgba(0, 243, 255, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          animation: breathe 16s infinite ease-in-out; /* 4 steps of 4s = 16s */
        }
        .inner-glow {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 243, 255, 0.2) 0%, rgba(0,0,0,0) 70%);
          transform: scale(0.5);
          animation: glow 16s infinite ease-in-out;
        }

        @keyframes breathe {
          0% { transform: scale(1); }       /* Inhale Starts */
          25% { transform: scale(1.5); }    /* Inhale Ends / Hold Starts */
          50% { transform: scale(1.5); }    /* Hold Ends / Exhale Starts */
          75% { transform: scale(1); }      /* Exhale Ends / Hold Starts */
          100% { transform: scale(1); }     /* Hold Ends */
        }
      `}</style>
    </div>
  );
};

export default ZenMode;