import React from 'react';
import RoMascot from './RoMascot';
import { BrainCircuit, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
  return (
    <div className="landing-container" style={{ animation: 'fadeIn 1s ease-out' }}>
      
      {/* --- HERO SECTION --- */}
      <section style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 5%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Background Glow Effect */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', 
          width: '600px', height: '600px', 
          background: 'radial-gradient(circle, rgba(0, 243, 255, 0.15) 0%, rgba(0,0,0,0) 70%)', 
          zIndex: -1 
        }} />

        {/* Text Content */}
        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '8px 16px', 
            background: 'rgba(188, 19, 254, 0.1)', 
            border: '1px solid #bc13fe', 
            borderRadius: '20px', 
            color: '#bc13fe',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            marginBottom: '20px'
          }}>
            • AI-POWERED PSYCHOLOGY
          </div>
          
          <h1 style={{ 
            fontSize: '4.5rem', 
            lineHeight: '1.1', 
            margin: '0 0 20px 0',
            background: 'linear-gradient(to bottom right, #fff, #888)',
            WebkitBackgroundClip: 'text',
            color: 'transparent' 
          }}>
            Master Your <br />
            <span style={{ color: '#00f3ff', WebkitTextFillColor: '#00f3ff' }}>Internal Weather.</span>
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: '#888aa', lineHeight: '1.6', marginBottom: '40px' }}>
            MindScape combines <strong>CBT principles</strong> with <strong>Sentiment AI</strong> to help you track, understand, and regulate your emotions. No fluff. Just data-driven clarity.
          </p>

          <button 
            onClick={onEnter}
            className="btn-neon"
            style={{ 
              fontSize: '1.2rem', 
              padding: '15px 40px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}
          >
            Enter System <ArrowRight size={20} />
          </button>
        </div>

        {/* Hero Visual - Large Rō Mascot */}
        <div style={{ position: 'relative', width: '500px', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(188, 19, 254, 0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)' }} />
          <RoMascot mode="idle" size="large" />
        </div>
      </section>


      {/* --- FEATURES / SCIENCE SECTION --- */}
      <section style={{ padding: '80px 5%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px' }}>The Science of <span style={{ color: '#bc13fe' }}>Clarity</span></h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Card 1 */}
          <FeatureCard 
            icon={<Activity size={40} color="#00f3ff" />}
            title="Bi-Dimensional Tracking"
            desc="We don't just ask if you're happy. We measure Valence and Arousal to map your exact emotional coordinates based on Russell's Circumplex Model."
          />

          {/* Card 2 */}
          <FeatureCard 
            icon={<BrainCircuit size={40} color="#bc13fe" />}
            title="CBT AI Analysis"
            desc="Our Neural Log uses Natural Language Processing to detect cognitive distortions and offer immediate, evidence-based reframing prompts."
          />

          {/* Card 3 */}
          <FeatureCard 
            icon={<ShieldCheck size={40} color="#00ff9d" />}
            title="Private & Local"
            desc="Your mental state is personal. All data processing happens locally in your browser. Zero external tracking."
          />

        </div>
      </section>

    </div>
  );
};

// Sub-component for cards
const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass-panel" style={{ padding: '40px', textAlign: 'left', transition: 'transform 0.3s' }}>
    <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'inline-block' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{title}</h3>
    <p style={{ color: '#888aa', lineHeight: '1.6' }}>{desc}</p>
  </div>
);

export default LandingPage;