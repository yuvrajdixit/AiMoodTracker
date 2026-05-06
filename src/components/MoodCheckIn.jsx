import React, { useState } from 'react';
import { Tag } from 'lucide-react';

const MoodCheckIn = ({ onSave }) => {
  // 1. Mood State
  const [valence, setValence] = useState(0); // -5 to 5 (Unpleasant -> Pleasant)
  const [energy, setEnergy] = useState(0);   // -5 to 5 (Low Energy -> High Energy)
  
  // 2. Context Tags State (NEW)
  const [selectedTags, setSelectedTags] = useState([]);
  const availableTags = ['Sleep 😴', 'Work 💼', 'Social 🗣️', 'Exercise 🏃', 'Diet 🍎', 'Gaming 🎮', 'Nature 🌲', 'Study 📚'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getMoodLabel = () => {
    if (valence > 0 && energy > 0) return "Energetic & Happy (Flow State)";
    if (valence > 0 && energy < 0) return "Calm & Content (Zen)";
    if (valence < 0 && energy > 0) return "Anxious or Frustrated (Fight/Flight)";
    if (valence < 0 && energy < 0) return "Sad or Lethargic (Burnout)";
    return "Neutral / Balanced";
  };

  const handleSubmit = () => {
    onSave({
      id: Date.now(),
      date: new Date().toISOString(),
      valence,
      energy,
      label: getMoodLabel(),
      tags: selectedTags // Saving the context tags
    });
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
      <h2 style={{ marginBottom: '10px' }}>Internal Weather Report</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: '30px' }}>Adjust the sliders to map your current state.</p>
      
      {/* Visualizer */}
      <div style={{ position: 'relative', height: '250px', width: '250px', margin: '0 auto 40px', border: "1px dashed rgba(253, 121, 121, 0.25)", borderRadius: '50%', background: "rgba(255,255,255,0.25)" }}>
        {/* Gradient Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', background: `conic-gradient(
  from 0deg,
  rgba(254, 234, 201, 0.8) 0deg 90deg,
  rgba(255, 205, 201, 0.8) 90deg 180deg,
  rgba(253, 172, 172, 0.8) 180deg 270deg,
  rgba(253, 121, 121, 0.5) 270deg 360deg
)`, opacity: 0.5, filter: 'blur(30px)' }}></div>
        
        {/* The Draggable Dot */}
        <div 
          style={{
            position: 'absolute',
            left: `${(valence + 5) * 10}%`,
            bottom: `${(energy + 5) * 10}%`,
            width: '24px',
            height: '24px',
             background: "var(--accent-primary)",
            borderRadius: "50%",
            boxShadow: "0 0 0 6px rgba(253, 121, 121, 0.12)",
            transform: "translate(-50%, 50%)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}
        ></div>

        {/* Labels */}
        <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>High Energy</span>
        <span style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', color: 'var(--text-soft)' }}>Low Energy</span>
        <span style={{ position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>Pleasant</span>
        <span style={{ position: 'absolute', left: '-60px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#ff0055' }}>Unpleasant</span>
      </div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px', textAlign: 'left' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-secondary)' }}>Valence (Mood)</label>
          <input type="range" min="-5" max="5" value={valence} onChange={(e) => setValence(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--accent-primary)' }}>Arousal (Energy)</label>
          <input type="range" min="-5" max="5" value={energy} onChange={(e) => setEnergy(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
        </div>
      </div>

      {/* Context Tags Selection */}
      <div style={{ marginBottom: '40px', textAlign: 'left' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '15px' }}>
          <Tag size={16} /> What influenced this state?
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                background: selectedTags.includes(tag) ? 'rgba(188, 19, 254, 0.2)' : 'rgba(255,255,255,0.03)',
                color: selectedTags.includes(tag) ? 'var(--accent-secondary)' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: selectedTags.includes(tag) ? 'var(--accent-secondary)' : 'var(--border-soft)',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <h3 style={{ color: '#000', marginBottom: '30px', minHeight: '1.5em' }}>{getMoodLabel()}</h3>
      
      <button className="btn-neon" onClick={handleSubmit} style={{ width: '100%', padding: '15px' }}>
        Log Data Point
      </button>
    </div>
  );
};

export default MoodCheckIn;