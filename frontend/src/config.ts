// src/config.ts
const DEFAULT_API_BASE = 'http://localhost:3000'; // for local dev

export const API_BASE =
  import.meta.env.VITE_BACKEND_URL ?? DEFAULT_API_BASE;
