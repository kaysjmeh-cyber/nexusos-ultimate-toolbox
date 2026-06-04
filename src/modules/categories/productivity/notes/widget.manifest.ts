import type { WidgetManifest } from '@nexus-types/widget';

export const notesWidgetManifest: WidgetManifest = {
  id: 'widget-notes',
  name: 'Notes (widget)',
  moduleId: 'notes',
  defaultSize: { w: 4, h: 2 },
  minSize: { w: 2, h: 1 },
  resizable: true,
  floating: false,
  meta: { createdAt: Date.now(), updatedAt: Date.now() },
};

export default notesWidgetManifest;
