import { createContext, useContext, useEffect } from "react";
import { theme } from "../theme/theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;

    // Set Colors
    Object.keys(theme.colors).forEach((key) => {
      root.style.setProperty(`--color-${key}`, theme.colors[key]);
    });

    // Set Fonts
    Object.keys(theme.fonts).forEach((key) => {
      root.style.setProperty(`--font-${key}`, theme.fonts[key]);
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
