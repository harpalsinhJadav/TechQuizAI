import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './colors';
import { horizontalScale, verticalScale, moderateScale } from '../utils/scaling';

interface ThemeContextProps {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  spacing: {
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  scaling: {
    horizontal: (size: number) => number;
    vertical: (size: number) => number;
    moderate: (size: number, factor?: number) => number;
  };
}

const spacing = {
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDark, setIsDark] = useState(deviceTheme === 'dark');

  useEffect(() => {
    setIsDark(deviceTheme === 'dark');
  }, [deviceTheme]);

  const toggleTheme = () => setIsDark(!isDark);

  const value: ThemeContextProps = {
    colors: isDark ? darkColors : lightColors,
    isDark,
    toggleTheme,
    spacing,
    scaling: {
      horizontal: horizontalScale,
      vertical: verticalScale,
      moderate: moderateScale,
    },
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
