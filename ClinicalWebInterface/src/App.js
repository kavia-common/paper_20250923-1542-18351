import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [showLogin, setShowLogin] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      {showLogin ? (
        <Login />
      ) : (
        <header className="App-header">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>
            Current theme: <strong>{theme}</strong>
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>

          <button
            className="btn"
            style={{ marginTop: 24, padding: '10px 16px', borderRadius: 8, border: 'none', background: 'var(--button-bg)', color: 'var(--button-text)', cursor: 'pointer' }}
            onClick={() => setShowLogin(true)}
            aria-label="Open login page"
          >
            Go to Login
          </button>
        </header>
      )}
    </div>
  );
}

export default App;
