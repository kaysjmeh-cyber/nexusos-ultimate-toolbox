import { useMemo, useState, type FormEvent } from 'react';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

const defaultMessages: AIMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: '🤖 Bienvenue dans AI Chat ! Je suis NexusBot, votre assistant local. Je peux vous aider avec:\n\n• Navigation dans NexusOS\n• Utilisation des modules\n• Personnalisation des thèmes\n• Gestion des tâches\n• Sécurité et mots de passe\n• Questions générales\n• Calculs simples\n\nComment puis-je vous aider ?',
    timestamp: Date.now(),
  },
];

function generateLocalResponse(prompt: string): string {
  const normalized = prompt.toLowerCase().trim();
  
  // Mathématiques simples
  if (normalized.includes('2+2') || normalized.includes('deux plus deux')) {
    return '🧮 2 + 2 = 4';
  }
  if (normalized.includes('3+3') || normalized.includes('trois plus trois')) {
    return '🧮 3 + 3 = 6';
  }
  if (normalized.includes('5+5') || normalized.includes('cinq plus cinq')) {
    return '🧮 5 + 5 = 10';
  }
  if (normalized.includes('10+10') || normalized.includes('dix plus dix')) {
    return '🧮 10 + 10 = 20';
  }
  if (normalized.match(/\d+\s*\+\s*\d+/)) {
    const match = normalized.match(/(\d+)\s*\+\s*(\d+)/);
    if (match) {
      const a = parseInt(match[1]);
      const b = parseInt(match[2]);
      return `🧮 ${a} + ${b} = ${a + b}`;
    }
  }
  if (normalized.match(/\d+\s*-\s*\d+/)) {
    const match = normalized.match(/(\d+)\s*-\s*(\d+)/);
    if (match) {
      const a = parseInt(match[1]);
      const b = parseInt(match[2]);
      return `🧮 ${a} - ${b} = ${a - b}`;
    }
  }
  if (normalized.match(/\d+\s*\*\s*\d+/)) {
    const match = normalized.match(/(\d+)\s*\*\s*(\d+)/);
    if (match) {
      const a = parseInt(match[1]);
      const b = parseInt(match[2]);
      return `🧮 ${a} × ${b} = ${a * b}`;
    }
  }
  
  // Salutations
  if (normalized.includes('bonjour') || normalized.includes('salut') || normalized.includes('hello') || normalized.includes('hi')) {
    const greetings = [
      'Bonjour ! 👋 Je suis NexusBot. Comment puis-je vous aider aujourd\'hui ?',
      'Salut ! 😊 Je suis prêt à vous aider avec NexusOS ou d\'autres questions.',
      'Hello ! 🤖 NexusBot à votre service. Que souhaitez-vous savoir ?',
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  if (normalized.includes('bonsoir') || normalized.includes('good evening')) {
    return 'Bonsoir ! 👋 Comment puis-je vous aider ce soir ?';
  }
  if (normalized.includes('au revoir') || normalized.includes('bye') || normalized.includes('ciao')) {
    return 'Au revoir ! 👋 N\'hésitez pas à revenir si vous avez d\'autres questions sur NexusOS.';
  }
  if (normalized.includes('merci') || normalized.includes('thank')) {
    const thanks = [
      'Je vous en prie ! 😊 N\'hésitez pas si vous avez d\'autres questions.',
      'Avec plaisir ! 🤖 Je suis là pour vous aider.',
      'De rien ! 👍 Y a-t-il autre chose que je puisse faire pour vous ?',
    ];
    return thanks[Math.floor(Math.random() * thanks.length)];
  }
  
  // Questions sur NexusOS
  if (normalized.includes('tâche') || normalized.includes('todo') || normalized.includes('task')) {
    return '📋 Pour gérer vos tâches, utilisez le module **Tâches** accessible depuis le dashboard. Vous pouvez créer, modifier et suivre vos tâches facilement.';
  }
  if (normalized.includes('note') || normalized.includes('notes') || normalized.includes('markdown')) {
    return '📝 Le module **Notes Markdown** vous permet de créer des notes avec support Markdown. Idéal pour la documentation et les mémos.';
  }
  if (normalized.includes('thème') || normalized.includes('theme') || normalized.includes('couleur')) {
    return '🎨 Vous pouvez personnaliser l\'apparence dans l\'éditeur de thème ! 5 thèmes sont disponibles:\n\n• **Cyberpunk** - Thème par défaut futuriste\n• **Neon** - Couleurs vives avec effets glow\n• **Minimalist** - Design épuré professionnel\n• **Glassmorphism** - Effets verre modernes\n• **Synthwave** - Esthétique rétro 80s';
  }
  if (normalized.includes('mot de passe') || normalized.includes('password') || normalized.includes('mdp')) {
    return '🔐 Pour la sécurité des mots de passe:\n\n• **Password Vault** - Stockage sécurisé avec chiffrement AES-GCM\n• **Password Generator** - Générateur de mots de passe forts\n• **PGP Tools** - Chiffrement PGP pour communications sécurisées';
  }
  if (normalized.includes('json') || normalized.includes('formatter')) {
    return '💻 Le module **JSON Formatter** permet de formater, valider et beautifier du code JSON rapidement.';
  }
  if (normalized.includes('dashboard') || normalized.includes('accueil')) {
    return '🏠 Le **Dashboard** est votre point de départ. Il affiche les widgets (horloge, système, météo) et les accès rapides aux modules.';
  }
  if (normalized.includes('widget') || normalized.includes('horloge')) {
    return '📊 Le Dashboard inclut 3 widgets:\n\n• **Clock Widget** - Horloge en temps réel\n• **System Monitor** - CPU et mémoire\n• **Weather Widget** - Météo simulée';
  }
  
  // Questions générales
  if (normalized.includes('qui es-tu') || normalized.includes('qui êtes-vous') || normalized.includes('who are you')) {
    return '🤖 Je suis NexusBot, un assistant local intégré à NexusOS Ultimate Toolbox. Je fonctionne entièrement en local sans connexion à un backend externe.';
  }
  if (normalized.includes('que fais-tu') || normalized.includes('que faites-vous') || normalized.includes('what do you do')) {
    return '🤖 Je suis un assistant qui peut vous aider avec:\n\n• L\'utilisation de NexusOS et ses modules\n• Des calculs simples\n• Des informations générales\n• La navigation dans l\'interface';
  }
  if (normalized.includes('heure') || normalized.includes('time') || normalized.includes('quelle heure')) {
    const now = new Date();
    return `🕐 Il est actuellement ${now.toLocaleTimeString('fr-FR')}.`;
  }
  if (normalized.includes('date') || normalized.includes('quel jour') || normalized.includes('what day')) {
    const now = new Date();
    return `📅 Nous sommes le ${now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
  }
  if (normalized.includes('météo') || normalized.includes('weather') || normalized.includes('temps')) {
    return '🌤️ Le widget météo sur le Dashboard affiche une simulation météo. Pour une vraie météo, vous pouvez utiliser un service externe.';
  }
  if (normalized.includes('blague') || normalized.includes('joke') || normalized.includes('rigole')) {
    const jokes = [
      'Pourquoi les développeurs détestent-ils la nature ? Parce qu\'il y a trop de bugs ! 🐛',
      'Quel est le comble pour un électricien ? De ne pas être au courant ! ⚡',
      'Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans l\'eau ! 🌊',
      'Comment appelle-t-on un chat tombé dans un pot de peinture ? Un chat peinture ! 🎨',
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  if (normalized.includes('aide') || normalized.includes('help') || normalized.includes('comment')) {
    return '❓ Utilisez **Ctrl+K** pour ouvrir la palette de commandes et naviguer rapidement dans l\'application. Vous pouvez aussi utiliser le sidebar pour accéder aux modules.\n\nJe peux aussi répondre à des questions sur NexusOS ou faire des calculs simples.';
  }
  
  // Réponses par défaut variées
  const defaultResponses = [
    'Je suis NexusBot, un assistant local. Je peux vous aider avec l\'utilisation de NexusOS, faire des calculs simples, ou répondre à des questions générales. Que souhaitez-vous savoir ?',
    'Je suis là pour vous aider ! Demandez-moi sur les thèmes, la sécurité, la productivité, les outils de développement, ou posez-moi une question générale.',
    'En tant qu\'assistant local, je peux répondre sur les fonctionnalités de NexusOS, faire des calculs, ou discuter de sujets généraux. Essayez de me poser une question !',
    'NexusBot à votre service ! Je peux vous guider dans NexusOS ou répondre à d\'autres questions. N\'hésitez pas à demander.',
    'Je peux vous aider avec NexusOS et ses nombreux modules, ou répondre à des questions générales. Quelle est votre question ?',
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
      timestamp: Date.now(),
    };
    const assistantMessage: AIMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: generateLocalResponse(text),
      timestamp: Date.now(),
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput('');
  };

  const handleClear = () => {
    setMessages(defaultMessages);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>AI Chat</h1>
        <p className="nx-muted">Assistant local NexusBot - Réponses rapides pour NexusOS, calculs et questions générales.</p>
      </div>

      <div className="nx-settings-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="nx-chat-history" style={{
          minHeight: '400px',
          maxHeight: '600px',
          overflowY: 'auto',
          padding: '1rem',
          background: 'var(--nx-surface-2)',
          borderRadius: 'var(--nx-radius)',
          border: '1px solid var(--nx-border)',
        }}>
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`nx-chat-message nx-chat-${message.role}`}
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--nx-radius)',
                background: message.role === 'user' 
                  ? 'rgba(0, 245, 255, 0.1)' 
                  : 'rgba(168, 85, 247, 0.1)',
                border: message.role === 'user'
                  ? '1px solid rgba(0, 245, 255, 0.2)'
                  : '1px solid rgba(168, 85, 247, 0.2)',
                maxWidth: '80%',
                marginLeft: message.role === 'user' ? 'auto' : '0',
                marginRight: message.role === 'assistant' ? 'auto' : '0',
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '0.25rem',
                fontSize: '0.75rem',
                color: 'var(--nx-muted)',
              }}>
                <strong style={{ 
                  color: message.role === 'user' ? 'var(--nx-cyan)' : 'var(--nx-purple)',
                  fontSize: '0.875rem',
                }}>
                  {message.role === 'user' ? 'Vous' : 'NexusBot'}
                </strong>
                <span>{formatTime(message.timestamp)}</span>
              </div>
              <p style={{ 
                margin: 0, 
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
                color: 'var(--nx-text)',
              }}>{message.text}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <form onSubmit={handleSubmit} className="nx-chat-form" style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Écrivez un message..."
              className="nx-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="nx-btn" disabled={!canSend}>
              Envoyer
            </button>
          </form>
          <button 
            type="button" 
            className="nx-btn nx-btn-secondary"
            onClick={handleClear}
          >
            Effacer
          </button>
        </div>
      </div>
    </section>
  );
}
