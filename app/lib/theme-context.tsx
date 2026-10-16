'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  shades: Record<string, string>;
}

export const PRESET_COLORS: ColorPreset[] = [
  {
    id: 'indigo',
    name: 'Electric Indigo',
    primary: '#6366f1',
    shades: {
      '--brand-50': '#eef2ff',
      '--brand-100': '#e0e7ff',
      '--brand-200': '#c7d2fe',
      '--brand-300': '#a5b4fc',
      '--brand-400': '#818cf8',
      '--brand-500': '#6366f1',
      '--brand-600': '#4f46e5',
      '--brand-700': '#4338ca',
      '--brand-800': '#3730a3',
      '--brand-900': '#312e81',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    primary: '#10b981',
    shades: {
      '--brand-50': '#ecfdf5',
      '--brand-100': '#d1fae5',
      '--brand-200': '#a7f3d0',
      '--brand-300': '#6ee7b7',
      '--brand-400': '#34d399',
      '--brand-500': '#10b981',
      '--brand-600': '#059669',
      '--brand-700': '#047857',
      '--brand-800': '#065f46',
      '--brand-900': '#064e3b',
    },
  },
  {
    id: 'ocean',
    name: 'Azure Ocean',
    primary: '#0ea5e9',
    shades: {
      '--brand-50': '#f0f9ff',
      '--brand-100': '#e0f2fe',
      '--brand-200': '#bae6fd',
      '--brand-300': '#7dd3fc',
      '--brand-400': '#38bdf8',
      '--brand-500': '#0ea5e9',
      '--brand-600': '#0284c7',
      '--brand-700': '#0369a1',
      '--brand-800': '#075985',
      '--brand-900': '#0c4a6e',
    },
  },
  {
    id: 'purple',
    name: 'Royal Violet',
    primary: '#8b5cf6',
    shades: {
      '--brand-50': '#faf5ff',
      '--brand-100': '#f3e8ff',
      '--brand-200': '#e9d5ff',
      '--brand-300': '#d8b4fe',
      '--brand-400': '#c084fc',
      '--brand-500': '#8b5cf6',
      '--brand-600': '#7c3aed',
      '--brand-700': '#6d28d9',
      '--brand-800': '#5b21b6',
      '--brand-900': '#4c1d95',
    },
  },
  {
    id: 'rose',
    name: 'Rose Coral',
    primary: '#f43f5e',
    shades: {
      '--brand-50': '#fff1f2',
      '--brand-100': '#ffe4e6',
      '--brand-200': '#fecdd3',
      '--brand-300': '#fda4af',
      '--brand-400': '#fb7185',
      '--brand-500': '#f43f5e',
      '--brand-600': '#e11d48',
      '--brand-700': '#be123c',
      '--brand-800': '#9f1239',
      '--brand-900': '#881337',
    },
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    primary: '#f59e0b',
    shades: {
      '--brand-50': '#fffbeb',
      '--brand-100': '#fef3c7',
      '--brand-200': '#fde68a',
      '--brand-300': '#fcd34d',
      '--brand-400': '#fbbf24',
      '--brand-500': '#f59e0b',
      '--brand-600': '#d97706',
      '--brand-700': '#b45309',
      '--brand-800': '#92400e',
      '--brand-900': '#78350f',
    },
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    primary: '#06b6d4',
    shades: {
      '--brand-50': '#ecfeff',
      '--brand-100': '#cffafe',
      '--brand-200': '#a5f3fc',
      '--brand-300': '#67e8f9',
      '--brand-400': '#22d3ee',
      '--brand-500': '#06b6d4',
      '--brand-600': '#0891b2',
      '--brand-700': '#0e7490',
      '--brand-800': '#155e75',
      '--brand-900': '#164e63',
    },
  },
];

// Helper to convert hex to HSL and generate 10 palette steps
export function generateShadesFromHex(hex: string): Record<string, string> {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return PRESET_COLORS[0].shades;

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const hueDeg = Math.round(h * 360);
  const satPct = Math.round(s * 100);

  return {
    '--brand-50':  `hsl(${hueDeg}, ${Math.min(satPct, 85)}%, 96%)`,
    '--brand-100': `hsl(${hueDeg}, ${Math.min(satPct, 85)}%, 92%)`,
    '--brand-200': `hsl(${hueDeg}, ${Math.min(satPct, 85)}%, 84%)`,
    '--brand-300': `hsl(${hueDeg}, ${Math.min(satPct, 85)}%, 72%)`,
    '--brand-400': `hsl(${hueDeg}, ${satPct}%, 60%)`,
    '--brand-500': hex.startsWith('#') ? hex : `#${hex}`,
    '--brand-600': `hsl(${hueDeg}, ${satPct}%, 44%)`,
    '--brand-700': `hsl(${hueDeg}, ${satPct}%, 36%)`,
    '--brand-800': `hsl(${hueDeg}, ${satPct}%, 28%)`,
    '--brand-900': `hsl(${hueDeg}, ${satPct}%, 20%)`,
  };
}

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  themeColor: string;
  customHex: string;
  setThemeColor: (colorKey: string, customHex?: string) => void;
  resetTheme: () => void;
  applyUserTheme: (themeMode?: string, themeColor?: string) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  activePreset: ColorPreset | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [themeColor, setThemeColorState] = useState<string>('indigo');
  const [customHex, setCustomHexState] = useState<string>('#6366f1');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Apply colors to document.documentElement
  const applyTheme = (currentMode: ThemeMode, colorKey: string, hex?: string) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.setAttribute('data-theme', currentMode);
    root.setAttribute('data-color', colorKey);

    let shades: Record<string, string>;
    if (colorKey === 'custom' && hex) {
      shades = generateShadesFromHex(hex);
    } else {
      const preset = PRESET_COLORS.find((p) => p.id === colorKey) || PRESET_COLORS[0];
      shades = preset.shades;
    }

    Object.entries(shades).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });

    try {
      localStorage.setItem('cdash_theme_mode', currentMode);
      localStorage.setItem('cdash_theme_color', colorKey);
      if (hex) localStorage.setItem('cdash_custom_hex', hex);
      localStorage.setItem('cdash_shades', JSON.stringify(shades));
    } catch (e) {}
  };

  // Sync theme choices to database so user retains their theme anywhere they log in
  const syncPreferencesToServer = (newMode: ThemeMode, newColor: string, hex?: string) => {
    try {
      const sessionStr = sessionStorage.getItem('cdash_session');
      if (sessionStr) {
        const user = JSON.parse(sessionStr);
        if (user && user.id) {
          const finalColor = newColor === 'custom' && hex ? hex : newColor;
          user.themeMode = newMode;
          user.themeColor = finalColor;
          sessionStorage.setItem('cdash_session', JSON.stringify(user));

          // Save to server database asynchronously
          fetch(`/api/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              themeMode: newMode,
              themeColor: finalColor,
            }),
          }).catch(() => {});
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    setMounted(true);
    let savedMode: ThemeMode = 'light';
    let savedColor = 'indigo';
    let savedCustomHex = '#6366f1';

    try {
      // Check session user first if available
      const sessionStr = sessionStorage.getItem('cdash_session');
      if (sessionStr) {
        const user = JSON.parse(sessionStr);
        if (user?.themeMode === 'light' || user?.themeMode === 'dark') {
          savedMode = user.themeMode;
        }
        if (user?.themeColor) {
          if (user.themeColor.startsWith('#')) {
            savedColor = 'custom';
            savedCustomHex = user.themeColor;
          } else {
            savedColor = user.themeColor;
          }
        }
      } else {
        const localMode = localStorage.getItem('cdash_theme_mode') as ThemeMode | null;
        if (localMode === 'light' || localMode === 'dark') {
          savedMode = localMode;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          savedMode = 'dark';
        }

        const localColor = localStorage.getItem('cdash_theme_color');
        if (localColor) savedColor = localColor;

        const localHex = localStorage.getItem('cdash_custom_hex');
        if (localHex) savedCustomHex = localHex;
      }
    } catch (e) {}

    setModeState(savedMode);
    setThemeColorState(savedColor);
    setCustomHexState(savedCustomHex);
    applyTheme(savedMode, savedColor, savedCustomHex);
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    applyTheme(newMode, themeColor, customHex);
    syncPreferencesToServer(newMode, themeColor, customHex);
  };

  const toggleMode = () => {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(nextMode);
  };

  const setThemeColor = (colorKey: string, hex?: string) => {
    setThemeColorState(colorKey);
    if (hex) setCustomHexState(hex);
    applyTheme(mode, colorKey, hex || customHex);
    syncPreferencesToServer(mode, colorKey, hex || customHex);
  };

  const applyUserTheme = (newMode?: string, newColor?: string) => {
    const validMode: ThemeMode = newMode === 'dark' ? 'dark' : 'light';
    let validColor = newColor || 'indigo';
    let validHex = customHex;

    if (validColor.startsWith('#')) {
      validHex = validColor;
      validColor = 'custom';
    }

    // Do nothing if already applied to prevent unwanted re-renders
    if (validMode === mode && validColor === themeColor && (validColor !== 'custom' || validHex === customHex)) {
      return;
    }

    setModeState(validMode);
    setThemeColorState(validColor);
    if (validColor === 'custom') setCustomHexState(validHex);
    applyTheme(validMode, validColor, validHex);
  };

  const resetTheme = () => {
    setModeState('light');
    setThemeColorState('indigo');
    setCustomHexState('#6366f1');
    applyTheme('light', 'indigo', '#6366f1');
    syncPreferencesToServer('light', 'indigo', '#6366f1');
  };

  const activePreset = PRESET_COLORS.find((p) => p.id === themeColor) || null;

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        themeColor,
        customHex,
        setThemeColor,
        applyUserTheme,
        resetTheme,
        isThemeModalOpen,
        setIsThemeModalOpen,
        activePreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
