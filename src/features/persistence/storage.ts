import { DEFAULT_CONFIG } from '../yield-calc/calculate';
import type { PanelConfig, ThemeMode } from '../yield-calc/types';

const CONFIG_KEY = 'pcb-yield:last-config';
const THEME_KEY = 'pcb-yield:theme';
const HISTORY_KEY = 'pcb-yield:history';
const PRESET_KEY = 'pcb-yield:presets';

export interface SavedRun {
  id: string;
  createdAt: string;
  config: PanelConfig;
  count: number;
  efficiency: number;
}

export interface SavedPreset {
  id: string;
  name: string;
  config: PanelConfig;
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadConfig(): PanelConfig {
  return { ...DEFAULT_CONFIG, ...safeParse<Partial<PanelConfig>>(localStorage.getItem(CONFIG_KEY), {}) };
}

export function saveConfig(config: PanelConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearConfig() {
  localStorage.removeItem(CONFIG_KEY);
}

export function loadTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'dark' || stored === 'blueGray' ? stored : 'light';
}

export function saveTheme(theme: ThemeMode) {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadHistory(): SavedRun[] {
  return safeParse<SavedRun[]>(localStorage.getItem(HISTORY_KEY), []);
}

export function saveHistory(history: SavedRun[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 8)));
}

export function loadPresets(): SavedPreset[] {
  return safeParse<SavedPreset[]>(localStorage.getItem(PRESET_KEY), []);
}

export function savePresets(presets: SavedPreset[]) {
  localStorage.setItem(PRESET_KEY, JSON.stringify(presets.slice(0, 10)));
}
