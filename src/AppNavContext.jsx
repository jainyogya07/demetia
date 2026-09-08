import { createContext, useContext } from 'react';

export const AppNavContext = createContext({
  openModule: () => {},
  serviceFocus: null,
  aiIntent: null,
  gameIntent: null,
  openEmergency: () => {},
  currentModuleId: 'home',
  openAssist: () => {},
  openMemoryQuiz: () => {},
  setActiveGameId: () => {},
  activeGameId: null,
});

export const useAppNav = () => useContext(AppNavContext);
