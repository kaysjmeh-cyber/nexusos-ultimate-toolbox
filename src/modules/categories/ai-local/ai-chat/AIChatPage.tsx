import { useMemo, useState, type FormEvent, useEffect, useRef } from 'react';
import { KNOWLEDGE_BASE } from './knowledge/knowledge-base';
import { nexusBotStorage } from './knowledge/storage';
import { detectNavigationCommand } from './knowledge/navigation-commands';
import { calculate, convertUnits, generateUUID, generatePassword, encodeBase64, decodeBase64, generateQRCode, hexToRgb, rgbToHex, getCurrentTimestamp } from './knowledge/utility-tools';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  type?: 'text' | 'navigation' | 'tool' | 'action';
}

const defaultMessages: AIMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: '🤖 Bienvenue dans AI Chat ! Je suis NexusBot, votre assistant IA central.\n\nJe peux vous aider avec:\n\n• 🧮 **Calculs** et mathématiques\n• 🍝 **Connaissances générales** (cuisine, IT, programmation, histoire, sciences)\n• 🚀 **Navigation** dans NexusOS (dites "ouvre le dashboard")\n• 🔧 **Outils** (calculatrice, convertisseur, générateurs)\n• 📋 **Modules** NexusOS et fonctionnalités\n\nEssayez de me poser une question !',
    timestamp: Date.now(),
  },
];

function generateLocalResponse(prompt: string): { text: string; type: AIMessage['type'] } {
  const normalized = prompt.toLowerCase().trim();
  
  // Navigation commands
  const navCommand = detectNavigationCommand(prompt);
  if (navCommand) {
    navCommand.action();
    return { text: `✅ ${navCommand.description}`, type: 'navigation' };
  }
  
  // Calculator
  if (normalized.match(/^calc\s*\d+/) || normalized.match(/calcul\s*\d+/) || normalized.includes('calcule') || normalized.includes('calculer')) {
    const mathMatch = prompt.match(/calc\s*(.+)/i) || prompt.match(/calcul\s*(.+)/i);
    if (mathMatch && mathMatch[1]) {
      return { text: calculate(mathMatch[1]), type: 'tool' };
    }
  }
  
  // Unit conversion
  if (normalized.includes('convertir') || normalized.includes('convert')) {
    const convMatch = prompt.match(/(\d+)\s*(\w+)\s*(en|to)\s*(\w+)/i);
    if (convMatch && convMatch[1] && convMatch[2] && convMatch[4]) {
      const value = parseFloat(convMatch[1]);
      const from = convMatch[2];
      const to = convMatch[4];
      return { text: convertUnits(value, from, to), type: 'tool' };
    }
  }
  
  // UUID generator
  if (normalized.includes('uuid') || normalized.includes('identifiant unique')) {
    return { text: `🆔 UUID: ${generateUUID()}`, type: 'tool' };
  }
  
  // Password generator
  if (normalized.includes('générer mot de passe') || normalized.includes('password generator') || normalized.includes('mdp')) {
    return { text: generatePassword(16), type: 'tool' };
  }
  
  // Base64
  if (normalized.includes('base64') || normalized.includes('encoder')) {
    if (normalized.includes('décoder') || normalized.includes('decode')) {
      const match = prompt.match(/base64\s+(.+)/i);
      if (match && match[1]) return { text: decodeBase64(match[1]), type: 'tool' };
    } else {
      const match = prompt.match(/encoder\s+(.+)/i) || prompt.match(/base64\s+(.+)/i);
      if (match && match[1]) return { text: encodeBase64(match[1]), type: 'tool' };
    }
  }
  
  // QR Code
  if (normalized.includes('qr code') || normalized.includes('qrcode')) {
    const match = prompt.match(/qr\s*(.+)/i);
    if (match && match[1]) return { text: generateQRCode(match[1]), type: 'tool' };
  }
  
  // Color conversion
  if (normalized.includes('hex to rgb') || normalized.includes('rgb to hex')) {
    const hexMatch = prompt.match(/#?([a-f0-9]{6})/i);
    if (hexMatch && hexMatch[1] && normalized.includes('hex to rgb')) {
      return { text: hexToRgb('#' + hexMatch[1]), type: 'tool' };
    }
    const rgbMatch = prompt.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
    if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3] && normalized.includes('rgb to hex')) {
      return { text: rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])), type: 'tool' };
    }
  }
  
  // Timestamp
  if (normalized.includes('timestamp') || normalized.includes('horodatage')) {
    return { text: getCurrentTimestamp(), type: 'tool' };
  }
  
  // Math calculations (existing)
  if (normalized.match(/\d+\s*\+\s*\d+/)) {
    const match = normalized.match(/(\d+)\s*\+\s*(\d+)/);
    if (match && match[1] && match[2]) {
      const a = parseInt(match[1]);
      const b = parseInt(match[2]);
      return { text: `🧮 ${a} + ${b} = ${a + b}`, type: 'tool' };
    }
  }
  if (normalized.match(/\d+\s*-\s*\d+/)) {
    const match = normalized.match(/(\d+)\s*-\s*(\d+)/);
    if (match && match[1] && match[2]) {
      const a = parseInt(match[1]);
      const b = parseInt(match[2]);
      return { text: `🧮 ${a} - ${b} = ${a - b}`, type: 'tool' };
    }
  }
  if (normalized.match(/\d+\s*\*\s*\d+/)) {
    const match = normalized.match(/(\d+)\s*\*\s*(\d+)/);
    if (match && match[1] && match[2]) {
      const a = parseInt(match[1]);
      const b = parseInt(match[2]);
      return { text: `🧮 ${a} × ${b} = ${a * b}`, type: 'tool' };
    }
  }
  
  // Knowledge base search
  for (const entry of KNOWLEDGE_BASE) {
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword)) {
        const response = entry.responses[Math.floor(Math.random() * entry.responses.length)];
        if (response) return { text: response, type: 'text' };
      }
    }
  }
  
  // Greetings
  if (normalized.includes('bonjour') || normalized.includes('salut') || normalized.includes('hello') || normalized.includes('hi')) {
    const greetings = [
      'Bonjour ! 👋 Je suis NexusBot. Comment puis-je vous aider aujourd\'hui ?',
      'Salut ! 😊 Je suis prêt à vous aider avec NexusOS ou d\'autres questions.',
      'Hello ! 🤖 NexusBot à votre service. Que souhaitez-vous savoir ?',
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return { text: greeting || 'Bonjour !', type: 'text' };
  }
  
  if (normalized.includes('merci') || normalized.includes('thank')) {
    const thanks = [
      'Je vous en prie ! 😊 N\'hésitez pas si vous avez d\'autres questions.',
      'Avec plaisir ! 🤖 Je suis là pour vous aider.',
      'De rien ! 👍 Y a-t-il autre chose que je puisse faire pour vous ?',
    ];
    const thank = thanks[Math.floor(Math.random() * thanks.length)];
    return { text: thank || 'De rien !', type: 'text' };
  }
  
  // NexusOS-specific questions (existing)
  if (normalized.includes('tâche') || normalized.includes('todo') || normalized.includes('task')) {
    return { text: '📋 Pour gérer vos tâches, utilisez le module **Tâches** accessible depuis le dashboard. Vous pouvez créer, modifier et suivre vos tâches facilement.', type: 'text' };
  }
  if (normalized.includes('note') || normalized.includes('notes') || normalized.includes('markdown')) {
    return { text: '📝 Le module **Notes Markdown** vous permet de créer des notes avec support Markdown. Idéal pour la documentation et les mémos.', type: 'text' };
  }
  if (normalized.includes('thème') || normalized.includes('theme') || normalized.includes('couleur')) {
    return { text: '🎨 Vous pouvez personnaliser l\'apparence dans l\'éditeur de thème ! 5 thèmes sont disponibles:\n\n• **Cyberpunk** - Thème par défaut futuriste\n• **Neon** - Couleurs vives avec effets glow\n• **Minimalist** - Design épuré professionnel\n• **Glassmorphism** - Effets verre modernes\n• **Synthwave** - Esthétique rétro 80s', type: 'text' };
  }
  if (normalized.includes('mot de passe') || normalized.includes('password') || normalized.includes('mdp')) {
    return { text: '🔐 Pour la sécurité des mots de passe:\n\n• **Password Vault** - Stockage sécurisé avec chiffrement AES-GCM\n• **Password Generator** - Générateur de mots de passe forts\n• **PGP Tools** - Chiffrement PGP pour communications sécurisées', type: 'text' };
  }
  
  // Time and date
  if (normalized.includes('heure') || normalized.includes('time') || normalized.includes('quelle heure')) {
    const now = new Date();
    return { text: `🕐 Il est actuellement ${now.toLocaleTimeString('fr-FR')}.`, type: 'text' };
  }
  if (normalized.includes('date') || normalized.includes('quel jour') || normalized.includes('what day')) {
    const now = new Date();
    return { text: `📅 Nous sommes le ${now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`, type: 'text' };
  }
  
  // Help
  if (normalized.includes('aide') || normalized.includes('help') || normalized.includes('comment')) {
    return { text: '❓ **Commandes disponibles:**\n\n• Navigation: "ouvre le dashboard", "ouvre les paramètres"\n• Calculs: "calcule 2+2", "convertir 100 km en miles"\n• Outils: "uuid", "générer mot de passe", "base64 encoder"\n• Connaissances: cuisine, programmation, histoire, sciences\n\nUtilisez **Ctrl+K** pour la palette de commandes.', type: 'text' };
  }
  
  // Default responses
  const defaultResponses = [
    'Je suis NexusBot, un assistant IA. Je peux répondre à des questions générales, faire des calculs, vous aider avec NexusOS, ou utiliser des outils. Essayez de me poser une question !',
    'Je suis là pour vous aider ! Demandez-moi sur n\'importe quel sujet - cuisine, programmation, histoire, ou utilisez mes outils intégrés.',
    'NexusBot à votre service ! Je peux naviguer dans NexusOS, répondre à des questions, ou effectuer des calculs. Que souhaitez-vous savoir ?',
  ];
  const response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  return { text: response || 'Comment puis-je vous aider ?', type: 'text' };
}

export function AIChatPage() {
  const [messages, setMessages] = useState<AIMessage[]>(defaultMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  // Initialize storage
  useEffect(() => {
    nexusBotStorage.init().catch(console.error);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // Save chat history
  useEffect(() => {
    if (messages.length > 1) {
      nexusBotStorage.saveChatHistory({
        id: 'current',
        messages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).catch(console.error);
    }
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    setIsLoading(true);

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');

    // Save command to recent commands
    await nexusBotStorage.addRecentCommand(text).catch(console.error);

    // Generate response
    const { text: responseText, type } = generateLocalResponse(text);
    
    const assistantMessage: AIMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: responseText,
      timestamp: Date.now(),
      type,
    };

    setTimeout(() => {
      setMessages((current) => [...current, assistantMessage]);
      setIsLoading(false);
    }, 300);
  };

  const handleClear = () => {
    setMessages(defaultMessages);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { label: '🏠 Dashboard', action: () => window.location.href = '/dashboard' },
    { label: '⚙️ Paramètres', action: () => window.location.href = '/settings' },
    { label: '🎨 Thèmes', action: () => window.location.href = '/modules/customization/theme-editor' },
    { label: '🔐 Password Vault', action: () => window.location.href = '/modules/security/password-vault' },
  ];

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>AI Chat</h1>
        <p className="nx-muted">Assistant IA NexusBot - Connaissances générales, navigation, calculs et outils intégrés.</p>
      </div>

      <div className="nx-settings-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              type="button"
              className="nx-btn nx-btn-secondary"
              onClick={action.action}
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div 
          ref={chatHistoryRef}
          className="nx-chat-history" 
          style={{
            minHeight: '400px',
            maxHeight: '600px',
            overflowY: 'auto',
            padding: '1rem',
            background: 'var(--nx-surface-2)',
            borderRadius: 'var(--nx-radius)',
            border: '1px solid var(--nx-border)',
          }}
        >
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
                  : message.type === 'navigation'
                  ? 'rgba(0, 255, 136, 0.1)'
                  : message.type === 'tool'
                  ? 'rgba(255, 193, 7, 0.1)'
                  : 'rgba(168, 85, 247, 0.1)',
                border: message.role === 'user'
                  ? '1px solid rgba(0, 245, 255, 0.2)'
                  : message.type === 'navigation'
                  ? '1px solid rgba(0, 255, 136, 0.2)'
                  : message.type === 'tool'
                  ? '1px solid rgba(255, 193, 7, 0.2)'
                  : '1px solid rgba(168, 85, 247, 0.2)',
                maxWidth: '80%',
                marginLeft: message.role === 'user' ? 'auto' : '0',
                marginRight: message.role === 'assistant' ? 'auto' : '0',
                animation: 'fadeInUp 0.3s ease-out',
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
                  color: message.role === 'user' ? 'var(--nx-cyan)' : 
                         message.type === 'navigation' ? 'var(--nx-green)' :
                         message.type === 'tool' ? 'var(--nx-yellow)' :
                         'var(--nx-purple)',
                  fontSize: '0.875rem',
                }}>
                  {message.role === 'user' ? 'Vous' : 
                   message.type === 'navigation' ? '🧭 Navigation' :
                   message.type === 'tool' ? '🔧 Outil' :
                   'NexusBot'}
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
          {isLoading && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--nx-radius)',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              maxWidth: '80%',
              marginLeft: '0',
            }}>
              <p style={{ margin: 0, color: 'var(--nx-muted)' }}>🤖 NexusBot réfléchit...</p>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <form onSubmit={handleSubmit} className="nx-chat-form" style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Posez une question ou tapez une commande..."
              className="nx-input"
              style={{ flex: 1 }}
              disabled={isLoading}
            />
            <button type="submit" className="nx-btn" disabled={!canSend || isLoading}>
              {isLoading ? '...' : 'Envoyer'}
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

        {/* Help hint */}
        <p className="nx-muted" style={{ fontSize: '0.875rem', margin: 0 }}>
          💡 Essayez: "ouvre le dashboard", "calcule 2+2", "convertir 100 km en miles", "uuid", "comment faire des pâtes"
        </p>
      </div>
    </section>
  );
}
