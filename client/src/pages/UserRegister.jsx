import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as authApi from "../services/authApi";
import "../styles/components.scss";
import Banner from "./Banner";

const UserRegister = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const requirements = [
    {
      label: "At least 8 characters",
      test: (pw) => pw.length >= 8,
    },
    {
      label: "At least 1 digit",
      test: (pw) => /\d/.test(pw),
    },
    {
      label: "At least 1 special character (except <, >, &, \\, \", ', (, ), [, ], {, }, ;)",
      test: (pw) =>
        /[!@#$%^*_\-+=:,.?/|~`]/.test(pw),
    },
    {
      label: "Passwords match",
      test: (pw) => pw.length > 0 && pw === confirmPassword,
    },
  ];

  const forbiddenChars = /[<>&"'()\[\]{};\\]/;

  const getStatusIcon = (isValid) =>
    isValid ? (
      <span style={{ color: "green", marginRight: "8px" }}>✔</span>
    ) : (
      <span style={{ color: "red", marginRight: "8px" }}>✘</span>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (email !== confirmEmail) {
      setError("Emails do not match");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Check all password requirements
    const allRequirementsMet = requirements.every(req => req.test(password)) && !forbiddenChars.test(password);
    if (!allRequirementsMet) {
      setError("Please meet all password requirements");
      setLoading(false);
      return;
    }

    try {
      // Call real backend API to register
      const response = await authApi.register({ email, password });
      
      // response should contain { user, token }
      // Auto-login after registration
      login(response.user, response.token);

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="form-page">
      <Banner />
      <div className="form-card">
        <h1 className="form-title">New User Registration</h1>
        
        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <form className="form-style" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="register-email" className="form-label">Email</label>
                <input 
                  type="email" 
                  id="register-email" 
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirm-email" className="form-label">Confirm Email</label>
                <input 
                  type="email" 
                  id="confirm-email" 
                  className="form-input"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  disabled={loading}
                  required
                />
            </div>

            <div className="form-group">
              <label htmlFor="register-password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="register-password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* PASSWORD REQUIREMENTS */}
            <div className="password-requirements">
              {requirements.map((req, index) => {
                const valid = !forbiddenChars.test(password) && req.test(password);
                return (
                  <div key={index} className="requirement-item">
                    <div className="requirement-icon">
                      {getStatusIcon(valid)}
                    </div>
                    <div className={`requirement-text ${valid ? "valid" : "invalid"}`}>
                      {req.label}
                    </div>
                  </div>
                );
              })}

              {forbiddenChars.test(password) && (
                <div className="requirement-item">
                  <div className="requirement-icon">✘</div>
                  <div className="requirement-text invalid">
                    Contains forbidden character(s): &lt;, &gt;, &, \, ", ', (, ), [, ], {`{ }`}, ;
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              className="form-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
        </form>
        
        <div className="register-text" style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login" className="register-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;