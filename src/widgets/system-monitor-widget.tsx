import { useState, useEffect } from 'react';

export function SystemMonitorWidget() {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    uptime: 0,
  });

  useEffect(() => {
    // Simulate system stats (in a real app, you'd use actual system APIs)
    const interval = setInterval(() => {
      setStats({
        cpu: Math.random() * 30 + 10, // 10-40% simulated
        memory: Math.random() * 20 + 40, // 40-60% simulated
        uptime: Math.floor(performance.now() / 1000),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const getBarColor = (value: number) => {
    if (value < 50) return 'var(--nx-green)';
    if (value < 75) return 'var(--nx-yellow)';
    return 'var(--nx-red)';
  };

  return (
    <div className="nx-card" style={{
      padding: '1.5rem',
      minWidth: '280px',
    }}>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--nx-text)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--nx-green)',
          boxShadow: '0 0 8px var(--nx-green-dim)',
          animation: 'nx-pulse 2s ease-in-out infinite',
        }} />
        Système
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.25rem',
            fontSize: '0.875rem',
            color: 'var(--nx-text-secondary)',
          }}>
            <span>CPU</span>
            <span>{stats.cpu.toFixed(1)}%</span>
          </div>
          <div style={{
            height: '6px',
            background: 'var(--nx-surface-2)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${stats.cpu}%`,
              background: getBarColor(stats.cpu),
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.5s ease',
              boxShadow: `0 0 10px ${getBarColor(stats.cpu)}40`,
            }} />
          </div>
        </div>

        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.25rem',
            fontSize: '0.875rem',
            color: 'var(--nx-text-secondary)',
          }}>
            <span>Mémoire</span>
            <span>{stats.memory.toFixed(1)}%</span>
          </div>
          <div style={{
            height: '6px',
            background: 'var(--nx-surface-2)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${stats.memory}%`,
              background: getBarColor(stats.memory),
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.5s ease',
              boxShadow: `0 0 10px ${getBarColor(stats.memory)}40`,
            }} />
          </div>
        </div>

        <div style={{
          fontSize: '0.875rem',
          color: 'var(--nx-muted)',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>Uptime</span>
          <span style={{ fontFamily: 'var(--nx-font-mono)' }}>
            {formatUptime(stats.uptime)}
          </span>
        </div>
      </div>
    </div>
  );
}
