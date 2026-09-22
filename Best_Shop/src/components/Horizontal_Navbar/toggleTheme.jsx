import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const theme = createTheme({ palette: { mode: "light" } });

const lightModeProperties = {
  // Legacy (keep for other components that use these)
  "--background": "#f0f4f8",
  "--background-1": "#ffffff",
  "--button": "#178a84",
  "--text": "#0f172a",
  "--gray-text": "#475569",
  "--button-hover": "#138079",
  "--button-hover-1": "#e0f2f0",
  "--card-hover": "#f3f9f9",
  "--light-hover": "#c8dddf",
  "--menu-hover": "#21bdb5",
  "--card": "#ffffff",
  "--white": "#ffffff",
  // New design system tokens
  "--surface": "#ffffff",
  "--surface-2": "#f8fafc",
  "--border": "#e2e8f0",
  "--border-focus": "#178a84",
  "--text-muted": "#64748b",
  "--text-secondary": "#475569",
  "--accent": "#178a84",
  "--accent-light": "#e0f2f0",
  "--success": "#16a34a",
  "--success-light": "#dcfce7",
  "--danger": "#dc2626",
  "--danger-light": "#fee2e2",
  "--warning": "#d97706",
  "--shadow": "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)",
  "--shadow-lg": "0 4px 16px rgba(0,0,0,0.12)",
  "--radius": "10px",
};

const darkModeProperties = {
  // Legacy
  "--background": "#0f172a",
  "--background-1": "#1e293b",
  "--button": "#20a99f",
  "--text": "#e2e8f0",
  "--gray-text": "#94a3b8",
  "--button-hover": "#1a8f86",
  "--button-hover-1": "#1e3a38",
  "--card-hover": "#1e3a38",
  "--light-hover": "#1e3a38",
  "--menu-hover": "#20a99f",
  "--card": "#1e293b",
  "--white": "#ffffff",
  // New design system tokens
  "--surface": "#1e293b",
  "--surface-2": "#0f172a",
  "--border": "#334155",
  "--border-focus": "#20a99f",
  "--text-muted": "#64748b",
  "--text-secondary": "#94a3b8",
  "--accent": "#20a99f",
  "--accent-light": "#0f2f2e",
  "--success": "#22c55e",
  "--success-light": "#0f2a1a",
  "--danger": "#ef4444",
  "--danger-light": "#2a0f0f",
  "--warning": "#f59e0b",
  "--shadow": "0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.25)",
  "--shadow-lg": "0 4px 16px rgba(0,0,0,0.4)",
  "--radius": "10px",
};

const setCustomProperties = (mode) => {
  const root = document.documentElement;
  const props = mode === "dark" ? darkModeProperties : lightModeProperties;
  Object.entries(props).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 56,
  height: 30,
  padding: 6,
  "& .MuiSwitch-switchBase": {
    margin: 0,
    padding: 0,
    transform: "translateX(5px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(21px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="%23FFFFFF" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#334155",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "var(--button)",
    width: 30,
    height: 30,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="%23FFFFFF" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#94a3b8",
    borderRadius: 15,
  },
}));

export default function CustomizedSwitches() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const preferredTheme = localStorage.getItem("preferredTheme");
    if (preferredTheme) {
      setDarkMode(preferredTheme === "dark");
      setCustomProperties(preferredTheme);
    } else {
      setCustomProperties("light");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const mode = newMode ? "dark" : "light";
    setCustomProperties(mode);
    localStorage.setItem("preferredTheme", mode);
  };

  return (
    <ThemeProvider theme={theme}>
      <FormGroup>
        <FormControlLabel
          style={{ margin: 0 }}
          control={<MaterialUISwitch checked={darkMode} onChange={toggleDarkMode} />}
        />
      </FormGroup>
    </ThemeProvider>
  );
}