import React, { useState } from "react";
import { apiFetch, saveAuthToken } from "./api.js";

export default function Login({ onLogin, message = "" }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();
    if (isRegistering && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (isRegistering && password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    if (isRegistering && password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch(isRegistering ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isRegistering ? { name: name.trim() } : {}),
          email: normalizedEmail,
          password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an unreadable response.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Check your email and password.");
      }
      if (!data.token || !data.user) {
        throw new Error("The server returned an invalid login response.");
      }

      saveAuthToken(data.token, rememberMe);
      onLogin(data.user);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Unable to reach the server. Check that the backend is running and your API URL is configured."
          : requestError.message || `Unable to ${isRegistering ? "create your account" : "sign in"}. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🎓</div>
        <h1>Smart University</h1>
        <p className="login-subtitle">{isRegistering ? "Create your student account" : "Student Portal"}</p>

        {message && <p className="login-message" role="status">{message}</p>}
        {error && <p className="login-error" role="alert">{error}</p>}
        {!isRegistering && (
          <p className="login-message">
            First time here? Enter any valid email and a password with at least 8 characters. Your student account will be created automatically.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="login-field">
              <label htmlFor="login-name">Full Name</label>
              <input
                id="login-name"
                type="text"
                autoComplete="name"
                maxLength={100}
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your university email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete={isRegistering ? "new-password" : "current-password"}
              minLength={isRegistering ? 8 : undefined}
              maxLength={1024}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {isRegistering && (
            <div className="login-field">
              <label htmlFor="login-confirm-password">Confirm Password</label>
              <input
                id="login-confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={1024}
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
          )}

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>

            {!isRegistering && (
              <button
                type="button"
                className="forgot-password"
                onClick={() => setError("Password recovery is not configured yet. Contact your administrator.")}
              >
                Forgot Password?
              </button>
            )}
          </div>

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? (isRegistering ? "Creating account..." : "Signing in...") : (isRegistering ? "Create Account" : "Sign In")}
          </button>
        </form>

        <p className="login-switch">
          {isRegistering ? "Already have an account?" : "New to the portal?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
          >
            {isRegistering ? "Sign in" : "Create an account"}
          </button>
        </p>

        <div className="login-footer">
          <p>Smart University Student Portal</p>
          <span>Secure · Modern · Connected</span>
        </div>
      </div>
    </div>
  );
}