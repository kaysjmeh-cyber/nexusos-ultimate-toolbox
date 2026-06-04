import { eventBus } from '@core/bus/event-bus';

/**
 * Pont IA locale — hook uniforme pour tous les modules (sans modèle branché).
 * Futur : WebLLM, ONNX, workers dédiés, cache IDB (ai_cache).
 */
export interface AIRequest {
  context: string;
  moduleId?: string;
  stream?: boolean;
}

export interface AIResponse {
  text: string;
  model?: string;
  cached?: boolean;
}

export class AIBridge {
  async prompt(_request: AIRequest): Promise<AIResponse> {
    eventBus.emit('ai:request', { context: _request.context });
    return {
      text: '',
      model: undefined,
      cached: false,
    };
  }
}

export const aiBridge = new AIBridge();
