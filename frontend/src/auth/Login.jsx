import { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import "./Login.css";

function Login({ onLoginSuccess, onGoToRegister, onGoToForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [role, setRole] = useState("Student");
  const [showForgotModal, setShowForgotModal] = useState(false);

  const welcomeTitle =
    role === "Student" ? "Welcome, Friend!" : "Welcome, Warden!";

  const welcomeText =
    role === "Student"
      ? "Continue your journey with Hostel Buddy."
      : "Manage your hostel with ease and control.";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      const user = data.data.user;

      localStorage.setItem("token", data.token);
      localStorage.setItem("userProfile", JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));

      onLoginSuccess && onLoginSuccess(user.role);
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message || "User not found. Please sign up first.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-box">
          <h2 className="title">Sign In</h2>

          <div className="role-selection">
            <button
              className={role === "Student" ? "active" : ""}
              onClick={() => setRole("Student")}
            >
              User
            </button>
            <button
              className={role === "Warden" ? "active" : ""}
              onClick={() => setRole("Warden")}
            >
              Hospital
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <a onClick={() => onGoToForgot && onGoToForgot()}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn">
              Sign In
            </button>
          </form>
        </div>

        <div className="welcome-box">
          <h3>{welcomeTitle}</h3>
          <p>{welcomeText}</p>
          <button
            className="btn transparent"
            onClick={() => onGoToRegister && onGoToRegister()}
          >
            Sign Up
          </button>
        </div>
      </div>

      {showForgotModal && (
        <div className="modal-overlay modal-fade">
          <ForgotPassword onClose={() => setShowForgotModal(false)} />
        </div>
      )}
    </div>
  );
}

export default Login;
