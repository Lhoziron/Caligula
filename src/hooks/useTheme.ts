import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  const { isDark } = useThemeStore();
  return { isDark };
}