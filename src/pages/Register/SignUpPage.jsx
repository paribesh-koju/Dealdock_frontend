import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import { FaUser, FaLock, FaEnvelope, FaEyeSlash, FaEye } from "react-icons/fa";
import "./SignUpPage.css";
import { registerUser } from "../../apis/Api"; // Backend API function

const SignUpPage = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate password length
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await registerUser({
        fullname,
        email,
        password,
        confirmPassword,
      });
      console.log("Register successful", response);
      toast.success("Registration successful! Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      // Handle successful registration (e.g., redirect to login)
    } catch (error) {
      console.error("Registration failed", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <Header />
      <div className="signup-container">
        <div className="logo-section">
          <img src="/assets/mono.png" alt="DealDock" className="logoo-large" />
        </div>
        <div className="signup-section">
          <h3>Make a Deal with DealDock</h3>
          <h2>Welcome to DealDock</h2>
          <h2>Sign Up</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-visibility"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <label>Confirm Password</label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="toggle-visibility"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="signup-submit">
              Sign Up
            </button>
          </form>
          <div className="signup-links">
            <p>
              Already have an account? <a href="/login">Log In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
