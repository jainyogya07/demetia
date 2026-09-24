/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_API_ORIGIN?: string;
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css';

declare module 'ogl';

interface Window {
  webkitAudioContext?: typeof AudioContext;
}

interface WindowEventMap {
  'sarthi:routine-control': CustomEvent<{ itemId?: string }>;
  'ss-notifications-updated': CustomEvent<{ key?: string }>;
  'ss-live': Event;
}
