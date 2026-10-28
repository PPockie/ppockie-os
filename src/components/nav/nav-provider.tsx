"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { NAVBAR, NAV_POSITIONS, type NavPosition } from "@/constants/navbar";
import { STORAGE_KEY } from "@/constants/storage";

interface NavContextValue {
  position: NavPosition;
  setPosition: (next: NavPosition) => void;
}

const NavContext = createContext<NavContextValue | null>(null);

const CHANGE_EVENT = "nav-position-change";

const SEED_SCRIPT = `(function(){try{
var k=${JSON.stringify(STORAGE_KEY.nav)},d=${JSON.stringify(NAVBAR.position)};
var v=localStorage.getItem(k);
if(${JSON.stringify(NAV_POSITIONS)}.indexOf(v)===-1){v=d;localStorage.setItem(k,v);}
document.documentElement.dataset.nav=v;
}catch(e){}})();`;

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
};

const getSnapshot = (): NavPosition => {
  const stored = document.documentElement.dataset.nav;
  return NAV_POSITIONS.includes(stored as NavPosition)
    ? (stored as NavPosition)
    : NAVBAR.position;
};

const getServerSnapshot = (): NavPosition => NAVBAR.position;

const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const position = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setPosition = useCallback((next: NavPosition) => {
    document.documentElement.dataset.nav = next;
    try {
      localStorage.setItem(STORAGE_KEY.nav, next);
    } catch {
      // Private mode or a full quota — the attribute still drives this tab.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo(() => ({ position, setPosition }), [position, setPosition]);

  return (
    <NavContext.Provider value={value}>
      <script dangerouslySetInnerHTML={{ __html: SEED_SCRIPT }} />
      {children}
    </NavContext.Provider>
  );
};

export const useNavPosition = () => {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNavPosition must be used within <NavProvider>");
  return ctx;
};

export default NavProvider;
