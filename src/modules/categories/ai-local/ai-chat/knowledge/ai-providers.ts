export interface AIProvider {
  name: string;
  generateResponse(prompt: string, context?: any): Promise<string>;
  isAvailable(): boolean;
}

export interface AIProviderConfig {
  type: 'local' | 'ollama' | 'openai' | 'gemini' | 'openrouter';
  config?: {
    ollamaUrl?: string;
    openaiKey?: string;
    geminiKey?: string;
    openrouterKey?: string;
    model?: string;
  };
}

export class LocalProvider implements AIProvider {
  name = 'Local';
  
  isAvailable(): boolean {
    return true;
  }
  
  async generateResponse(_prompt: string): Promise<string> {
    // This will be implemented with the knowledge base
    return '';
  }
}

export class OllamaProvider implements AIProvider {
  name = 'Ollama';
  private url: string;
  
  constructor(url: string = 'http://localhost:11434') {
    this.url = url;
  }
  
  isAvailable(): boolean {
    // Check if Ollama is running
    return false; // Will be implemented
  }
  
  async generateResponse(prompt: string, model: string = 'llama2'): Promise<string> {
    try {
      const response = await fetch(`${this.url}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
        }),
      });
      
      const data = await response.json();
      return data.response || '';
    } catch (error) {
      console.error('Ollama error:', error);
      return 'Désolé, je n\'ai pas pu me connecter à Ollama.';
    }
  }
}

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey: string;
  private model: string;
  
  constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.model = model;
  }
  
  isAvailable(): boolean {
    return !!this.apiKey;
  }
  
  async generateResponse(_prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI error:', error);
      return 'Désolé, je n\'ai pas pu me connecter à OpenAI.';
    }
  }
}

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  isAvailable(): boolean {
    return !!this.apiKey;
  }
  
  async generateResponse(_prompt: string): Promise<string> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Gemini error:', error);
      return 'Désolé, je n\'ai pas pu me connecter à Gemini.';
    }
  }
}

export class OpenRouterProvider implements AIProvider {
  name = 'OpenRouter';
  private apiKey: string;
  private model: string;
  
  constructor(apiKey: string, model: string = 'anthropic/claude-2') {
    this.apiKey = apiKey;
    this.model = model;
  }
  
  isAvailable(): boolean {
    return !!this.apiKey;
  }
  
  async generateResponse(_prompt: string): Promise<string> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenRouter error:', error);
      return 'Désolé, je n\'ai pas pu me connecter à OpenRouter.';
    }
  }
}

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  private currentProvider: AIProvider;
  
  constructor(config: AIProviderConfig) {
    this.providers.set('local', new LocalProvider());
    
    if (config.config?.ollamaUrl) {
      this.providers.set('ollama', new OllamaProvider(config.config.ollamaUrl));
    }
    
    if (config.config?.openaiKey) {
      this.providers.set('openai', new OpenAIProvider(config.config.openaiKey, config.config.model));
    }
    
    if (config.config?.geminiKey) {
      this.providers.set('gemini', new GeminiProvider(config.config.geminiKey));
    }
    
    if (config.config?.openrouterKey) {
      this.providers.set('openrouter', new OpenRouterProvider(config.config.openrouterKey, config.config.model));
    }
    
    this.currentProvider = this.providers.get(config.type) || this.providers.get('local')!;
  }
  
  setProvider(type: string): void {
    const provider = this.providers.get(type);
    if (provider) {
      this.currentProvider = provider;
    }
  }
  
  async generateResponse(prompt: string, context?: any): Promise<string> {
    return this.currentProvider.generateResponse(prompt, context);
  }
  
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys()).filter(key => 
      this.providers.get(key)?.isAvailable()
    );
  }
  
  getCurrentProvider(): string {
    return this.currentProvider.name;
  }
}

