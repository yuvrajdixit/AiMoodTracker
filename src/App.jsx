import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import MoodCheckIn from './components/MoodCheckIn';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import ZenMode from './components/ZenMode'; 
import RoMascot from './components/RoMascot';
import { BrainCircuit, Activity, BookOpen, LogOut, HeartHandshake } from 'lucide-react';

function App() {
  // --- STATE MANAGEMENT ---
  
  // 1. View State: Controls which screen is visible
  const [view, setView] = useState('landing');

  // 2. Zen Mode State: Controls the overlay breathing exercise
  const [isZenMode, setIsZenMode] = useState(false);
  

  // 3. Data Persistence: Load logs from LocalStorage on startup
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('mindscape_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // --- EFFECTS ---

  // Save logs to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mindscape_logs', JSON.stringify(logs));
  }, [logs]);

  // --- HANDLERS ---

  const addLog = (log) => {
    setLogs([log, ...logs]);
    setView('dashboard'); // Redirect to dashboard after logging
  };

  const handleZenClose = () => {
    setIsZenMode(false);
  };

  // --- RENDER LOGIC ---

  // 1. ZEN MODE OVERLAY (Highest Priority)
  // If active, it covers everything else
  if (isZenMode) {
    return <ZenMode onClose={handleZenClose} />;
  }

  // 2. LANDING PAGE
  // The "Front Door" of the application
  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('auth')} />;
  }
  if (view === 'auth') {
    return <Auth onLogin={() => setView('dashboard')} />;
  }

  // 3. MAIN APPLICATION LAYOUT
  return (
    <div className="app-container" style={{  maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" }}>
      
      {/* --- HEADER --- */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Rō acts as the Logo Icon here */}
          <RoMascot mode="idle" size="normal" />
          <div>
            <h1 style={{ fontSize: '2rem', WebkitBackgroundClip: 'text', color: "var(--accent-primary)", margin: 0, letterSpacing: '-1px' }}>
              MINDSCAPE
            </h1>
            <span style={{ fontSize: '0.8rem',  color: "var(--text-muted)", letterSpacing: '2px', textTransform: 'uppercase' }}>System Active</span>
          </div>
        </div>
        
        <nav style={{ display: 'flex', gap: '10px' }}>
          <NavBtn icon={<Activity size={18} />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavBtn icon={<BrainCircuit size={18} />} label="Check In" active={view === 'checkin'} onClick={() => setView('checkin')} />
          <NavBtn icon={<BookOpen size={18} />} label="Journal" active={view === 'journal'} onClick={() => setView('journal')} />
          <div style={{ width: '1px', background: 'var(--border-soft)', margin: '0 10px' }}></div>
          <NavBtn icon={<LogOut size={18} />} label="Log Out" onClick={() => setView('landing')} />
        </nav>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main style={{ flex: 1, animation: 'fadeIn 0.3s ease-out' }}>
        {view === 'dashboard' && <Dashboard logs={logs} />}
        {view === 'checkin' && <MoodCheckIn onSave={addLog} />}
        {/* Pass the Zen Mode trigger to the Journal */}
        {view === 'journal' && <Journal onStartBreathing={() => setIsZenMode(true)} />}
      </main>

      {/* --- ETHICS FOOTER (Required for Mental Health Projects) --- */}
      <footer style={{ marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px', textAlign: 'center', color: 'var(--text-soft)', fontSize: '0.8rem' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '5px' }}>
          <HeartHandshake size={14} color="var(--text-soft)" /> 
          MindScape is an AI-assisted self-reflection tool, not a medical device.
        </p>
        <p>
          Data is stored locally on your device. If you are in crisis, please contact local emergency services immediately.
        </p>
      </footer>

    </div>
  );
}

// --- SUB-COMPONENTS ---

const NavBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? "rgba(253, 121, 121, 0.14)" : "transparent",
      border: "1px solid",
      borderColor: active ? "rgba(253, 121, 121, 0.25)" : "transparent",
      color: active ? "var(--accent-primary)" : "var(--text-muted)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "30px",
      cursor: "pointer",
      transition: "all 0.3s",
      fontWeight: 500,
      fontSize: "0.9rem",
    }}
  >
    {icon}
    {label}
  </button>
);
export default App;