import { useState } from "react";
import "./Register.css";

function Register({ onGoToLogin, onRegisterSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    fieldId: "",
    contact: "",
    dob: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  /* ---------------- Computed replacements ---------------- */
  const welcomeTitle =
    form.role === "student" ? "Welcome New Student!" : "Warden Registration";

  const welcomeText =
    form.role === "student"
      ? "Join our hostel community and enjoy seamless management."
      : "Register as warden to manage hostel operations.";

  const passwordStrengthClass =
    passwordStrength <= 2
      ? "weak"
      : passwordStrength === 3
      ? "medium"
      : "strong";

  const passwordStrengthText =
    passwordStrength <= 2
      ? "Weak password"
      : passwordStrength === 3
      ? "Medium strength"
      : "Strong password";

  /* ---------------- Helpers ---------------- */
  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/\d/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^[0-9]{10}$/;

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      valid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Valid email is required";
      valid = false;
    }

    if (!form.fieldId.trim()) {
      newErrors.fieldId = "Field ID is required";
      valid = false;
    }

    if (!form.contact.trim()) {
      newErrors.contact = "Contact number is required";
      valid = false;
    } else if (!contactRegex.test(form.contact.trim())) {
      newErrors.contact = "Valid 10-digit number required";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  /* ---------------- Submit ---------------- */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          fieldId: form.fieldId.trim(),
          contact: form.contact.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          role: form.role,
          dob: form.dob,
          address: form.address?.trim() || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          fieldId: form.fieldId.trim(),
          contact: form.contact.trim(),
          role: form.role,
          dob: form.dob,
          address: form.address?.trim() || "",
          room: "Not Assigned",
        })
      );

      onRegisterSuccess && onRegisterSuccess(form.role);
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="side-panel">
          <h2>{welcomeTitle}</h2>
          <p>{welcomeText}</p>
          <button
            className="btn transparent"
            onClick={() => onGoToLogin && onGoToLogin()}
          >
            Sign In
          </button>
        </div>

        <div className="form-container">
          <h2 className="title">Sign Up</h2>

          <div className="role-selection">
            <button
              type="button"
              className={form.role === "student" ? "active" : ""}
              onClick={() => updateForm("role", "student")}
            >
              User
            </button>
            <button
              type="button"
              className={form.role === "warden" ? "active" : ""}
              onClick={() => updateForm("role", "warden")}
            >
              Hospital
            </button>
          </div>

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => updateForm("fullName", e.target.value)}
                className={errors.fullName ? "input-error" : ""}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Field ID */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Field ID"
                value={form.fieldId}
                onChange={(e) => updateForm("fieldId", e.target.value)}
                className={errors.fieldId ? "input-error" : ""}
              />
              {errors.fieldId && (
                <span className="error-message">{errors.fieldId}</span>
              )}
            </div>

            {/* Contact */}
            <div className="input-group">
              <input
                type="tel"
                placeholder="Contact Number"
                value={form.contact}
                onChange={(e) => updateForm("contact", e.target.value)}
                className={errors.contact ? "input-error" : ""}
              />
              {errors.contact && (
                <span className="error-message">{errors.contact}</span>
              )}
            </div>

            {/* DOB */}
            <div className="input-group">
              <input
                type="date"
                value={form.dob}
                onChange={(e) => updateForm("dob", e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="input-group">
              <textarea
                placeholder="Address"
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="input-group password-container">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => {
                  updateForm("password", e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}

              {form.password && (
                <div className="password-strength">
                  <div
                    className={`strength-bar ${passwordStrengthClass}`}
                  ></div>
                  <span>{passwordStrengthText}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="input-group password-container">
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => updateForm("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
