import { useMemo, useState, type FormEvent } from 'react';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const defaultMessages: AIMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Bienvenue dans AI Chat. Je suis un assistant local prêt à discuter et à aider avec des tâches simples.',
  },
];

function generateLocalResponse(prompt: string): string {
  const normalized = prompt.toLowerCase();
  if (normalized.includes('bonjour') || normalized.includes('salut')) {
    return 'Bonjour ! Comment puis-je t’aider aujourd’hui ?';
  }
  if (normalized.includes('tâche') || normalized.includes('todo')) {
    return 'Tu peux créer une tâche dans le module Tâches et revenir ici pour discuter de ta planification.';
  }
  if (normalized.includes('thème') || normalized.includes('theme')) {
    return 'Va dans les paramètres ou le module Theme Editor pour changer l’aspect de l’application.';
  }
  if (normalized.includes('mot de passe') || normalized.includes('password')) {
    return 'Le module Password Vault te permet de stocker tes mots de passe en toute sécurité.';
  }
  return 'Je suis un assistant local basique, je ne suis pas connecté à un backend IA externe, mais je peux te répondre sur l’utilisation de NexusOS et ses modules.';
}

export function AIChatPage() {
  const [messages, setMessages] = useState<AIMessage[]>(defaultMessages);
  const [input, setInput] = useState('');

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };
    const assistantMessage: AIMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: generateLocalResponse(text),
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>AI Chat</h1>
        <p className="nx-muted">Module de chat IA local. Pas de backend externe, mais une réponse rapide pour guider l’usage.</p>
      </div>

      <div className="nx-settings-panel">
        <div className="nx-chat-history">
          {messages.map((message) => (
            <div key={message.id} className={`nx-chat-message nx-chat-${message.role}`}>
              <strong>{message.role === 'user' ? 'Vous' : 'Assistant'}</strong>
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="nx-chat-form">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Écris un message..."
          />
          <button type="submit" className="nx-btn" disabled={!canSend}>
            Envoyer
          </button>
        </form>
      </div>
    </section>
  );
}
