import React, { useState } from 'react';
import RoMascot from './RoMascot';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dummy form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Start fake loading sequence
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin(); // Trigger the function to go to the Dashboard
    }, 1500); // 1.5 second delay to simulate database check
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      
      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '40px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative Background Glow */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: isLogin
      ? "rgba(253, 121, 121, 0.18)"
      : "rgba(253, 172, 172, 0.22)",
    filter: "blur(50px)", borderRadius: '50%', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '30px' }}>
          <RoMascot mode={isLoading ? "thinking" : "idle"} size="normal" />
          <h2 style={{ margin: '15px 0 5px 0', fontSize: '1.8rem' }}>
            {isLogin ? 'Welcome Back' : 'Initialize Profile'}
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: '0.9rem' }}>
            {isLogin ? 'Authenticate to access your Neural Log.' : 'Begin your journey to mental clarity.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          
          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Designation / Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="Secure Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="Passcode" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-neon" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px',
              background: isLoading ? 'transparent' : '',
              borderColor: isLoading ? 'var(--text-soft)' : '',
              color: isLoading ? 'var(--text-muted)' : ''
            }}
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Authenticating...</>
            ) : (
              <>{isLogin ? 'Access System' : 'Create Access Key'} <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '25px' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
          >
            {isLogin ? "No access key? Initialize one." : "Already have access? Authenticate."}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Auth;