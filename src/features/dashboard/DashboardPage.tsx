import { Link } from 'react-router-dom';
import { moduleRegistry } from '@modules/registry';

/**
 * Dashboard drag & drop — grille de widgets (react-grid-layout futur).
 */
export function DashboardPage() {
  const modules = moduleRegistry.list().slice(0, 6);

  return (
    <section className="nx-page">
      <h1>Dashboard</h1>
      <p className="nx-muted">Vue d’ensemble des modules et accès rapide.</p>
      <div className="nx-dashboard-grid" data-droppable="true">
        <div>
          <h2>Modules récents</h2>
          <ul className="nx-module-list">
            {modules.map((module) => (
              <li key={module.id}>
                <Link to={module.routePath}>{module.name}</Link>
                <span className="nx-badge">{module.category}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Accès rapide</h2>
          <ul className="nx-module-list">
            <li>
              <Link to="/settings">Paramètres</Link>
              <span className="nx-badge">Système</span>
            </li>
            <li>
              <Link to="/modules">Modules</Link>
              <span className="nx-badge">Navigation</span>
            </li>
            <li>
              <Link to="/modules/productivity/notes">Notes</Link>
              <span className="nx-badge">Productivité</span>
            </li>
            <li>
              <Link to="/modules/security/password-vault">Password Vault</Link>
              <span className="nx-badge">Sécurité</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
