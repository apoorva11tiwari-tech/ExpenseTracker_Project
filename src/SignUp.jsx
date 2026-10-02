import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [income, setIncome] = useState("");
  const [currency, setCurrency] = useState("₹ INR");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle Signup Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    setLoading(true);

    try {
      // 1. Create account in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Add Display Name to user profile
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }

      // 3. Save initial income preference
      if (income) {
        localStorage.setItem("userIncome", income);
        localStorage.setItem("userCurrency", currency);
      }

      navigate("/app/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  // Google Signup
  const handleGoogleSignup = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/app/dashboard");
    } catch (err) {
      setError("Failed to sign up with Google.");
    }
  };

  return (
    <div className="signup-page">
      {/* Background animated blobs */}
      <div className="signup-blob signup-blob-one"></div>
      <div className="signup-blob signup-blob-two"></div>
      <div className="signup-blob signup-blob-three"></div>

      {/* Main container */}
      <div className="container signup-container">
        {/* ================= HEADER ================= */}
        <div className="text-center signup-header">
          <Link to="/" className="signup-brand">
            <div className="signup-logo">💳</div>
            <h2 className="signup-brand-name">CashMate</h2>
          </Link>

          <div className="trust-badge">🔐 End-to-End Encrypted</div>

          <h1 className="signup-title">Create your account ✨</h1>
          <p className="signup-subtitle">
            Start tracking expenses securely, for free
          </p>
        </div>

        {/* ================= SIGNUP CARD ================= */}
        <div className="signup-card">
          {error && <div className="alert alert-danger mb-3 py-2 small text-center">{error}</div>}

          {/* Google Signup */}
          <button className="google-button" type="button" onClick={handleGoogleSignup}>
            <svg viewBox="0 0 24 24" className="google-icon">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="signup-divider">
            <span></span>
            <p>or with email</p>
            <span></span>
          </div>

          {/* ================= FORM ================= */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="signup-label">Full Name</label>
              <input
                type="text"
                className="signup-input"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="signup-label">Email</label>
              <input
                type="email"
                className="signup-input"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="signup-label">Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="signup-input password-input"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="signup-label">Confirm Password</label>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="signup-input password-input"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Income + Currency */}
            <div className="row g-3 mb-3">
              {/* Monthly Income */}
              <div className="col-md-6">
                <label className="signup-label">Monthly Income</label>
                <input
                  type="number"
                  className="signup-input"
                  placeholder="0000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>

              {/* Currency */}
              <div className="col-md-6">
                <label className="signup-label">Currency</label>
                <select
                  className="signup-input"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option>₹ INR</option>
                  <option>$ USD</option>
                  <option>€ EUR</option>
                </select>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account 🎉"}
            </button>
          </form>

          {/* Login link */}
          <p className="login-link-text">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}