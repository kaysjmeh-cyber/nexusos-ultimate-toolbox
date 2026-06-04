import type { NexusOSId } from './index';

/** Fenêtre NexusOS — multi-fenêtres (shell) */
export interface WindowDescriptor {
  id: NexusOSId;
  title: string;
  moduleId?: NexusOSId;
  route: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}
