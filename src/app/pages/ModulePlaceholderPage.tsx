import { useParams } from 'react-router-dom';
import { moduleRegistry } from '@modules/registry';

/** Placeholder route module — panneau outil non implémenté */
export function ModulePlaceholderPage() {
  const { category, moduleId } = useParams();
  const manifest = moduleId ? moduleRegistry.get(moduleId) : undefined;

  return (
    <section className="nx-page">
      <h1>{manifest?.name ?? moduleId}</h1>
      <p className="nx-muted">
        Module <code>{category}/{moduleId}</code> — implémentation à venir.
      </p>
    </section>
  );
}
