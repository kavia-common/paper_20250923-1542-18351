import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

/**
 * Resolve the API base URL from env vars.
 * Prefers REACT_APP_API_BASE if present, otherwise falls back to REACT_APP_BACKEND_URL.
 */
function getApiBaseUrl(): string {
  const apiBase = process.env.REACT_APP_API_BASE;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  return (apiBase || backendUrl || "").replace(/\/+$/, "");
}

type FieldErrors = {
  identifier?: string;
  password?: string;
  form?: string;
};

/**
 * PUBLIC_INTERFACE
 * Login form that authenticates against backend /auth/login endpoint.
 */
export default function Login(): React.ReactElement {
  const navigate = useNavigate();

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!identifier.trim()) next.identifier = "Username or email is required.";
    if (!password) next.password = "Password is required.";
    return next;
  };

  const parseServerError = async (resp: Response): Promise<string> => {
    // Attempt to parse a useful message from the server.
    try {
      const data = await resp.json();
      if (typeof data?.message === "string" && data.message.trim()) return data.message;
      if (typeof data?.error === "string" && data.error.trim()) return data.error;
      if (typeof data?.detail === "string" && data.detail.trim()) return data.detail;
    } catch {
      // ignore JSON parsing errors
    }
    return `Login failed (${resp.status})`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setServerError(null);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (nextErrors.identifier || nextErrors.password) return;

    if (!apiBaseUrl) {
      setServerError(
        "Backend URL is not configured. Please set REACT_APP_API_BASE or REACT_APP_BACKEND_URL."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Keep payload flexible: many backends accept either username/email in a single field.
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      if (!resp.ok) {
        const msg = await parseServerError(resp);
        setServerError(msg);
        return;
      }

      // If backend returns a token, store it (optional, safe default).
      try {
        const data = await resp.json();
        if (data?.token) {
          localStorage.setItem("auth_token", String(data.token));
        }
      } catch {
        // If server doesn't return JSON, that's okay; proceed with navigation.
      }

      navigate("/", { replace: true });
    } catch (err) {
      setServerError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <main className="App-header">
        <section className="auth-card" aria-label="Login">
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Use your credentials to access the clinical portal.</p>

          {serverError ? (
            <div className="auth-alert" role="alert" aria-live="assertive">
              {serverError}
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="identifier">
                Username or email
              </label>
              <input
                id="identifier"
                name="identifier"
                className="auth-input"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                aria-invalid={Boolean(errors.identifier)}
                aria-describedby={errors.identifier ? "identifier-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.identifier ? (
                <div id="identifier-error" className="auth-error" role="alert">
                  {errors.identifier}
                </div>
              ) : null}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                className="auth-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.password ? (
                <div id="password-error" className="auth-error" role="alert">
                  {errors.password}
                </div>
              ) : null}
            </div>

            <button className="auth-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>

            <p className="auth-footnote">
              Having trouble? Contact your administrator.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
