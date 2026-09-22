import { createContext, useContext } from 'react';

export const AppNavContext = createContext({
  openModule: () => {},
  serviceFocus: null,
  aiIntent: null,
  gameIntent: null,
  openEmergency: () => {},
});

export const useAppNav = () => useContext(AppNavContext);
