import React from "react";
import "../styles/components.scss";
import Banner from "./Banner";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="form-page">
      <Banner />
      <div className="form-card">
        <h1 className="form-title">Welcome Back...</h1>
        <form className="form-style">
            <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" className="form-input" />
            </div>

            <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" id="password" className="form-input" />
            </div>

            <div className="forgot-password">Forgot Password?</div>
            <button type="submit" className="form-button">Log in</button>
            </form>
        <div className="register-text">
          New User? <Link to="/user-register" className="register-link">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;