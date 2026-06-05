export function WeatherWidget() {
  const weather = {
    temp: 22,
    condition: 'Ensoleillé',
    humidity: 65,
    wind: 12,
    location: 'Paris',
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'ensoleillé':
        return '☀️';
      case 'nuageux':
        return '☁️';
      case 'pluvieux':
        return '🌧️';
      case 'neige':
        return '❄️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="nx-card" style={{
      padding: '1.5rem',
      minWidth: '250px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--nx-text)',
          }}>
            {weather.temp}°C
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--nx-muted)',
          }}>
            {weather.location}
          </div>
        </div>
        <div style={{
          fontSize: '3rem',
        }}>
          {getWeatherIcon(weather.condition)}
        </div>
      </div>

      <div style={{
        fontSize: '0.875rem',
            color: 'var(--nx-text-secondary)',
            marginBottom: '0.5rem',
      }}>
        {weather.condition}
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        fontSize: '0.75rem',
        color: 'var(--nx-muted)',
      }}>
        <div>
          <span style={{ color: 'var(--nx-cyan)' }}>💧</span> {weather.humidity}%
        </div>
        <div>
          <span style={{ color: 'var(--nx-purple)' }}>💨</span> {weather.wind} km/h
        </div>
      </div>
    </div>
  );
}
