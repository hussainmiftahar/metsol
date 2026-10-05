import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.error || "Login failed.");
        return;
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("studentPortalUser", email);
  
      if (onLogin) {
        onLogin({
          email,
          name: data.user?.name || "Student",
          role: data.user?.role || "STUDENT",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          🎓
        </div>

        <h1>Smart University</h1>
        <p className="login-subtitle">
          Student Portal
        </p>

        <form onSubmit={handleSubmit}>

          <div className="login-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your university email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() => alert("Password recovery will be added later.")}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>

        </form>

        <div className="login-footer">
          <p>
            Smart University Student Portal
          </p>
          <span>
            Secure • Modern • Connected
          </span>
        </div>

      </div>
    </div>
  );
}