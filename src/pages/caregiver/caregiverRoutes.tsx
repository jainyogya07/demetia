import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';

const pages = () => import('./CaregiverPages');

const CgOverview = lazy(() => pages().then((m) => ({ default: m.CgOverview })));
const CgRoutine = lazy(() => pages().then((m) => ({ default: m.CgRoutine })));
const CgSafety = lazy(() => pages().then((m) => ({ default: m.CgSafety })));
const CgProgress = lazy(() => pages().then((m) => ({ default: m.CgProgress })));
const CgCircle = lazy(() => pages().then((m) => ({ default: m.CgCircle })));
const CgDocuments = lazy(() => pages().then((m) => ({ default: m.CgDocuments })));
const CgCalendar = lazy(() => pages().then((m) => ({ default: m.CgCalendar })));
const CgProfile = lazy(() => pages().then((m) => ({ default: m.CgProfile })));
const CgSettings = lazy(() => pages().then((m) => ({ default: m.CgSettings })));
const CaregiverAssessment = lazy(() => import('./CaregiverAssessment'));
const CaregiverMemorySetup = lazy(() => import('./CaregiverMemorySetup'));
const TrainAiPage = lazy(() => import('./TrainAiPage'));
const SpatialPresence = lazy(() => import('./SpatialPresence'));
const SpatialConfig = lazy(() => import('./SpatialConfig'));
const SchemesPage = lazy(() => import('../Schemes'));
const NotificationsPage = lazy(() => import('../NotificationsPage'));

function Pane({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="os-page cg-route-fallback">Opening this board…</div>}>
      {children}
    </Suspense>
  );
}

/** Single source of truth: sidebar `to` and React Router `path` stay aligned. */
export const CAREGIVER_PAGE_ROUTES: { path: string; to: string; element: ReactNode }[] = [
  { path: '', to: '/caregiver', element: <Pane><CgOverview /></Pane> },
  { path: 'routine', to: '/caregiver/routine', element: <Pane><CgRoutine /></Pane> },
  { path: 'calendar', to: '/caregiver/calendar', element: <Pane><CgCalendar /></Pane> },
  { path: 'safety', to: '/caregiver/safety', element: <Pane><CgSafety /></Pane> },
  { path: 'progress', to: '/caregiver/progress', element: <Pane><CgProgress /></Pane> },
  { path: 'assessment', to: '/caregiver/assessment', element: <Pane><CaregiverAssessment /></Pane> },
  { path: 'circle', to: '/caregiver/circle', element: <Pane><CgCircle /></Pane> },
  { path: 'memory-journey', to: '/caregiver/memory-journey', element: <Pane><CaregiverMemorySetup /></Pane> },
  { path: 'train-ai', to: '/caregiver/train-ai', element: <Pane><TrainAiPage /></Pane> },
  { path: 'documents', to: '/caregiver/documents', element: <Pane><CgDocuments /></Pane> },
  { path: 'schemes', to: '/caregiver/schemes', element: <Pane><SchemesPage /></Pane> },
  { path: 'profile', to: '/caregiver/profile', element: <Pane><CgProfile /></Pane> },
  { path: 'settings', to: '/caregiver/settings', element: <Pane><CgSettings /></Pane> },
  { path: 'notifications', to: '/caregiver/notifications', element: <Pane><NotificationsPage /></Pane> },
  { path: 'spatial-presence', to: '/caregiver/spatial-presence', element: <Pane><SpatialPresence /></Pane> },
  { path: 'spatial-config', to: '/caregiver/spatial-config', element: <Pane><SpatialConfig /></Pane> },
];

export function caregiverChildRoutes() {
  return CAREGIVER_PAGE_ROUTES.map((route) =>
    route.path === '' ? (
      <Route key="index" index element={route.element} />
    ) : (
      <Route key={route.path} path={route.path} element={route.element} />
    ),
  );
}

export function caregiverNavIsActive(pathname: string, to: string, end?: boolean) {
  if (end || to === '/caregiver') return pathname === '/caregiver';
  return pathname === to;
}
