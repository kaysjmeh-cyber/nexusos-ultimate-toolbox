import { Link, useParams } from 'react-router-dom';
import { moduleRegistry } from '@modules/registry';

/**
 * Hub de navigation vers les 250+ modules (liste manifest uniquement).
 */
export function ModuleHubPage() {
  const { category } = useParams();
  const modules = category
    ? moduleRegistry.listByCategory(category as never)
    : moduleRegistry.list();
  const categories = Array.from(new Set(moduleRegistry.list().map((m) => m.category))).sort();

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>Modules {category ? `— ${category}` : ''}</h1>
        <p className="nx-muted">{moduleRegistry.count()} modules enregistrés</p>
      </div>
      <nav className="nx-settings-nav">
        <Link to="/modules" className="nx-nav-link">
          Tous
        </Link>
        {categories.map((categoryId) => (
          <Link key={categoryId} to={`/modules/${categoryId}`} className="nx-nav-link">
            {categoryId}
          </Link>
        ))}
      </nav>
      <ul className="nx-module-list">
        {modules.map((m) => (
          <li key={m.id}>
            <Link to={m.routePath}>{m.name}</Link>
            <span className="nx-badge">{m.category}</span>
            {!m.enabled && <span className="nx-badge">désactivé</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
