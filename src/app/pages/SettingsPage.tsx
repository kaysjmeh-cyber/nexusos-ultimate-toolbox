import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { backupEngine } from '@core/backup/backup-engine';
import { profileManager } from '@core/profiles/profile-manager';
import { moduleRegistry } from '@modules/registry';
import { themeRegistry } from '@themes/registry/theme-registry';
import type { UserProfile } from '@nexus-types/profile';

const SECTIONS = [
  { id: 'general', label: 'Général', icon: '⚙️' },
  { id: 'appearance', label: 'Apparence', icon: '🎨' },
  { id: 'profiles', label: 'Profils', icon: '👤' },
  { id: 'themes', label: 'Thèmes', icon: '🌈' },
  { id: 'modules', label: 'Modules', icon: '📦' },
  { id: 'security', label: 'Sécurité', icon: '🔒' },
  { id: 'data', label: 'Données', icon: '💾' },
  { id: 'backup', label: 'Sauvegarde', icon: '💿' },
  { id: 'advanced', label: 'Avancé', icon: '🔧' },
];

const QUICK_TOOLS = [
  { id: 'json-formatter', label: 'JSON Formatter', icon: '💻', path: '/modules/development/json-formatter' },
  { id: 'unit-converter', label: 'Convertisseur', icon: '🔄', path: '/modules/development/unit-converter' },
  { id: 'password-generator', label: 'Générateur MDP', icon: '🔐', path: '/modules/security/password-generator' },
  { id: 'password-vault', label: 'Coffre Fort', icon: '🗄️', path: '/modules/security/password-vault' },
];

export function SettingsPage() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = section ?? 'general';
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(profileManager.getActiveProfileId());
  const [newProfileName, setNewProfileName] = useState('');
  const [snapshotMessage, setSnapshotMessage] = useState('');
  const [themeId, setThemeId] = useState(themeRegistry.getActive()?.id ?? '');
  const [modules, setModules] = useState(moduleRegistry.list());
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [backupInterval, setBackupInterval] = useState(24);
  const [showQuickTools, setShowQuickTools] = useState(false);
  
  // New settings states
  const [language, setLanguage] = useState('fr-FR');
  const [fontSize, setFontSize] = useState(16);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoLockEnabled, setAutoLockEnabled] = useState(false);
  const [autoLockTimeout, setAutoLockTimeout] = useState(30);
  const [clearDataMessage, setClearDataMessage] = useState('');
  const [developerMode, setDeveloperMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState(false);

  useEffect(() => {
    async function loadProfiles() {
      const loadedProfiles = await profileManager.listProfiles();
      setProfiles(loadedProfiles);
      setActiveProfileId(profileManager.getActiveProfileId());
    }
    loadProfiles();
    setThemeId(themeRegistry.getActive()?.id ?? '');
    setModules(moduleRegistry.list());
  }, []);

  const themes = useMemo(() => themeRegistry.list(), []);

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return;
    const id = `profile-${Date.now()}`;
    const profile: UserProfile = {
      id,
      displayName: newProfileName.trim(),
      role: 'owner',
      preferences: {
        locale: 'fr-FR',
        themeId: themeRegistry.getActive()?.id ?? 'nexusos-default',
        shortcuts: {},
      },
      meta: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    };
    await profileManager.saveProfile(profile);
    await profileManager.setActiveProfile(id);
    setNewProfileName('');
    setActiveProfileId(id);
    setProfiles(await profileManager.listProfiles());
  };

  const handleSwitchProfile = async (id: string) => {
    await profileManager.setActiveProfile(id);
    setActiveProfileId(id);
  };

  const handleThemeChange = async (id: string) => {
    setThemeId(id);
    await themeRegistry.setActive(id);
  };

  const handleToggleModule = (moduleId: string) => {
    const manifest = moduleRegistry.get(moduleId);
    if (!manifest) return;
    moduleRegistry.setEnabled(moduleId, !manifest.enabled);
    setModules(moduleRegistry.list());
  };

  const handleCreateSnapshot = async () => {
    const snapshot = await backupEngine.createSnapshot('Sauvegarde manuelle', ['profiles', 'themes', 'modules']);
    setSnapshotMessage(`Snapshot créé : ${snapshot.id} (${snapshot.sizeBytes} bytes)`);
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    setClearDataMessage('Cache et session effacés avec succès !');
    setTimeout(() => setClearDataMessage(''), 3000);
  };

  const handleClearAllData = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données locales ? Cette action est irréversible.')) {
      localStorage.clear();
      sessionStorage.clear();
      setClearDataMessage('Toutes les données ont été effacées. La page va se recharger.');
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const handleExportSettings = () => {
    const settings = {
      themeId,
      language,
      fontSize,
      animationsEnabled,
      notificationsEnabled,
      autoBackupEnabled,
      backupInterval,
      autoLockEnabled,
      autoLockTimeout,
      developerMode,
      debugLogs,
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexusos-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>Paramètres</h1>
        <p className="nx-muted">Gérez les profils, le thème, les modules et les sauvegardes.</p>
      </div>

      {/* Quick Tools Dropdown */}
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <button
          type="button"
          className="nx-btn nx-btn-secondary"
          onClick={() => setShowQuickTools(!showQuickTools)}
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <span>🔧 Outils Rapides</span>
          <span>{showQuickTools ? '▲' : '▼'}</span>
        </button>
        
        {showQuickTools && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--nx-surface-2)',
            border: '1px solid var(--nx-border)',
            borderRadius: 'var(--nx-radius)',
            marginTop: '0.5rem',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}>
            {QUICK_TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className="nx-btn"
                onClick={() => {
                  navigate(tool.path);
                  setShowQuickTools(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{tool.icon}</span>
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="nx-settings-nav">
        {SECTIONS.map((item) => (
          <Link key={item.id} to={`/settings/${item.id}`} className="nx-nav-link">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {activeSection === 'general' && (
        <div className="nx-settings-panel">
          <h2>⚙️ Vue générale</h2>
          <p>Profil actif : <strong>{activeProfileId ?? 'aucun profil sélectionné'}</strong></p>
          <p>Thème actif : <strong>{themeRegistry.getActive()?.name ?? 'NexusOS Default'}</strong></p>
          <p>Modules enregistrés : <strong>{moduleRegistry.count()}</strong></p>
          <p>Langue : <strong>{language}</strong></p>
          <p>Taille de police : <strong>{fontSize}px</strong></p>
        </div>
      )}

      {activeSection === 'appearance' && (
        <div className="nx-settings-panel">
          <h2>🎨 Apparence</h2>
          <p className="nx-muted">Personnalisez l\'interface de NexusOS.</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <strong>Langue</strong>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="nx-input"
              style={{ width: '100%', maxWidth: '300px' }}
            >
              <option value="fr-FR">Français</option>
              <option value="en-US">English</option>
              <option value="es-ES">Español</option>
              <option value="de-DE">Deutsch</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <strong>Taille de police</strong>
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: '100%', maxWidth: '300px' }}
            />
            <span style={{ marginLeft: '0.5rem' }}>{fontSize}px</span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(e) => setAnimationsEnabled(e.target.checked)}
              />
              <span style={{ marginLeft: '0.5rem' }}>Activer les animations</span>
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
              />
              <span style={{ marginLeft: '0.5rem' }}>Activer les notifications</span>
            </label>
          </div>
        </div>
      )}

      {activeSection === 'profiles' && (
        <div className="nx-settings-panel">
          <h2>👤 Profils</h2>
          <p className="nx-muted">Créer et changer de profil utilisateur local.</p>
          <div>
            <input
              type="text"
              placeholder="Nom du profil"
              value={newProfileName}
              onChange={(event) => setNewProfileName(event.target.value)}
              className="nx-input"
            />
            <button type="button" className="nx-btn" onClick={handleCreateProfile}>
              Créer un profil
            </button>
          </div>
          <ul className="nx-module-list">
            {profiles.map((profile) => (
              <li key={profile.id}>
                <div>
                  <strong>{profile.displayName}</strong>
                  <p className="nx-muted">Role : {profile.role}</p>
                </div>
                <button type="button" className="nx-btn" onClick={() => handleSwitchProfile(profile.id)}>
                  {profile.id === activeProfileId ? 'Actif' : 'Activer'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeSection === 'themes' && (
        <div className="nx-settings-panel">
          <h2>🌈 Thèmes</h2>
          <p className="nx-muted">Changer le thème actif de l\'application.</p>
          <ul className="nx-module-list">
            {themes.map((theme) => (
              <li key={theme.id}>
                <div>
                  <strong>{theme.name}</strong>
                  <p className="nx-muted">ID : {theme.id}</p>
                </div>
                <button
                  type="button"
                  className="nx-btn"
                  onClick={() => handleThemeChange(theme.id)}
                >
                  {themeId === theme.id ? 'Sélectionné' : 'Activer'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeSection === 'modules' && (
        <div className="nx-settings-panel">
          <h2>📦 Modules</h2>
          <p className="nx-muted">Activer ou désactiver les modules disponibles.</p>
          <ul className="nx-module-list">
            {modules.map((manifest) => (
              <li key={manifest.id}>
                <div>
                  <strong>{manifest.name}</strong>
                  <p className="nx-muted">{manifest.description}</p>
                </div>
                <div>
                  <button type="button" className="nx-btn" onClick={() => handleToggleModule(manifest.id)}>
                    {manifest.enabled ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeSection === 'security' && (
        <div className="nx-settings-panel">
          <h2>🔒 Sécurité</h2>
          <p className="nx-muted">Configurez les options de sécurité.</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>
              <input
                type="checkbox"
                checked={autoLockEnabled}
                onChange={(e) => setAutoLockEnabled(e.target.checked)}
              />
              <span style={{ marginLeft: '0.5rem' }}>Verrouillage automatique</span>
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <strong>Délai de verrouillage (minutes)</strong>
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={autoLockTimeout}
              onChange={(e) => setAutoLockTimeout(Number(e.target.value))}
              className="nx-input"
              style={{ width: '100%', maxWidth: '200px' }}
            />
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255, 0, 0, 0.3)', borderRadius: 'var(--nx-radius)' }}>
            <strong>⚠️ Zone de danger</strong>
            <p className="nx-muted">Actions de sécurité avancées.</p>
            <button type="button" className="nx-btn" onClick={handleClearCache}>
              Effacer le cache
            </button>
            <button type="button" className="nx-btn nx-btn-secondary" onClick={handleClearAllData} style={{ marginLeft: '0.5rem', background: 'rgba(255, 0, 0, 0.2)', borderColor: 'rgba(255, 0, 0, 0.5)' }}>
              Effacer toutes les données
            </button>
            {clearDataMessage && <p style={{ marginTop: '0.5rem', color: 'var(--nx-warning)' }}>{clearDataMessage}</p>}
          </div>
        </div>
      )}

      {activeSection === 'data' && (
        <div className="nx-settings-panel">
          <h2>💾 Données</h2>
          <p className="nx-muted">Gérez vos données et préférences.</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <button type="button" className="nx-btn" onClick={handleExportSettings}>
              📥 Exporter les paramètres
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              <strong>Importer des paramètres</strong>
            </label>
            <input
              type="file"
              accept=".json"
              className="nx-input"
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <p className="nx-muted">Espace de stockage utilisé : <strong>~2.5 MB</strong></p>
            <p className="nx-muted">Nombre d\'entrées localStorage : <strong>{localStorage.length}</strong></p>
          </div>
        </div>
      )}

      {activeSection === 'backup' && (
        <div className="nx-settings-panel">
          <h2>💿 Sauvegarde</h2>
          <p className="nx-muted">Créer un snapshot de l\'état local de NexusOS.</p>
          <div>
            <button type="button" className="nx-btn" onClick={handleCreateSnapshot}>
              Créer une sauvegarde
            </button>
          </div>
          {snapshotMessage && <p>{snapshotMessage}</p>}
          <div style={{ marginTop: '1rem' }}>
            <label>
              <input
                type="checkbox"
                checked={autoBackupEnabled}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setAutoBackupEnabled(enabled);
                  backupEngine.configure({ enabled, intervalMs: backupInterval * 60 * 60 * 1000 });
                }}
              />
              Activer la sauvegarde automatique
            </label>
          </div>
          <div>
            <label>
              Intervalle (heures) :
              <input
                type="number"
                min={1}
                value={backupInterval}
                onChange={(event) => {
                  const value = Number(event.target.value) || 24;
                  setBackupInterval(value);
                  backupEngine.configure({ enabled: autoBackupEnabled, intervalMs: value * 60 * 60 * 1000 });
                }}
                className="nx-input"
                style={{ marginLeft: '0.5rem', width: '80px' }}
              />
            </label>
          </div>
        </div>
      )}

      {activeSection === 'advanced' && (
        <div className="nx-settings-panel">
          <h2>🔧 Avancé</h2>
          <p className="nx-muted">Options pour les utilisateurs avancés.</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>
              <input
                type="checkbox"
                checked={developerMode}
                onChange={(e) => setDeveloperMode(e.target.checked)}
              />
              <span style={{ marginLeft: '0.5rem' }}>Mode développeur</span>
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>
              <input
                type="checkbox"
                checked={debugLogs}
                onChange={(e) => setDebugLogs(e.target.checked)}
              />
              <span style={{ marginLeft: '0.5rem' }}>Activer les logs de débogage</span>
            </label>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--nx-surface-2)', borderRadius: 'var(--nx-radius)' }}>
            <strong>Informations système</strong>
            <p className="nx-muted">Version : <strong>0.1.0</strong></p>
            <p className="nx-muted">Build : <strong>2024.06.05</strong></p>
            <p className="nx-muted">Environnement : <strong>Production</strong></p>
            <p className="nx-muted">Navigateur : <strong>{navigator.userAgent}</strong></p>
          </div>
        </div>
      )}
    </section>
  );
}
