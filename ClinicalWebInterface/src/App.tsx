import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NewUser from "./pages/users/NewUser";
import "./App.css";
import logo from "./logo.svg";

/**
 * Main application component with theme switching and routes.
 */
// PUBLIC_INTERFACE
const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header" style={{ paddingBottom: 24 }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <img src={logo} className="App-logo" alt="logo" />
          <nav className="navbar" style={{ margin: "1rem 0" }}>
            <Link to="/" className="App-link">Home</Link> |{" "}
            <Link to="/users/new" className="App-link">New User</Link>
          </nav>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ padding: "2rem" }}>
                <h2>Welcome to Clinical Web Interface</h2>
                <p>Edit <code>src/App.tsx</code> and save to reload.</p>
                <p>
                  Try the <Link to="/users/new">User Form</Link>!
                </p>
              </div>
            }
          />
          <Route path="/users/new" element={<NewUser />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
