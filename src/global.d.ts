// src/global.d.ts
export {};

declare global {
  interface Window {
    startServers: () => void;
  }
}
