import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ForgotPassword from "../forgotpassword/ForgotPassword";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./LoginPage.css";
import { loginUser } from "../../apis/Api"; // Backend API function

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email and password inputs
    if (!email || !password) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      // Call the loginUser function with email and password
      const response = await loginUser({ email, password });
      console.log("Login successful", response);

      // Store token and user data in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.userData)); // Assuming `user` is returned by the API

      toast.success("Login successful!");
      navigate("/home"); // Redirect to the dashboard after login
    } catch (error) {
      console.error("Login failed", error.response?.data || error);
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  const handleForgotPasswordClose = () => setShowForgotPassword(false);
  const handleForgotPasswordShow = () => setShowForgotPassword(true);
  return (
    <div className="login-page">
      <Header />
      <main className="login-content">
        <div className="logo-section">
          <img src="/assets/mono.png" alt="DealDock" className="logo-large" />
        </div>
        <div className="login-section">
          <h3>For Existing User</h3>
          <h2>Verify Details Below</h2>
          <form className="login-form" onSubmit={handleSubmit}>
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
            <button type="submit" className="login-submit">
              Log In
            </button>
          </form>
          <div className="login-links">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent the browser from navigating
                handleForgotPasswordShow(); // Open the Forgot Password modal
              }}
            >
              Forgot Password?
            </a>
            <p>
              Don’t have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        </div>
      </main>
      <Modal show={showForgotPassword} onHide={handleForgotPasswordClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ForgotPassword />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleForgotPasswordClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginPage;
