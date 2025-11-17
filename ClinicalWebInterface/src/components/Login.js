import React, { useState } from 'react';
import '../App.css';

/**
 * PUBLIC_INTERFACE
 * A simple Login form component with controlled inputs and client-side required field validation.
 * Accessible labels are provided and inline error messages are rendered on submit if fields are empty.
 * No network requests are made; this is purely UI validation.
 */
function Login() {
  // Local state for controlled inputs and errors
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [touchedSubmit, setTouchedSubmit] = useState(false);

  const usernameError = touchedSubmit && username.trim() === '' ? 'Username is required' : '';
  const passwordError = touchedSubmit && password.trim() === '' ? 'Password is required' : '';

  const hasErrors = Boolean(usernameError || passwordError);

  const onSubmit = (e) => {
    e.preventDefault();
    setTouchedSubmit(true);

    // If there are no errors, in the future we could trigger a login request
    if (!hasErrors) {
      // Placeholder for future integration
      // eslint-disable-next-line no-console
      console.log('Login submitted', { username, password: '<hidden>' });
    }
  };

  return (
    <div className="login-wrapper" style={styles.wrapper}>
      <form onSubmit={onSubmit} noValidate style={styles.form} aria-labelledby="login-title">
        <h1 id="login-title" style={styles.title}>Login</h1>

        <div style={styles.fieldGroup}>
          <label htmlFor="username" style={styles.label}>Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-required="true"
            aria-invalid={usernameError ? 'true' : 'false'}
            aria-describedby={usernameError ? 'username-error' : undefined}
            style={{
              ...styles.input,
              borderColor: usernameError ? '#dc3545' : 'var(--border-color)',
            }}
          />
          {usernameError && (
            <div id="username-error" role="alert" style={styles.errorText}>
              {usernameError}
            </div>
          )}
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-invalid={passwordError ? 'true' : 'false'}
            aria-describedby={passwordError ? 'password-error' : undefined}
            style={{
              ...styles.input,
              borderColor: passwordError ? '#dc3545' : 'var(--border-color)',
            }}
          />
          {passwordError && (
            <div id="password-error" role="alert" style={styles.errorText}>
              {passwordError}
            </div>
          )}
        </div>

        <button type="submit" className="btn" style={styles.submitBtn} aria-label="Submit login form">
          Sign In
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-primary)',
    padding: '16px',
  },
  form: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
  },
  title: {
    margin: '0 0 16px',
    color: 'var(--text-primary)',
    fontSize: '24px',
    textAlign: 'left',
  },
  fieldGroup: {
    marginBottom: '16px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    outline: 'none',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: 700,
    fontSize: '14px',
  },
  errorText: {
    marginTop: '8px',
    color: '#dc3545',
    fontSize: '13px',
  },
};

export default Login;
