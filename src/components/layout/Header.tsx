import { Download, HelpCircle, Moon, Palette, Sun } from 'lucide-react';
import type { ThemeMode } from '../../features/yield-calc/types';
import { themeLabels } from '../../features/theme/themes';

interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onExport: () => void;
}

const themeIcons: Record<ThemeMode, JSX.Element> = {
  light: <Sun size={15} />,
  dark: <Moon size={15} />,
  blueGray: <Palette size={15} />
};

export function Header({ theme, onThemeChange, onExport }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <h1 className="app-title">PCB Panel Yield Visualizer</h1>
        <div className="app-subtitle">패널 배열 수량, 수율, 잔여 공간 실시간 분석</div>
      </div>
      <div className="header-actions">
        <div className="segmented" role="group" aria-label="화면모드">
          {(['light', 'dark', 'blueGray'] as ThemeMode[]).map((item) => (
            <button
              key={item}
              className={`button ${theme === item ? 'active' : ''}`}
              onClick={() => onThemeChange(item)}
              title={`${themeLabels[item]} theme`}
            >
              {themeIcons[item]}
              {themeLabels[item]}
            </button>
          ))}
        </div>
        <button className="icon-button" title="도움말">
          <HelpCircle size={17} />
        </button>
        <button className="button primary" onClick={onExport}>
          <Download size={16} />
          PNG 저장
        </button>
      </div>
    </header>
  );
}
