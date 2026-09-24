/** Best-effort BFF. Never throw — PWA stays usable offline / without keys. */

export {
  apiRequest as bffFetch,
  apiSilent as bffSilent,
  debounce,
  getDashboardSummary,
  postSos,
  postCheckIn,
  postTrajectory,
  postGameSession,
  postDemoCity,
} from './apiClient';
