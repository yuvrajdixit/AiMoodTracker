import React, { useState } from 'react';
import Sentiment from 'sentiment'; // npm install sentiment
import RoMascot from './RoMascot';
import { Wind, Clock, Mic, MicOff, Save } from 'lucide-react';

const Journal = ({ onStartBreathing }) => {
  const [entry, setEntry] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [roMode, setRoMode] = useState('idle');
  const [history, setHistory] = useState([]);
  const [isListening, setIsListening] = useState(false); // Voice state

  const sentiment = new Sentiment();

  // --- VOICE INPUT LOGIC ---
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    setIsListening(true);
    setRoMode('thinking'); // Rō listens visually

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setEntry(prev => (prev ? prev + " " : "") + transcript);
      setIsListening(false);
      setRoMode('idle');
    };

    recognition.onerror = (event) => {
      console.error("Speech error", event);
      setIsListening(false);
      setRoMode('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
      setRoMode('idle');
    };

    recognition.start();
  };

  // --- ANALYSIS LOGIC ---
  const analyzeAndSave = () => {
    if (!entry.trim()) return;

    setRoMode('thinking');

    setTimeout(() => {
      const result = sentiment.analyze(entry);
      let feedback = "";
      let mode = "idle";
      let actionType = "neutral";

      // CBT & Resilience Logic
      if (result.score < -2) {
        feedback = "I sense heavy emotions. The 'Amygdala' (fear center) might be active. Let's regulate your nervous system first.";
        mode = "comfort";
        actionType = "breathe";
      } else if (result.score > 2) {
        feedback = "This is a win. Anchoring this feeling strengthens your neural pathways for resilience.";
        mode = "excited";
        actionType = "anchor";
      } else {
        feedback = "A clear, balanced mind. A perfect state for strategic thinking or deep work.";
        mode = "idle";
        actionType = "log";
      }

      const newLog = {
        id: Date.now(),
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: entry,
        score: result.score,
        feedback: feedback
      };

      setAnalysis({ ...newLog, actionType });
      setHistory([newLog, ...history]);
      setEntry('');
      setRoMode(mode);

    }, 1500); // Simulated AI processing delay
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* --- INPUT AREA --- */}
      <div className="glass-panel" style={{ position: 'relative', marginBottom: '40px', paddingBottom: '30px' }}>
        
        {/* Rō Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <RoMascot mode={roMode} size="normal" />
          <div>
            <h2 style={{ margin: 0 }}>Neural Log</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {isListening ? "Listening to your voice..." : (roMode === 'thinking' ? "Processing patterns..." : "Write freely. Analysis is private.")}
            </p>
          </div>
        </div>

        {/* Text Area with Mic Button Overlay */}
        <div style={{ position: 'relative' }}>
          <textarea
  value={entry}
  onChange={(e) => setEntry(e.target.value)}
  placeholder="What is occupying your mind right now?"
  style={{
    width: '100%',
    boxSizing: 'border-box', /* <--- THIS IS THE FIX */
    height: '140px',
    background: 'rgba(255,255,255,0.65)',
    border: `1px solid ${isListening ? '#ff0055' : 'var(--border-soft)'}`,
    borderRadius: '12px',
    color: '#000',
    padding: '15px',
    paddingRight: '60px', /* Space for mic button */
    resize: 'none',
    marginBottom: '20px',
    fontSize: '1rem',
    lineHeight: '1.5',
    transition: 'border 0.3s',
    outline: 'none' /* Removes the default blue browser focus glow */
  }}
/>
          
          {/* Mic Button */}
          <button 
            onClick={toggleListening}
            title="Voice Input"
            style={{
              position: 'absolute',
              right: '15px',
              top: '15px',
              background: isListening ? 'rgba(255, 0, 85, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid',
              borderColor: isListening ? '#ff0055' : 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: isListening ? '#ff0055' : '#000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            {isListening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
          </button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-neon" onClick={analyzeAndSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> Analyze & Log
          </button>
        </div>

        {/* --- DYNAMIC RESPONSE (AI Insight) --- */}
        {analysis && (
          <div style={{ 
            marginTop: '25px', 
            padding: '20px', 
            background: 'rgba(255,255,255,0.03)', 
            borderLeft: `4px solid ${roMode === 'comfort' ? '#ff0055' : (roMode === 'excited' ? '#00ff9d' : 'var(--accent-primary)')}`, 
            borderRadius: '0 12px 12px 0', 
            animation: 'fadeIn 0.5s' 
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: roMode === 'comfort' ? '#ff0055' : '#000' }}>
              Rō's Insight
            </h4>
            <p style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>{analysis.feedback}</p>
            
            {/* The "What Next" Action Button */}
            {analysis.actionType === 'breathe' && (
              <button 
                onClick={onStartBreathing} 
                style={{ 
                  marginTop: '15px', 
                  background: 'linear-gradient(45deg, #ff0055, var(--accent-secondary))', 
                  border: 'none', 
                  color: '#000', 
                  padding: '12px 24px', 
                  borderRadius: '30px', 
                  cursor: 'pointer', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  fontWeight: 'bold',
                  boxShadow: '0 5px 15px rgba(255, 0, 85, 0.3)'
                }}
              >
                <Wind size={18} /> Enter Decompression Mode
              </button>
            )}
          </div>
        )}
      </div>

      {/* --- HISTORY LIST --- */}
      {history.length > 0 && (
        <div style={{ animation: 'fadeIn 1s' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-soft)', paddingBottom: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
            <Clock size={20} /> Past Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {history.map(log => (
              <div key={log.id} className="glass-panel" style={{ padding: '20px', borderLeft: log.score < 0 ? '4px solid #ff0055' : '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>{log.date}</span>
                  <span style={{ color: log.score < 0 ? '#ff0055' : 'var(--accent-primary)' }}>Score: {log.score}</span>
                </div>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#ddd', lineHeight: '1.5' }}>"{log.text}"</p>
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-muted)aa', borderTop: '1px solid var(--border-soft)', paddingTop: '10px' }}>
                  AI: {log.feedback}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;