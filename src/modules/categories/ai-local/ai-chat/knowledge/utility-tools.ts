// Calculator
export function calculate(expression: string): string {
  try {
    // Safe evaluation of mathematical expressions
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
    const result = Function(`"use strict"; return (${sanitized})`)();
    return `🧮 Résultat: ${result}`;
  } catch (error) {
    return '❌ Expression mathématique invalide';
  }
}

// Unit Converter
export function convertUnits(value: number, from: string, to: string): string {
  const conversions: Record<string, Record<string, number>> = {
    length: {
      m: 1,
      km: 0.001,
      cm: 100,
      mm: 1000,
      ft: 3.28084,
      in: 39.3701,
      mi: 0.000621371,
    },
    weight: {
      kg: 1,
      g: 1000,
      mg: 1000000,
      lb: 2.20462,
      oz: 35.274,
    },
    temperature: {
      celsius: 1,
      fahrenheit: 0,
      kelvin: 0,
    },
  };

  // Temperature special handling
  if (from === 'celsius' && to === 'fahrenheit') {
    return `🌡️ ${(value * 9/5) + 32}°F`;
  }
  if (from === 'fahrenheit' && to === 'celsius') {
    return `🌡️ ${(value - 32) * 5/9}°C`;
  }
  if (from === 'celsius' && to === 'kelvin') {
    return `🌡️ ${value + 273.15}K`;
  }
  if (from === 'kelvin' && to === 'celsius') {
    return `🌡️ ${value - 273.15}°C`;
  }

  // Standard conversion
  for (const category in conversions) {
    const categoryConversions = conversions[category];
    if (categoryConversions && categoryConversions[from] && categoryConversions[to]) {
      const baseValue = value / categoryConversions[from];
      const result = baseValue * categoryConversions[to];
      return `🔄 ${value} ${from} = ${result.toFixed(4)} ${to}`;
    }
  }

  return '❌ Conversion non supportée';
}

// UUID Generator
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Password Generator
export function generatePassword(length: number = 16, options: {
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
} = {}): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  if (options.uppercase !== false) chars += uppercase;
  if (options.lowercase !== false) chars += lowercase;
  if (options.numbers !== false) chars += numbers;
  if (options.symbols !== false) chars += symbols;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `🔐 Mot de passe: ${password}`;
}

// Base64 Encoder/Decoder
export function encodeBase64(text: string): string {
  try {
    const encoded = btoa(text);
    return `📝 Base64: ${encoded}`;
  } catch (error) {
    return '❌ Erreur lors de l\'encodage';
  }
}

export function decodeBase64(encoded: string): string {
  try {
    const decoded = atob(encoded);
    return `📝 Décodé: ${decoded}`;
  } catch (error) {
    return '❌ Erreur lors du décodage';
  }
}

// QR Code Generator (placeholder - would need a library)
export function generateQRCode(text: string): string {
  return `📱 QR Code pour: ${text}\n\n(Note: L\'implémentation complète nécessite une bibliothèque QR Code)`;
}

// Hash functions
export function hashString(_text: string, algorithm: 'md5' | 'sha1' | 'sha256' = 'sha256'): string {
  // Placeholder - would need crypto API
  return `🔒 Hash ${algorithm}: (nécessite Web Crypto API)`;
}

// Timestamp utilities
export function getCurrentTimestamp(): string {
  return `🕐 ${new Date().toISOString()}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('fr-FR');
}

// Color utilities
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) return '❌ Couleur hex invalide';
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `🎨 RGB: rgb(${r}, ${g}, ${b})`;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `🎨 Hex: #${toHex(r)}${toHex(g)}${toHex(b)}`;
}
