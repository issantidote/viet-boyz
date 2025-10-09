import React, { useState } from "react";
import "../styles/components.scss";
import Banner from "./Banner";

const UserRegister = () => {
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
  
  return (
    <div className="form-page">
      <Banner />
      <div className="form-card">
        <h1 className="form-title">New User Registration</h1>
        <form className="form-style">
            <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" id="username" className="form-input" />
            </div>

            <div className="form-group">
                <label htmlFor="register-email" className="form-label">Email</label>
                <input type="email" id="register-email" className="form-input" />
            </div>

            <div className="form-group">
                <label htmlFor="confirm-email" className="form-label">Confirm Email</label>
                <input type="email" id="confirm-email" className="form-input" />
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
              />
            </div>

            <button type="submit" className="form-button">Register</button>
            </form>
      </div>
    </div>
  );
};

export default UserRegister;