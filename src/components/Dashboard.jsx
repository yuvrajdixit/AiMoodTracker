import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = ({ logs }) => {
  // Fallback data if no logs exist yet
  const data = logs.length > 0 ? logs : [
    { date: 'Mon', valence: 2, energy: 1 },
    { date: 'Tue', valence: -1, energy: 3 },
    { date: 'Wed', valence: 4, energy: 2 },
  ];

 const exportData = () => {
  const dataStr = JSON.stringify(logs, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'mindscape_report.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      <button className="btn-neon" onClick={exportData} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
  ⬇ Export Report
</button>
      {/* Chart 1: Valence (Happiness) */}
      <div className="glass-panel">
        <h3 style={{ color: '#bc13fe' }}>Valence (Pleasantness)</h3>
        <div style={{ height: '200px', width: '100%' }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" hide />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#0a0a12', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="valence" stroke="#bc13fe" strokeWidth={3} dot={{r: 4, fill: '#bc13fe'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Energy (Arousal) */}
      <div className="glass-panel">
        <h3 style={{ color: '#00f3ff' }}>Energy Levels</h3>
        <div style={{ height: '200px', width: '100%' }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" hide />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#0a0a12', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="energy" stroke="#00f3ff" strokeWidth={3} dot={{r: 4, fill: '#00f3ff'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Card */}
      <div className="glass-panel" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{logs.length}</span>
          <span style={{ color: '#888' }}>Total Check-ins</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '2rem', fontWeight: 'bold', color: '#00f3ff' }}>
            {logs.length > 0 ? (logs.reduce((acc, curr) => acc + curr.valence, 0) / logs.length).toFixed(1) : 0}
          </span>
          <span style={{ color: '#888' }}>Avg. Valence</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;