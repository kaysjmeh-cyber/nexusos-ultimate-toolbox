import { useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { toast } from '@stores/toast-store';

type UnitCategory = 'length' | 'mass' | 'temperature' | 'area' | 'volume' | 'speed' | 'data';

interface UnitDef {
  label: string;
  symbol: string;
  /** Factor to convert to the base unit (or special fn for temperature) */
  toBase?: (v: number) => number;
  fromBase?: (v: number) => number;
  factor?: number; // simple: value_in_base = value * factor
}

interface CategoryDef {
  label: string;
  units: UnitDef[];
}

const CATEGORIES: Record<UnitCategory, CategoryDef> = {
  length: {
    label: 'Longueur',
    units: [
      { label: 'Millimètre',  symbol: 'mm',  factor: 0.001 },
      { label: 'Centimètre',  symbol: 'cm',  factor: 0.01 },
      { label: 'Mètre',       symbol: 'm',   factor: 1 },
      { label: 'Kilomètre',   symbol: 'km',  factor: 1000 },
      { label: 'Pouce',       symbol: 'in',  factor: 0.0254 },
      { label: 'Pied',        symbol: 'ft',  factor: 0.3048 },
      { label: 'Yard',        symbol: 'yd',  factor: 0.9144 },
      { label: 'Mile',        symbol: 'mi',  factor: 1609.344 },
    ],
  },
  mass: {
    label: 'Masse',
    units: [
      { label: 'Milligramme', symbol: 'mg',  factor: 0.000001 },
      { label: 'Gramme',      symbol: 'g',   factor: 0.001 },
      { label: 'Kilogramme',  symbol: 'kg',  factor: 1 },
      { label: 'Tonne',       symbol: 't',   factor: 1000 },
      { label: 'Livre',       symbol: 'lb',  factor: 0.45359237 },
      { label: 'Once',        symbol: 'oz',  factor: 0.028349523 },
    ],
  },
  temperature: {
    label: 'Température',
    units: [
      {
        label: 'Celsius',    symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        label: 'Fahrenheit', symbol: '°F',
        toBase: (v) => (v - 32) * 5 / 9,
        fromBase: (v) => v * 9 / 5 + 32,
      },
      {
        label: 'Kelvin',     symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
  area: {
    label: 'Surface',
    units: [
      { label: 'mm²',       symbol: 'mm²',  factor: 1e-6 },
      { label: 'cm²',       symbol: 'cm²',  factor: 1e-4 },
      { label: 'm²',        symbol: 'm²',   factor: 1 },
      { label: 'km²',       symbol: 'km²',  factor: 1e6 },
      { label: 'Hectare',   symbol: 'ha',   factor: 10000 },
      { label: 'Acre',      symbol: 'acre', factor: 4046.856 },
    ],
  },
  volume: {
    label: 'Volume',
    units: [
      { label: 'Millilitre', symbol: 'mL',  factor: 0.001 },
      { label: 'Centilitre', symbol: 'cL',  factor: 0.01 },
      { label: 'Litre',      symbol: 'L',   factor: 1 },
      { label: 'Mètre cube', symbol: 'm³',  factor: 1000 },
      { label: 'Gallon US',  symbol: 'gal', factor: 3.785411784 },
      { label: 'Pinte',      symbol: 'pt',  factor: 0.473176473 },
    ],
  },
  speed: {
    label: 'Vitesse',
    units: [
      { label: 'km/h',  symbol: 'km/h', factor: 1 },
      { label: 'm/s',   symbol: 'm/s',  factor: 3.6 },
      { label: 'mph',   symbol: 'mph',  factor: 1.609344 },
      { label: 'Nœud',  symbol: 'kn',   factor: 1.852 },
    ],
  },
  data: {
    label: 'Données',
    units: [
      { label: 'Bit',       symbol: 'b',   factor: 1 },
      { label: 'Octet',     symbol: 'B',   factor: 8 },
      { label: 'Kilooctet', symbol: 'KB',  factor: 8 * 1024 },
      { label: 'Mégaoctet', symbol: 'MB',  factor: 8 * 1024 * 1024 },
      { label: 'Gigaoctet', symbol: 'GB',  factor: 8 * 1024 ** 3 },
      { label: 'Téraoctet', symbol: 'TB',  factor: 8 * 1024 ** 4 },
    ],
  },
};

function convert(value: number, from: UnitDef, to: UnitDef): number {
  // Temperature uses special functions; others use factor
  let base: number;
  if (from.toBase) {
    base = from.toBase(value);
  } else {
    base = value * (from.factor ?? 1);
  }
  if (to.fromBase) {
    return to.fromBase(base);
  }
  return base / (to.factor ?? 1);
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—';
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-5 && n !== 0)) {
    return n.toExponential(6);
  }
  const s = n.toPrecision(10);
  return parseFloat(s).toString();
}

export function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(2);
  const [inputValue, setInputValue] = useState('1');

  const catDef = CATEGORIES[category];
  const units = catDef.units;
  const fromUnit = units[fromIdx] ?? units[0]!;
  const toUnit   = units[toIdx]   ?? units[1]!;

  const numVal = parseFloat(inputValue);
  const result = isNaN(numVal) ? null : convert(numVal, fromUnit, toUnit);

  function swap() {
    const prevFrom = fromIdx;
    setFromIdx(toIdx);
    setToIdx(prevFrom);
  }

  function copyResult() {
    if (result === null) return;
    void navigator.clipboard.writeText(fmt(result)).then(() => {
      toast.success('Copié !', `${fmt(result)} ${toUnit.symbol}`);
    });
  }

  return (
    <div className="nx-page">
      {/* Header */}
      <div className="nx-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nx-space-3)', marginBottom: 'var(--nx-space-2)' }}>
          <ArrowLeftRight size={24} style={{ color: 'var(--nx-orange)', filter: 'drop-shadow(0 0 6px rgba(251,146,60,0.6))' }} />
          <h1 style={{ margin: 0 }}>Convertisseur d'unités</h1>
        </div>
        <p className="nx-muted nx-text-sm">Convertissez rapidement entre unités de mesure.</p>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 'var(--nx-space-2)', flexWrap: 'wrap', marginBottom: 'var(--nx-space-5)' }}>
        {(Object.entries(CATEGORIES) as [UnitCategory, CategoryDef][]).map(([key, def]) => (
          <button
            key={key}
            type="button"
            className={`nx-btn nx-btn-sm ${category === key ? '' : 'nx-btn-secondary'}`}
            onClick={() => { setCategory(key); setFromIdx(0); setToIdx(Math.min(2, CATEGORIES[key].units.length - 1)); }}
          >
            {def.label}
          </button>
        ))}
      </div>

      {/* Converter card */}
      <div className="nx-card" style={{ maxWidth: 560 }}>
        {/* From */}
        <div className="nx-form-group">
          <label className="nx-label">De</label>
          <div style={{ display: 'flex', gap: 'var(--nx-space-2)' }}>
            <input
              type="number"
              className="nx-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Valeur…"
              style={{ flex: 1 }}
            />
            <select
              className="nx-input"
              style={{ flex: '0 0 160px', cursor: 'pointer' }}
              value={fromIdx}
              onChange={(e) => setFromIdx(Number(e.target.value))}
            >
              {units.map((u, i) => (
                <option key={u.symbol} value={i}>{u.label} ({u.symbol})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--nx-space-2) 0' }}>
          <button
            type="button"
            className="nx-btn-icon"
            onClick={swap}
            title="Échanger les unités"
            style={{ border: '1px solid var(--nx-border)', borderRadius: 'var(--nx-radius-full)', padding: 8 }}
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* To */}
        <div className="nx-form-group">
          <label className="nx-label">Vers</label>
          <div style={{ display: 'flex', gap: 'var(--nx-space-2)' }}>
            <div
              style={{
                flex: 1,
                padding: 'var(--nx-space-2) var(--nx-space-3)',
                background: 'rgba(0,245,255,0.05)',
                border: '1px solid rgba(0,245,255,0.2)',
                borderRadius: 'var(--nx-radius)',
                fontFamily: 'var(--nx-font-mono)',
                fontSize: 'var(--nx-font-size-lg)',
                fontWeight: 700,
                color: 'var(--nx-cyan)',
                textShadow: '0 0 8px rgba(0,245,255,0.5)',
                cursor: result !== null ? 'pointer' : 'default',
              }}
              onClick={copyResult}
              title={result !== null ? 'Cliquer pour copier' : ''}
            >
              {result !== null ? fmt(result) : '—'}
            </div>
            <select
              className="nx-input"
              style={{ flex: '0 0 160px', cursor: 'pointer' }}
              value={toIdx}
              onChange={(e) => setToIdx(Number(e.target.value))}
            >
              {units.map((u, i) => (
                <option key={u.symbol} value={i}>{u.label} ({u.symbol})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula display */}
        {result !== null && (
          <div
            className="nx-muted"
            style={{ fontSize: 'var(--nx-font-size-xs)', fontFamily: 'var(--nx-font-mono)', marginTop: 'var(--nx-space-3)', padding: 'var(--nx-space-3)', background: 'rgba(10,14,23,0.5)', borderRadius: 'var(--nx-radius)', border: '1px solid var(--nx-border)' }}
          >
            {fmt(numVal)} {fromUnit.symbol} = {fmt(result)} {toUnit.symbol}
          </div>
        )}
      </div>

      {/* All unit conversions table */}
      <div className="nx-card" style={{ marginTop: 'var(--nx-space-5)' }}>
        <div className="nx-card-header">
          <span className="nx-card-title">Toutes les conversions — {catDef.label}</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--nx-font-size-sm)' }}>
            <thead>
              <tr>
                <th style={{ padding: 'var(--nx-space-2) var(--nx-space-3)', textAlign: 'left', color: 'var(--nx-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--nx-border)' }}>Unité</th>
                <th style={{ padding: 'var(--nx-space-2) var(--nx-space-3)', textAlign: 'right', color: 'var(--nx-text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--nx-border)' }}>Valeur</th>
              </tr>
            </thead>
            <tbody>
              {!isNaN(numVal) && units.map((u, i) => {
                const val = convert(numVal, fromUnit, u);
                return (
                  <tr key={u.symbol} style={{ background: i === toIdx ? 'rgba(0,245,255,0.04)' : undefined }}>
                    <td style={{ padding: 'var(--nx-space-2) var(--nx-space-3)', color: 'var(--nx-text-secondary)', borderBottom: '1px solid var(--nx-border)' }}>
                      {u.label} <span style={{ color: 'var(--nx-muted)' }}>({u.symbol})</span>
                    </td>
                    <td style={{ padding: 'var(--nx-space-2) var(--nx-space-3)', textAlign: 'right', fontFamily: 'var(--nx-font-mono)', color: i === toIdx ? 'var(--nx-cyan)' : 'var(--nx-text)', borderBottom: '1px solid var(--nx-border)' }}>
                      {fmt(val)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
