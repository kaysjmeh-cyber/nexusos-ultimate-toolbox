import { create } from 'zustand';
import type { UserProfile } from '@nexus-types/profile';

/** État UI profil actif — synchronisé avec ProfileManager */
interface ProfileState {
  profiles: UserProfile[];
  activeId: string | null;
  setProfiles: (p: UserProfile[]) => void;
  setActiveId: (id: string | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  activeId: null,
  setProfiles: (profiles) => set({ profiles }),
  setActiveId: (activeId) => set({ activeId }),
}));
