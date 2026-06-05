import { useState, useCallback } from 'react';
import { KeyRound, RefreshCw, Copy, Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from '@stores/toast-store';

interface PwOptions {
  length: number;
  lower: boolean;
  upper: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

const LOWER   = 'abcdefghijklmnopqrstuvwxyz';
const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const AMBIGUOUS = /[0Oo1lIi|]/g;

function generatePassword(opts: PwOptions): string {
  let chars = '';
  if (opts.lower)   chars += LOWER;
  if (opts.upper)   chars += UPPER;
  if (opts.numbers) chars += NUMBERS;
  if (opts.symbols) chars += SYMBOLS;
  if (!chars) chars = LOWER + NUMBERS;
  if (opts.excludeAmbiguous) chars = chars.replace(AMBIGUOUS, '');

  const pool = chars;
  const n = pool.length;
  const arr = new Uint32Array(opts.length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v) => pool.charAt(v % n)).join('');
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score += 1;
  if (pw.length >= 12) score += 1;
  if (pw.length >= 16) score += 1;
  if (/[a-z]/.test(pw))      score += 1;
  if (/[A-Z]/.test(pw))      score += 1;
  if (/[0-9]/.test(pw))      score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  const capped = Math.min(score, 7);
  if (capped <= 2) return { score: capped, label: 'Très faible', color: 'var(--nx-red)' };
  if (capped <= 3) return { score: capped, label: 'Faible',      color: 'var(--nx-orange)' };
  if (capped <= 4) return { score: capped, label: 'Moyen',       color: '#eab308' };
  if (capped <= 5) return { score: capped, label: 'Fort',        color: 'var(--nx-green)' };
  return                 { score: capped, label: 'Très fort',   color: 'var(--nx-cyan)' };
}

const DEFAULT_OPTS: PwOptions = {
  length: 16,
  lower: true,
  upper: true,
  numbers: true,
  symbols: false,
  excludeAmbiguous: false,
};

// History limit
const HISTORY_LIMIT = 10;

export function PasswordGeneratorPage() {
  const [opts, setOpts] = useState<PwOptions>(DEFAULT_OPTS);
  const [password, setPassword] = useState<string>(() => generatePassword(DEFAULT_OPTS));
  const [showPassword, setShowPassword] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const refresh = useCallback((newOpts?: PwOptions) => {
    const o = newOpts ?? opts;
    const pw = generatePassword(o);
    setPassword(pw);
    setHistory((h) => [pw, ...h].slice(0, HISTORY_LIMIT));
  }, [opts]);

  function updateOpt<K extends keyof PwOptions>(key: K, value: PwOptions[K]) {
    const next = { ...opts, [key]: value };
    setOpts(next);
    refresh(next);
  }

  async function copyToClipboard(pw: string) {
    await navigator.clipboard.writeText(pw);
    toast.success('Mot de passe copié !', `${pw.length} caractères`);
  }

  const strength = passwordStrength(password);
  const strengthBars = 4;
  const filledBars = Math.ceil((strength.score / 7) * strengthBars);

  return (
    <div className="nx-page">
      {/* Header */}
      <div className="nx-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nx-space-3)', marginBottom: 'var(--nx-space-2)' }}>
          <KeyRound size={24} style={{ color: 'var(--nx-purple)', filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.6))' }} />
          <h1 style={{ margin: 0 }}>Générateur de mots de passe</h1>
        </div>
        <p className="nx-muted nx-text-sm">Générez des mots de passe sécurisés cryptographiquement.</p>
      </div>

      <div className="nx-grid nx-grid-2" style={{ gap: 'var(--nx-space-5)', alignItems: 'start' }}>
        {/* Generator panel */}
        <div>
          {/* Output */}
          <div
            className="nx-card"
            style={{ marginBottom: 'var(--nx-space-4)', padding: 'var(--nx-space-4)' }}
          >
            <div
              style={{
                fontFamily: 'var(--nx-font-mono)',
                fontSize: 'clamp(14px, 2vw, 18px)',
                fontWeight: 700,
                color: 'var(--nx-cyan)',
                wordBreak: 'break-all',
                letterSpacing: '0.08em',
                textShadow: '0 0 8px rgba(0,245,255,0.4)',
                minHeight: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: showPassword ? undefined : 'blur(8px)',
                userSelect: showPassword ? undefined : 'none',
                transition: 'filter 200ms',
              }}
            >
              {password}
            </div>

            {/* Strength meter */}
            <div className="nx-pw-strength" style={{ marginTop: 'var(--nx-space-3)' }}>
              {Array.from({ length: strengthBars }, (_, i) => (
                <div
                  key={i}
                  className={`nx-pw-strength-bar${i < filledBars ? ` active-${Math.min(filledBars, 4)}` : ''}`}
                  style={{ background: i < filledBars ? strength.color : undefined }}
                />
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 'var(--nx-font-size-xs)', color: strength.color, marginTop: 'var(--nx-space-1)', fontWeight: 600 }}>
              <Shield size={10} style={{ display: 'inline', marginRight: 3 }} />
              {strength.label}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--nx-space-2)', marginTop: 'var(--nx-space-3)', justifyContent: 'center' }}>
              <button type="button" className="nx-btn" onClick={() => refresh()}>
                <RefreshCw size={14} />
                Générer
              </button>
              <button type="button" className="nx-btn nx-btn-secondary" onClick={() => void copyToClipboard(password)}>
                <Copy size={14} />
                Copier
              </button>
              <button
                type="button"
                className="nx-btn-icon"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="nx-card">
            <div className="nx-card-header">
              <span className="nx-card-title">Options</span>
            </div>

            {/* Length */}
            <div className="nx-form-group">
              <label className="nx-label">
                Longueur : <strong style={{ color: 'var(--nx-cyan)' }}>{opts.length}</strong>
              </label>
              <input
                type="range"
                min={4}
                max={128}
                value={opts.length}
                onChange={(e) => updateOpt('length', Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--nx-cyan)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--nx-muted)' }}>
                <span>4</span><span>128</span>
              </div>
            </div>

            {/* Checkboxes */}
            {([
              ['lower',            'Minuscules (a-z)'],
              ['upper',            'Majuscules (A-Z)'],
              ['numbers',          'Chiffres (0-9)'],
              ['symbols',          'Symboles (!@#…)'],
              ['excludeAmbiguous', 'Exclure ambigus (0,O,l,I…)'],
            ] as [keyof PwOptions, string][]).map(([key, label]) => (
              <label
                key={key}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--nx-space-3)', cursor: 'pointer', padding: 'var(--nx-space-2) 0', fontSize: 'var(--nx-font-size-sm)' }}
              >
                <input
                  type="checkbox"
                  checked={opts[key] as boolean}
                  onChange={(e) => updateOpt(key, e.target.checked as PwOptions[typeof key])}
                  style={{ accentColor: 'var(--nx-cyan)', width: 16, height: 16, cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--nx-text-secondary)' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* History */}
        <div>
          <div className="nx-card">
            <div className="nx-card-header">
              <span className="nx-card-title">Historique</span>
              <span className="nx-badge" style={{ marginLeft: 'auto' }}>{history.length}</span>
            </div>
            {history.length === 0 ? (
              <p className="nx-muted nx-text-sm" style={{ textAlign: 'center', padding: 'var(--nx-space-4)' }}>
                Générez un premier mot de passe
              </p>
            ) : (
              <ul className="nx-list" style={{ gap: 'var(--nx-space-1)' }}>
                {history.map((pw, i) => {
                  const s = passwordStrength(pw);
                  return (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--nx-space-2)',
                        padding: 'var(--nx-space-2) var(--nx-space-3)',
                        background: i === 0 ? 'rgba(0,245,255,0.05)' : 'transparent',
                        border: `1px solid ${i === 0 ? 'rgba(0,245,255,0.15)' : 'var(--nx-border)'}`,
                        borderRadius: 'var(--nx-radius)',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--nx-font-mono)',
                          fontSize: 'var(--nx-font-size-xs)',
                          color: i === 0 ? 'var(--nx-cyan)' : 'var(--nx-text-secondary)',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {pw}
                      </span>
                      <span style={{ fontSize: 9, color: s.color, fontWeight: 600, flexShrink: 0 }}>{s.label}</span>
                      <button
                        type="button"
                        className="nx-btn-icon"
                        style={{ padding: 4, border: 'none' }}
                        onClick={() => void copyToClipboard(pw)}
                        title="Copier"
                      >
                        <Copy size={12} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
