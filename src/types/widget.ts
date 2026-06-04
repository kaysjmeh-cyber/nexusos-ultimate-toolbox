import type { NexusOSId, NexusTimestamp } from './index';

/** Widget flottant ou ancré au dashboard */
export interface WidgetManifest {
  id: NexusOSId;
  name: string;
  moduleId?: NexusOSId;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  resizable: boolean;
  /** Position flottante (multi-fenêtres / overlay) */
  floating: boolean;
  meta: NexusTimestamp;
}

export interface WidgetInstance {
  instanceId: NexusOSId;
  widgetId: NexusOSId;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  pinned: boolean;
}
