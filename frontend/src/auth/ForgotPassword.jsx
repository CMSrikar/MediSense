import { useState, useRef } from "react";
import axios from "axios";
import "./ForgotPassword.css";

function ForgotPassword({ onClose }) {
  const [identifier, setIdentifier] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const otpRefs = useRef([]);

  const clearMessageAfterDelay = () => {
    setTimeout(() => setMessage(""), 5000);
  };

  const clearOtpMessageAfterDelay = () => {
    setTimeout(() => setOtpMessage(""), 5000);
  };

  const sendOtp = async () => {
    if (!identifier.trim()) {
      setMessage("❗ Please enter your phone number or email.");
      clearMessageAfterDelay();
      return;
    }

    try {
      await axios.post("/api/v1/auth/send-otp", { identifier });
      setMessage(`OTP sent to ${identifier}`);
    } catch (error) {
      setMessage(
        `❗ ${error.response?.data?.message || "Failed to send OTP"}`
      );
    }

    setOtpVerified(false);
    clearMessageAfterDelay();
  };

  const handleOtpInput = (index, e) => {
    const value = e.target.value;
    const updatedOtp = [...otpDigits];
    updatedOtp[index] = value;
    setOtpDigits(updatedOtp);

    if (value && index < otpDigits.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      const updatedOtp = [...otpDigits];
      updatedOtp[index - 1] = "";
      setOtpDigits(updatedOtp);
    }
  };

  const verifyOtp = async () => {
    const otp = otpDigits.map(d => d.trim()).join("");

    if (otp.length !== 6 || otpDigits.some(d => !d.trim())) {
      setOtpMessage("❗ Please enter complete 6-digit OTP.");
      clearOtpMessageAfterDelay();
      return;
    }

    try {
      await axios.post("/api/v1/auth/verify-otp", {
        identifier,
        otp,
      });
      setOtpVerified(true);
      setOtpMessage("OTP verified successfully!");
    } catch (error) {
      setOtpMessage(
        `❗ ${error.response?.data?.message || "Invalid OTP"}`
      );
    }

    clearOtpMessageAfterDelay();
  };

  const resetPassword = async () => {
    if (!otpVerified) {
      setMessage("❗ Please verify your OTP first.");
      clearMessageAfterDelay();
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage("❗ Please enter and confirm new password.");
      clearMessageAfterDelay();
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❗ Passwords do not match.");
      clearMessageAfterDelay();
      return;
    }

    try {
      const otp = otpDigits.join("");

      await axios.post("/api/v1/auth/reset-password", {
        identifier,
        otp,
        newPassword,
        confirmPassword,
      });

      setMessage("🎉 Password reset successful!");
      setIdentifier("");
      setOtpDigits(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      setOtpVerified(false);

      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setMessage(
        `❗ ${error.response?.data?.message || "Password reset failed"}`
      );
    }

    clearMessageAfterDelay();
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-container">
        <button className="close-button" onClick={onClose}>×</button>

        <h2 className="forgot-heading">Forgot Password</h2>

        <input
          type="text"
          placeholder="Phone number or email"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          className="input-field"
        />

        <button
          className={`action-button ${!identifier.trim() ? "disabled-button" : ""}`}
          onClick={sendOtp}
          disabled={!identifier.trim()}
        >
          Send OTP
        </button>

        <div className="otp-group">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={el => (otpRefs.current[index] = el)}
              type="text"
              maxLength="1"
              className="otp-input"
              value={digit}
              onChange={e => handleOtpInput(index, e)}
              onKeyDown={e => handleBackspace(index, e)}
            />
          ))}
        </div>

        <button className="action-button" onClick={verifyOtp}>
          Verify OTP
        </button>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="input-field"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="input-field"
        />

        <button className="action-button" onClick={resetPassword}>
          Reset Password
        </button>

        <p className="back-login" onClick={onClose}>
          ← Back to Login
        </p>

        {otpMessage && (
          <p className={`message ${otpMessage.startsWith("❗") ? "error-message" : "success-message"}`}>
            {otpMessage}
          </p>
        )}

        {message && (
          <p className={`message ${message.startsWith("❗") ? "error-message" : "success-message"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
