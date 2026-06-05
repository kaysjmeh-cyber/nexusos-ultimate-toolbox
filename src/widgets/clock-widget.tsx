import { useState, useEffect } from 'react';

export function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="nx-card" style={{
      textAlign: 'center',
      padding: '1.5rem',
      background: 'var(--nx-glass-bg)',
      border: '1px solid var(--nx-glass-border)',
      borderRadius: 'var(--nx-radius-lg)',
      minWidth: '200px',
    }}>
      <div style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        color: 'var(--nx-cyan)',
        textShadow: 'var(--nx-cyan-glow)',
        fontFamily: 'var(--nx-font-mono)',
        marginBottom: '0.5rem',
      }}>
        {formatTime(time)}
      </div>
      <div style={{
        fontSize: '0.875rem',
        color: 'var(--nx-text-secondary)',
        textTransform: 'capitalize',
      }}>
        {formatDate(time)}
      </div>
    </div>
  );
}
