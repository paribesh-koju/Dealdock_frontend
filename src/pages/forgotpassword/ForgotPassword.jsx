import React, { useState } from "react";
import { forgotPasswordApi, verifyOtpApi } from "../../apis/Api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//making the forgot password use state
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  //making the function to handle the password comming form the backend
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPasswordApi({ email });
      if (res.status === 200) {
        toast.success(res.data.message);
        setIsSent(true);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      //catch error form response
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error(error); // Log unexpected errors for debugging
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const data = { email, otp, password };
    try {
      const res = await verifyOtpApi(data);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#f0f2f5" }}
    >
      <div className="card p-4" style={{ width: "400px" }}>
        <h3 className="text-center">Forgot Password</h3>
        <form>
          <div className="form-group">
            <label htmlFor="email">
              Enter your email address and we'll send you a verification link to
              reset your password
            </label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              disabled={isSent}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {isSent && (
            <>
              <span className="text-success">
                OTP has been sent to {email}✅
              </span>
              <div className="form-group mt-2">
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  type="number"
                  className="form-control"
                  placeholder="Enter OTP"
                />
              </div>
              <div className="form-group mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control"
                  placeholder="Set New Password"
                />
              </div>
              <button
                onClick={handleVerify}
                className="btn btn-primary mt-2 w-100"
              >
                Verify OTP & Set Password
              </button>
            </>
          )}
          {!isSent && (
            <button
              onClick={handleForgotPassword}
              className="btn btn-dark w-100 mt-2"
            >
              Submit
            </button>
          )}
        </form>
        <a href="/login" className="d-block text-center mt-2">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
