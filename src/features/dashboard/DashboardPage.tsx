import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  ShieldCheck,
  Code2,
  ArrowLeftRight,
  KeyRound,
  Zap,
  Package,
  Activity,
  Clock,
} from 'lucide-react';
import { moduleRegistry } from '@modules/registry';
import { useCommandPaletteContext } from '@features/command-palette/command-palette-context';
import { ClockWidget } from '../../widgets/clock-widget';
import { SystemMonitorWidget } from '../../widgets/system-monitor-widget';
import { WeatherWidget } from '../../widgets/weather-widget';

interface QuickLink {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  color?: string;
}

const QUICK_LINKS: QuickLink[] = [
  { to: '/modules/productivity/notes',         label: 'Notes Markdown',          icon: <FileText size={16} />,       badge: 'Productivité', color: 'var(--nx-cyan)' },
  { to: '/modules/productivity/tasks',          label: 'Tâches',                  icon: <CheckSquare size={16} />,    badge: 'Productivité', color: 'var(--nx-green)' },
  { to: '/modules/security/password-generator', label: 'Générateur de mots de passe', icon: <KeyRound size={16} />,  badge: 'Sécurité',     color: 'var(--nx-purple)' },
  { to: '/modules/security/password-vault',     label: 'Coffre-fort',             icon: <ShieldCheck size={16} />,    badge: 'Sécurité',     color: 'var(--nx-purple)' },
  { to: '/modules/development/unit-converter',  label: 'Convertisseur d\'unités', icon: <ArrowLeftRight size={16} />, badge: 'Outils',       color: 'var(--nx-orange)' },
  { to: '/modules/development/json-formatter',  label: 'JSON Formatter',          icon: <Code2 size={16} />,          badge: 'Dev',          color: 'var(--nx-cyan)' },
];

function getNow() {
  return new Date().toLocaleString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function DashboardPage() {
  const modules = moduleRegistry.list().slice(0, 6);
  const { setOpen } = useCommandPaletteContext();
  const enabledCount = moduleRegistry.list().filter((m) => m.enabled).length;
  const totalCount = moduleRegistry.list().length;

  return (
    <div className="nx-page">
      {/* Header */}
      <div className="nx-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nx-space-3)', marginBottom: 'var(--nx-space-2)' }}>
          <LayoutDashboard size={24} style={{ color: 'var(--nx-cyan)', filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.7))' }} />
          <h1 style={{ margin: 0 }}>Dashboard</h1>
        </div>
        <p className="nx-muted" style={{ fontSize: 'var(--nx-font-size-sm)' }}>
          {getNow()} · Bienvenue dans NexusOS Ultimate Toolbox
        </p>
      </div>

      {/* Stats */}
      <div className="nx-grid nx-grid-4 nx-mb-6">
        <div className="nx-stat">
          <div className="nx-stat-value">{totalCount}</div>
          <div className="nx-stat-label">
            <Package size={12} style={{ display: 'inline', marginRight: 4 }} />
            Modules
          </div>
        </div>
        <div className="nx-stat">
          <div className="nx-stat-value" style={{ color: 'var(--nx-purple)', textShadow: 'var(--nx-purple-glow)' }}>{enabledCount}</div>
          <div className="nx-stat-label">
            <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />
            Activés
          </div>
        </div>
        <div className="nx-stat">
          <div className="nx-stat-value" style={{ color: 'var(--nx-green)', textShadow: '0 0 8px rgba(74,222,128,0.7)' }}>6</div>
          <div className="nx-stat-label">
            <Activity size={12} style={{ display: 'inline', marginRight: 4 }} />
            Outils dispo
          </div>
        </div>
        <div className="nx-stat">
          <div className="nx-stat-value" style={{ color: 'var(--nx-orange)', textShadow: '0 0 8px rgba(251,146,60,0.7)' }}>∞</div>
          <div className="nx-stat-label">
            <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
            Modules cibles
          </div>
        </div>
      </div>

      {/* Widgets */}
      <div className="nx-grid nx-grid-3" style={{ marginBottom: 'var(--nx-space-6)' }}>
        <ClockWidget />
        <SystemMonitorWidget />
        <WeatherWidget />
      </div>

      {/* Main grid */}
      <div className="nx-grid nx-grid-2" style={{ gap: 'var(--nx-space-5)' }}>
        {/* Quick links */}
        <div>
          <div className="nx-card-header" style={{ marginBottom: 'var(--nx-space-3)' }}>
            <span className="nx-card-icon"><Zap size={16} /></span>
            <h2 className="nx-card-title" style={{ fontSize: 'var(--nx-font-size-base)' }}>Accès rapide</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nx-space-2)' }}>
            {QUICK_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="nx-quick-link">
                <span className="nx-quick-link-icon" style={{ color: link.color }}>
                  {link.icon}
                </span>
                <span style={{ flex: 1 }}>{link.label}</span>
                {link.badge && (
                  <span className="nx-badge" style={{ fontSize: 10 }}>{link.badge}</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent modules */}
        <div>
          <div className="nx-card-header" style={{ marginBottom: 'var(--nx-space-3)' }}>
            <span className="nx-card-icon" style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.2)', color: 'var(--nx-purple)' }}>
              <Package size={16} />
            </span>
            <h2 className="nx-card-title" style={{ fontSize: 'var(--nx-font-size-base)' }}>Modules récents</h2>
          </div>
          <ul className="nx-module-list">
            {modules.map((m) => (
              <li key={m.id}>
                <Link
                  to={m.routePath}
                  style={{ color: 'var(--nx-text-secondary)', textDecoration: 'none', fontSize: 'var(--nx-font-size-sm)', transition: 'color var(--nx-transition-fast)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--nx-cyan)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--nx-text-secondary)'; }}
                >
                  {m.name}
                </Link>
                <span className="nx-badge nx-badge-purple" style={{ fontSize: 9 }}>{m.category}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA palette */}
      <div
        className="nx-card"
        style={{ marginTop: 'var(--nx-space-6)', display: 'flex', alignItems: 'center', gap: 'var(--nx-space-4)', cursor: 'pointer' }}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
      >
        <div className="nx-card-icon" style={{ width: 44, height: 44 }}>
          <Zap size={20} />
        </div>
        <div>
          <div className="nx-card-title">Palette de commandes</div>
          <div className="nx-muted nx-text-sm">Appuyez sur <kbd style={{ fontFamily: 'var(--nx-font-mono)', background: 'var(--nx-surface-2)', border: '1px solid var(--nx-border)', borderRadius: 4, padding: '1px 6px', fontSize: 11 }}>Ctrl+K</kbd> pour naviguer rapidement</div>
        </div>
      </div>
    </div>
  );
}
