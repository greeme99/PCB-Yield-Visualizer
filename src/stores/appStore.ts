import { create } from 'zustand';
import { calculateYield, DEFAULT_CONFIG, presetToPanel } from '../features/yield-calc/calculate';
import type { PanelConfig, PlacementMode, ThemeMode } from '../features/yield-calc/types';
import {
  clearConfig,
  loadConfig,
  loadHistory,
  loadPresets,
  loadTheme,
  saveConfig,
  saveHistory,
  savePresets,
  saveTheme,
  type SavedPreset,
  type SavedRun
} from '../features/persistence/storage';

interface AppState {
  config: PanelConfig;
  theme: ThemeMode;
  placementMode: PlacementMode;
  zoom: number;
  mousePoint: { x: number; y: number };
  history: SavedRun[];
  presets: SavedPreset[];
  setConfig: (patch: Partial<PanelConfig>) => void;
  setTheme: (theme: ThemeMode) => void;
  setPlacementMode: (mode: PlacementMode) => void;
  setZoom: (zoom: number) => void;
  setMousePoint: (point: { x: number; y: number }) => void;
  resetConfig: () => void;
  addHistory: () => void;
  savePreset: (name: string) => void;
  applyConfig: (config: PanelConfig) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  config: typeof localStorage === 'undefined' ? DEFAULT_CONFIG : loadConfig(),
  theme: typeof localStorage === 'undefined' ? 'light' : loadTheme(),
  placementMode: 'auto',
  zoom: 1,
  mousePoint: { x: 0, y: 0 },
  history: typeof localStorage === 'undefined' ? [] : loadHistory(),
  presets: typeof localStorage === 'undefined' ? [] : loadPresets(),
  setConfig: (patch) => set((state) => {
    const nextConfig = { ...state.config, ...patch };
    const panel = patch.panelPreset ? presetToPanel(patch.panelPreset) : null;
    const withPreset = panel ? { ...nextConfig, ...panel } : nextConfig;
    saveConfig(withPreset);
    return { config: withPreset };
  }),
  setTheme: (theme) => {
    saveTheme(theme);
    set({ theme });
  },
  setPlacementMode: (placementMode) => set({ placementMode }),
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(3, zoom)) }),
  setMousePoint: (mousePoint) => set({ mousePoint }),
  resetConfig: () => {
    clearConfig();
    saveConfig(DEFAULT_CONFIG);
    set({ config: DEFAULT_CONFIG, zoom: 1 });
  },
  addHistory: () => {
    const { config, history } = get();
    const result = calculateYield(config);
    const next = [{
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      config,
      count: result.fit.count,
      efficiency: result.efficiency
    }, ...history].slice(0, 8);
    saveHistory(next);
    set({ history: next });
  },
  savePreset: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const next = [{ id: crypto.randomUUID(), name: trimmed, config: get().config }, ...get().presets].slice(0, 10);
    savePresets(next);
    set({ presets: next });
  },
  applyConfig: (config) => {
    saveConfig(config);
    set({ config });
  }
}));
