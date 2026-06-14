"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type ThemePreference = "system" | "light" | "dark";

const THEME_STORAGE_KEY = "netatlas-theme";

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: "light" | "dark";
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeSnapshot = {
  preference: ThemePreference;
  resolved: "light" | "dark";
};

/** Referência estável — React exige cache em getServerSnapshot. */
const SERVER_THEME_SNAPSHOT: ThemeSnapshot = {
  preference: "system",
  resolved: "dark",
};

let clientSnapshot: ThemeSnapshot = SERVER_THEME_SNAPSHOT;

const listeners = new Set<() => void>();

function emitThemeChange() {
  for (const listener of listeners) {
    listener();
  }
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredPreference(): ThemePreference {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
  return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
}

function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference === "system") return getSystemTheme();
  return preference;
}

function getThemeSnapshot(): ThemeSnapshot {
  const preference = readStoredPreference();
  const resolved = resolveTheme(preference);

  if (clientSnapshot.preference === preference && clientSnapshot.resolved === resolved) {
    return clientSnapshot;
  }

  clientSnapshot = { preference, resolved };
  return clientSnapshot;
}

function getServerThemeSnapshot(): ThemeSnapshot {
  return SERVER_THEME_SNAPSHOT;
}

function subscribeToTheme(onStoreChange: () => void) {
  listeners.add(onStoreChange);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMediaChange = () => onStoreChange();
  const onStorageChange = () => onStoreChange();

  media.addEventListener("change", onMediaChange);
  window.addEventListener("storage", onStorageChange);

  return () => {
    listeners.delete(onStoreChange);
    media.removeEventListener("change", onMediaChange);
    window.removeEventListener("storage", onStorageChange);
  };
}

function applyTheme(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preference, resolved } = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  const setPreference = useCallback((next: ThemePreference) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    emitThemeChange();
  }, []);

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
}
