import { DevTools } from "../backend/types";

export {};

declare global {
  interface Window { __REACT_DEVTOOLS_GLOBAL_HOOK__: DevTools; }
}
