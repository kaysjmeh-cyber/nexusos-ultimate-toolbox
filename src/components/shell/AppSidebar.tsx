import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid3X3,
  FileText,
  CheckSquare,
  ShieldCheck,
  Code2,
  ArrowLeftRight,
  KeyRound,
  Settings,
  Store,
  Palette,
  Bot,
  ChevronLeft,
  ChevronRight,
  Zap,
  Image,
} from 'lucide-react';
import { useUIStore } from '@stores/ui-store';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
      { to: '/modules', label: 'Modules', icon: <Grid3X3 size={16} /> },
    ],
  },
  {
    label: 'Productivité',
    items: [
      { to: '/modules/productivity/notes', label: 'Notes', icon: <FileText size={16} /> },
      { to: '/modules/productivity/tasks', label: 'Tâches', icon: <CheckSquare size={16} /> },
    ],
  },
  {
    label: 'Outils',
    items: [
      { to: '/modules/development/json-formatter', label: 'JSON Formatter', icon: <Code2 size={16} /> },
      { to: '/modules/development/unit-converter', label: 'Convertisseur', icon: <ArrowLeftRight size={16} /> },
      { to: '/modules/multimedia/image-tools', label: 'Image Tools', icon: <Image size={16} /> },
      { to: '/modules/security/password-generator', label: 'Mots de passe', icon: <KeyRound size={16} /> },
      { to: '/modules/security/password-vault', label: 'Coffre-fort', icon: <ShieldCheck size={16} /> },
    ],
  },
  {
    label: 'Système',
    items: [
      { to: '/marketplace/plugins', label: 'Plugins', icon: <Store size={16} /> },
      { to: '/marketplace/themes', label: 'Thèmes', icon: <Palette size={16} /> },
      { to: '/modules/ai-local/ai-chat', label: 'IA Chat', icon: <Bot size={16} /> },
      { to: '/settings', label: 'Paramètres', icon: <Settings size={16} /> },
    ],
  },
];

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const collapsed = sidebarCollapsed;

  return (
    <aside className={`nx-sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Header */}
      <div className="nx-sidebar-header">
        {!collapsed && (
          <NavLink to="/" className="nx-logo">
            <Zap size={18} />
            <span>NexusOS</span>
          </NavLink>
        )}
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Zap size={18} style={{ color: 'var(--nx-cyan)', filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.7))' }} />
          </div>
        )}
        <button
          type="button"
          className="nx-sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Développer le menu' : 'Réduire le menu'}
          title={collapsed ? 'Développer' : 'Réduire'}
          style={{ marginLeft: collapsed ? undefined : 'auto' }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="nx-sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="nx-nav-section">
            <div className="nx-nav-section-label">{section.label}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nx-nav-link${isActive ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                <span className="nx-nav-link-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
