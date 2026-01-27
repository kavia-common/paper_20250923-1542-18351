import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";

/**
 * PUBLIC_INTERFACE
 * Main SPA entrypoint. Provides theme toggle and top-level routes.
 */
function App(): React.ReactElement {
  /** Main SPA entrypoint. Provides theme toggle and top-level routes. */
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <Routes>
          <Route path="/login" element={<Login />} />
          {/* For now, default route leads to login; replace with dashboards later */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
