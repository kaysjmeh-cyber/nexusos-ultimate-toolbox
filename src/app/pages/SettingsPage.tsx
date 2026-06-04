import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { backupEngine } from '@core/backup/backup-engine';
import { profileManager } from '@core/profiles/profile-manager';
import { moduleRegistry } from '@modules/registry';
import { themeRegistry } from '@themes/registry/theme-registry';
import type { UserProfile } from '@nexus-types/profile';

const SECTIONS = [
  { id: 'general', label: 'Général' },
  { id: 'profiles', label: 'Profils' },
  { id: 'themes', label: 'Thèmes' },
  { id: 'modules', label: 'Modules' },
  { id: 'backup', label: 'Sauvegarde' },
];

export function SettingsPage() {
  const { section } = useParams();
  const activeSection = section ?? 'general';
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(profileManager.getActiveProfileId());
  const [newProfileName, setNewProfileName] = useState('');
  const [snapshotMessage, setSnapshotMessage] = useState('');
  const [themeId, setThemeId] = useState(themeRegistry.getActive()?.id ?? '');
  const [modules, setModules] = useState(moduleRegistry.list());
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [backupInterval, setBackupInterval] = useState(24);

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

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>Paramètres</h1>
        <p className="nx-muted">Gérez les profils, le thème, les modules et les sauvegardes.</p>
      </div>

      <nav className="nx-settings-nav">
        {SECTIONS.map((item) => (
          <Link key={item.id} to={`/settings/${item.id}`} className="nx-nav-link">
            {item.label}
          </Link>
        ))}
      </nav>

      {activeSection === 'general' && (
        <div className="nx-settings-panel">
          <h2>Vue générale</h2>
          <p>Profil actif : <strong>{activeProfileId ?? 'aucun profil sélectionné'}</strong></p>
          <p>Thème actif : <strong>{themeRegistry.getActive()?.name ?? 'NexusOS Default'}</strong></p>
          <p>Modules enregistrés : <strong>{moduleRegistry.count()}</strong></p>
        </div>
      )}

      {activeSection === 'profiles' && (
        <div className="nx-settings-panel">
          <h2>Profils</h2>
          <p className="nx-muted">Créer et changer de profil utilisateur local.</p>
          <div>
            <input
              type="text"
              placeholder="Nom du profil"
              value={newProfileName}
              onChange={(event) => setNewProfileName(event.target.value)}
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
          <h2>Thèmes</h2>
          <p className="nx-muted">Changer le thème active de l’application.</p>
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
          <h2>Modules</h2>
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

      {activeSection === 'backup' && (
        <div className="nx-settings-panel">
          <h2>Sauvegarde</h2>
          <p className="nx-muted">Créer un snapshot de l’état local de NexusOS.</p>
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
              />
            </label>
          </div>
        </div>
      )}
    </section>
  );
}
