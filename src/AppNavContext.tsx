import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

export interface AppNavOptions {
  startVoice?: boolean;
  gameId?: string | null;
  serviceId?: string | null;
  initialQuery?: string;
}

export interface AppNavContextValue {
  openModule: (moduleId: string, options?: AppNavOptions) => void;
  serviceFocus: { serviceId?: string | null; ts: number } | null;
  aiIntent: { startVoice?: boolean; ts: number } | null;
  gameIntent: { gameId?: string | null; ts: number } | null;
  openEmergency: () => void;
  currentModuleId: string;
  openAssist: () => void;
  openMemoryQuiz: () => void;
  openGuide: () => void;
  setActiveGameId: Dispatch<SetStateAction<string | null>>;
  activeGameId: string | null;
}

export const AppNavContext = createContext<AppNavContextValue>({
  openModule: () => {},
  serviceFocus: null,
  aiIntent: null,
  gameIntent: null,
  openEmergency: () => {},
  currentModuleId: 'home',
  openAssist: () => {},
  openMemoryQuiz: () => {},
  openGuide: () => {},
  setActiveGameId: () => {},
  activeGameId: null,
});

export const useAppNav = () => useContext(AppNavContext);
