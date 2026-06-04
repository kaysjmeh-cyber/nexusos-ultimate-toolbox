import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/modules', label: 'Modules' },
  { to: '/marketplace/plugins', label: 'Plugins' },
  { to: '/marketplace/themes', label: 'Thèmes' },
  { to: '/settings', label: 'Paramètres' },
];

export function AppSidebar() {
  return (
    <aside className="nx-sidebar">
      <div className="nx-logo">NexusOS</div>
      <nav>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} className="nx-nav-link">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
