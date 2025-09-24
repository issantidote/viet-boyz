import React from "react";
import "../styles/components.scss";
import Banner from "./Banner";

const UserRegister = () => {
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
                <label htmlFor="register-password" className="form-label">Password</label>
                <input type="password" id="register-password" className="form-input" />
            </div>

            <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                <input type="password" id="confirm-password" className="form-input" />
            </div>

            <button type="submit" className="form-button">Register</button>
            </form>
      </div>
    </div>
  );
};

export default UserRegister;