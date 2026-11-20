'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemeMode = 'light' | 'dark';

export interface GlassSettings {
  /** Backdrop blur radius in pixels (0 - 40) */
  blur: number;
  /** Surface opacity (0.15 - 0.96) */
  opacity: number;
  /** Backdrop color saturation percentage (100 - 220) */
  saturation: number;
  /** Emerald/warm tint strength (0 - 0.5) */
  tint: number;
  /** Specular edge highlight strength (0 - 1) */
  edge: number;
  /** Hex tint color (#rrggbb) */
  tintColor: string;
}

export const GLASS_LIMITS = {
  blur: { min: 0, max: 40, step: 1 },
  opacity: { min: 0.15, max: 0.96, step: 0.01 },
  saturation: { min: 100, max: 220, step: 5 },
  tint: { min: 0, max: 0.5, step: 0.01 },
  edge: { min: 0, max: 1, step: 0.02 },
} as const;

export const DEFAULT_BACKGROUND_IMAGE = '';

export const DEFAULT_GLASS: GlassSettings = {
  blur: 22,
  opacity: 0.44,
  saturation: 150,
  tint: 0.16,
  edge: 0.45,
  tintColor: '#10b981',
};

export type GlassPresetName = 'Clear' | 'Frosted' | 'Solid';

export const GLASS_PRESETS: Record<GlassPresetName, GlassSettings> = {
  Clear: {
    blur: 8,
    opacity: 0.18,
    saturation: 120,
    tint: 0.08,
    edge: 0.75,
    tintColor: '#10b981',
  },
  Frosted: {
    ...DEFAULT_GLASS,
  },
  Solid: {
    blur: 32,
    opacity: 0.86,
    saturation: 115,
    tint: 0.22,
    edge: 0.22,
    tintColor: '#10b981',
  },
};

export function getMatchingPreset(glass: GlassSettings): GlassPresetName | 'Custom' {
  for (const name of ['Clear', 'Frosted', 'Solid'] as const) {
    const preset = GLASS_PRESETS[name];
    if (
      Math.abs(glass.blur - preset.blur) < 0.5 &&
      Math.abs(glass.opacity - preset.opacity) < 0.02 &&
      Math.abs(glass.saturation - preset.saturation) < 2 &&
      Math.abs(glass.tint - preset.tint) < 0.015 &&
      Math.abs(glass.edge - preset.edge) < 0.015
    ) {
      return name;
    }
  }
  return 'Custom';
}

export interface GlassContextValue {
  glass: GlassSettings;
  updateGlass: (patch: Partial<GlassSettings>) => void;
  resetGlass: () => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  backgroundImage: string;
  setBackgroundImage: (bg: string) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const STORAGE_KEYS = {
  glass: 'mindmap-ai:glass-settings',
  theme: 'mindmap-ai:theme-mode',
  backgroundImage: 'mindmap-ai:background-image',
} as const;

const GlassContext = createContext<GlassContextValue | undefined>(undefined);

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeUnit(value: number): number {
  return value > 1 ? clamp(value / 100, 0, 1) : clamp(value, 0, 1);
}

function sanitizeHexColor(raw: unknown): string {
  if (typeof raw === 'string' && /^#[0-9a-f]{6}$/i.test(raw.trim())) {
    return raw.trim().toLowerCase();
  }
  return DEFAULT_GLASS.tintColor;
}

function hexToRgbString(hex: string): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return '16, 185, 129';
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

function sanitizeBackgroundUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('/')
  ) {
    return trimmed.replace(/["\\]/g, '');
  }
  return '';
}

function sanitizeGlass(raw: Partial<GlassSettings> | null | undefined): GlassSettings {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_GLASS;
  }
  return {
    blur:
      typeof raw.blur === 'number' && Number.isFinite(raw.blur)
        ? clamp(raw.blur, GLASS_LIMITS.blur.min, GLASS_LIMITS.blur.max)
        : DEFAULT_GLASS.blur,
    opacity:
      typeof raw.opacity === 'number' && Number.isFinite(raw.opacity)
        ? clamp(normalizeUnit(raw.opacity), GLASS_LIMITS.opacity.min, GLASS_LIMITS.opacity.max)
        : DEFAULT_GLASS.opacity,
    saturation:
      typeof raw.saturation === 'number' && Number.isFinite(raw.saturation)
        ? clamp(raw.saturation, GLASS_LIMITS.saturation.min, GLASS_LIMITS.saturation.max)
        : DEFAULT_GLASS.saturation,
    tint:
      typeof raw.tint === 'number' && Number.isFinite(raw.tint)
        ? clamp(normalizeUnit(raw.tint), GLASS_LIMITS.tint.min, GLASS_LIMITS.tint.max)
        : DEFAULT_GLASS.tint,
    edge:
      typeof raw.edge === 'number' && Number.isFinite(raw.edge)
        ? clamp(normalizeUnit(raw.edge), GLASS_LIMITS.edge.min, GLASS_LIMITS.edge.max)
        : DEFAULT_GLASS.edge,
    tintColor: sanitizeHexColor(raw.tintColor),
  };
}

function applyGlassToDocument(glass: GlassSettings, theme: ThemeMode, backgroundImage: string) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');

  root.style.setProperty('--gw-blur', `${glass.blur}px`);
  root.style.setProperty('--gw-glass-opacity', `${normalizeUnit(glass.opacity)}`);
  root.style.setProperty('--gw-saturation', `${glass.saturation}%`);
  root.style.setProperty('--gw-tint', `${normalizeUnit(glass.tint)}`);
  root.style.setProperty('--gw-tint-rgb', hexToRgbString(glass.tintColor));
  root.style.setProperty('--gw-edge', `${normalizeUnit(glass.edge)}`);

  const safeBg = sanitizeBackgroundUrl(backgroundImage);
  if (safeBg) {
    root.style.setProperty('--gw-wallpaper', `url("${safeBg}")`);
  } else {
    root.style.removeProperty('--gw-wallpaper');
  }
}

export function GlassProvider({ children }: { children: React.ReactNode }) {
  const [glass, setGlass] = useState<GlassSettings>(DEFAULT_GLASS);
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [backgroundImage, setBackgroundImageState] = useState<string>(DEFAULT_BACKGROUND_IMAGE);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Hydrate persisted state from localStorage on mount (deferred to avoid sync setState in effect)
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const savedGlass = localStorage.getItem(STORAGE_KEYS.glass);
        if (savedGlass) {
          setGlass(sanitizeGlass(JSON.parse(savedGlass) as Partial<GlassSettings>));
        }

        const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        }

        const savedBg = localStorage.getItem(STORAGE_KEYS.backgroundImage);
        if (typeof savedBg === 'string') {
          setBackgroundImageState(savedBg);
        }
      } catch {
        // Ignore storage access/parse errors
      } finally {
        setHydrated(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync DOM attributes/CSS variables and persist changes
  useEffect(() => {
    applyGlassToDocument(glass, theme, backgroundImage);
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.glass, JSON.stringify(glass));
      localStorage.setItem(STORAGE_KEYS.theme, theme);
      localStorage.setItem(STORAGE_KEYS.backgroundImage, backgroundImage);
    } catch {
      // Ignore storage quota/access errors
    }
  }, [glass, theme, backgroundImage, hydrated]);

  const updateGlass = useCallback((patch: Partial<GlassSettings>) => {
    setGlass((prev) => sanitizeGlass({ ...prev, ...patch }));
  }, []);

  const resetGlass = useCallback(() => {
    setGlass(DEFAULT_GLASS);
  }, []);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setBackgroundImage = useCallback((bg: string) => {
    setBackgroundImageState(bg);
  }, []);

  const value = useMemo<GlassContextValue>(
    () => ({
      glass,
      updateGlass,
      resetGlass,
      theme,
      toggleTheme,
      setTheme,
      backgroundImage,
      setBackgroundImage,
      notificationsOpen,
      setNotificationsOpen,
      settingsOpen,
      setSettingsOpen,
    }),
    [
      glass,
      updateGlass,
      resetGlass,
      theme,
      toggleTheme,
      setTheme,
      backgroundImage,
      setBackgroundImage,
      notificationsOpen,
      settingsOpen,
    ]
  );

  return <GlassContext.Provider value={value}>{children}</GlassContext.Provider>;
}

export function useGlass(): GlassContextValue {
  const ctx = useContext(GlassContext);
  if (!ctx) {
    throw new Error('useGlass must be used within a GlassProvider');
  }
  return ctx;
}
