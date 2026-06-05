export interface ChatHistory {
  id: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: number;
  }>;
  createdAt: number;
  updatedAt: number;
}

export interface UserPreferences {
  theme: string;
  language: string;
  aiProvider: 'local' | 'ollama' | 'openai' | 'gemini' | 'openrouter';
  ollamaUrl?: string;
  openaiKey?: string;
  geminiKey?: string;
  openrouterKey?: string;
}

export interface RecentCommand {
  id: string;
  command: string;
  timestamp: number;
}

const DB_NAME = 'NexusBotDB';
const DB_VERSION = 1;

export class NexusBotStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Chat history store
        if (!db.objectStoreNames.contains('chatHistory')) {
          const chatHistoryStore = db.createObjectStore('chatHistory', { keyPath: 'id' });
          chatHistoryStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // User preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'id' });
        }

        // Recent commands store
        if (!db.objectStoreNames.contains('recentCommands')) {
          const commandsStore = db.createObjectStore('recentCommands', { keyPath: 'id' });
          commandsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveChatHistory(history: ChatHistory): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['chatHistory'], 'readwrite');
      const store = transaction.objectStore('chatHistory');
      const request = store.put(history);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getChatHistory(id: string): Promise<ChatHistory | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['chatHistory'], 'readonly');
      const store = transaction.objectStore('chatHistory');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getAllChatHistories(): Promise<ChatHistory[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['chatHistory'], 'readonly');
      const store = transaction.objectStore('chatHistory');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readwrite');
      const store = transaction.objectStore('preferences');
      const request = store.put({ id: 'user', ...preferences });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getPreferences(): Promise<UserPreferences | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['preferences'], 'readonly');
      const store = transaction.objectStore('preferences');
      const request = store.get('user');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async addRecentCommand(command: string): Promise<void> {
    if (!this.db) await this.init();
    
    const recentCommand: RecentCommand = {
      id: `cmd-${Date.now()}`,
      command,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['recentCommands'], 'readwrite');
      const store = transaction.objectStore('recentCommands');
      const request = store.add(recentCommand);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getRecentCommands(limit: number = 10): Promise<RecentCommand[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['recentCommands'], 'readonly');
      const store = transaction.objectStore('recentCommands');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');

      const commands: RecentCommand[] = [];
      
      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && commands.length < limit) {
          commands.push(cursor.value);
          cursor.continue();
        } else {
          resolve(commands);
        }
      };
    });
  }

  async clearOldCommands(olderThan: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.init();
    
    const cutoff = Date.now() - olderThan;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['recentCommands'], 'readwrite');
      const store = transaction.objectStore('recentCommands');
      const index = store.index('timestamp');
      const request = index.openCursor(IDBKeyRange.upperBound(cutoff));

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}

export const nexusBotStorage = new NexusBotStorage();
