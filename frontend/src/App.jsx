
import { useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  BrainCircuit,
  ShieldCheck,
  Zap,
  Bell,
  ArrowRight,
  ChartNoAxesCombined,
  FileText,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  Menu,
  X,
} from "lucide-react";
import { ClipboardList, RefreshCw } from "lucide-react";

import "./App.css";
import AdminDashboard from "./AdminDashboard";

// =========================
// HOME PAGE
// =========================

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="website">
      <header className="navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <ShieldCheck size={25} />
          </span>
          <span>Complaint Intelligence</span>
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
          >
            How It Works
          </a>
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link
            to="/register"
            className="nav-register"
            onClick={() => setMenuOpen(false)}
          >
            Register
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              <BrainCircuit size={16} />
              AI-POWERED CUSTOMER SUPPORT
            </span>

            <h1>
              Customer Complaint
              <span> Intelligence and </span>
              Automatic Classification
            </h1>

            <p>
              Submit your financial complaint and let artificial
              intelligence predict its product category automatically.
              Track your complaints and view their status in one place.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="primary-button">
                Get Started <ArrowRight size={18} />
              </Link>
              <a href="#features" className="secondary-button">
                Explore Features
              </a>
            </div>

            <div className="hero-note">
              <ShieldCheck size={18} />
              Secure account access · AI-powered classification
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-circle">
              <div className="ai-card">
                <BrainCircuit size={76} />
                <h3>AI Complaint Analysis</h3>
                <p>Intelligent classification</p>
                <div className="prediction-line">
                  <span>Prediction engine</span>
                  <strong>Ready</strong>
                </div>
              </div>

              <div className="floating-icon icon-one">
                <FileText size={25} />
              </div>
              <div className="floating-icon icon-two">
                <ChartNoAxesCombined size={25} />
              </div>
              <div className="floating-icon icon-three">
                <Bell size={25} />
              </div>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="eyebrow">OUR CAPABILITIES</span>
            <h2>Smarter Complaint Management</h2>
            <p>
              A unified platform to classify, submit, and track customer
              complaints.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon blue">
                <BrainCircuit size={26} />
              </div>
              <h3>AI Classification</h3>
              <p>
                Predict the product category of a complaint using a
                trained machine learning model.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon green">
                <ShieldCheck size={26} />
              </div>
              <h3>Secure Access</h3>
              <p>
                Separate user and administrator roles with protected
                account access.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon purple">
                <Zap size={26} />
              </div>
              <h3>Complaint Tracking</h3>
              <p>
                View submitted complaints and follow their resolution
                status.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon orange">
                <ChartNoAxesCombined size={26} />
              </div>
              <h3>Analytics and Reports</h3>
              <p>
                Review complaint trends, category statistics, and
                reporting insights.
              </p>
            </article>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">SIMPLE PROCESS</span>
            <h2>How It Works</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span>01</span>
              <h3>Create an Account</h3>
              <p>Register to access complaint services.</p>
            </div>
            <div className="step-card">
              <span>02</span>
              <h3>Submit a Complaint</h3>
              <p>Describe your issue in your own words.</p>
            </div>
            <div className="step-card">
              <span>03</span>
              <h3>Get AI Prediction</h3>
              <p>The model predicts the complaint product category.</p>
            </div>
            <div className="step-card">
              <span>04</span>
              <h3>Track Progress</h3>
              <p>Check your complaint and its status.</p>
            </div>
          </div>
        </section>

        <section className="cta-section" id="about">
          <h2>Make Complaint Management Smarter</h2>
          <p>
            Get started with AI-powered complaint classification and
            tracking.
          </p>
          <Link to="/register" className="primary-button">
            Create Your Account <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer className="footer">
        <strong>Complaint Intelligence</strong>
        <p>
          Customer Complaint Intelligence and Automatic Classification
          System
        </p>
        <span>
          AI-powered classification for smarter complaint management.
        </span>
      </footer>
    </div>
  );
}

// =========================
// LOGIN PAGE
// =========================

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(location.state?.role || "user");
  const [message, setMessage] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (role !== data.user.role) {
        throw new Error(
          `This account is registered as ${data.user.role}. Please select the correct account type.`
        );
      }

      localStorage.setItem("cci_token", data.token);
      localStorage.setItem("cci_user", JSON.stringify(data.user));

      navigate(
        data.user.role === "admin"
          ? "/admin-dashboard"
          : "/submit-complaint",
        { replace: true }
      );
    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Link to="/" className="auth-brand">
        <span className="brand-icon">
          <ShieldCheck size={25} />
        </span>
        Complaint Intelligence
      </Link>

      <div className="auth-card">
        <div className="auth-heading-icon">
          <LockKeyhole size={27} />
        </div>

        <h1>Welcome Back</h1>
        <p className="auth-subtitle">
          Sign in to access your complaint management account.
        </p>

        {message && (
          <div className="auth-message" role="status">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <label htmlFor="login-role">Account Type</label>
          <select
            id="login-role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="user">Customer / User</option>
            <option value="admin">Administrator</option>
          </select>

          <label htmlFor="login-email">Email Address</label>
          <div className="auth-input-wrap">
            <Mail size={19} />
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={19} />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <div className="auth-options">
            <label className="remember-option">
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-divider">
          <span>New to Complaint Intelligence?</span>
        </div>

        <Link to="/register" className="auth-secondary-button">
          <UserRound size={18} /> Create an Account
        </Link>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>

      <p className="auth-footer">
        Customer Complaint Intelligence and Automatic Classification System
      </p>
    </div>
  );
}

// =========================
// REGISTER PAGE
// =========================

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(location.state?.role || "user");
  const [setupKey, setSetupKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const isAdmin = role === "admin";

    if (isAdmin && !setupKey.trim()) {
      setMessage("Please enter the admin setup key.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isAdmin ? "admin-register" : "register";

      const response = await fetch(
        `http://localhost:5001/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isAdmin
              ? {
                  name: name.trim(),
                  email: email.trim(),
                  password,
                  setupKey: setupKey.trim(),
                }
              : {
                  name: name.trim(),
                  email: email.trim(),
                  password,
                }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      navigate("/login", {
        replace: true,
        state: {
          message: `${data.message || "Registration successful."} Please log in.`,
          email: email.trim(),
          role,
        },
      });
    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Link to="/" className="auth-brand">
        <span className="brand-icon">
          <ShieldCheck size={25} />
        </span>
        Complaint Intelligence
      </Link>

      <div className="auth-card">
        <div className="auth-heading-icon">
          <UserRound size={27} />
        </div>

        <h1>Create an Account</h1>
        <p className="auth-subtitle">
          Register to access AI-powered complaint management.
        </p>

        {message && (
          <div className="auth-message" role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <label htmlFor="register-role">Account Type</label>
          <select
            id="register-role"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setMessage("");
              setSetupKey("");
            }}
          >
            <option value="user">Customer / User</option>
            <option value="admin">Administrator</option>
          </select>

          <label htmlFor="register-name">Full Name</label>
          <div className="auth-input-wrap">
            <UserRound size={19} />
            <input
              id="register-name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <label htmlFor="register-email">Email Address</label>
          <div className="auth-input-wrap">
            <Mail size={19} />
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="register-password">Password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={19} />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <label htmlFor="confirm-password">Confirm Password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={19} />
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {role === "admin" && (
            <>
              <label htmlFor="admin-setup-key">Admin Setup Key</label>
              <div className="auth-input-wrap">
                <ShieldCheck size={19} />
                <input
                  id="admin-setup-key"
                  type="password"
                  placeholder="Enter authorized setup key"
                  autoComplete="off"
                  value={setupKey}
                  onChange={(event) => setSetupKey(event.target.value)}
                  required
                />
              </div>

              <p className="auth-subtitle">
                Admin registration is restricted to the authorized initial
                setup process.
              </p>
            </>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : isAdminLabel(role)}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <Link to="/login" className="auth-secondary-button">
          Sign In
        </Link>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>

      <p className="auth-footer">
        Customer Complaint Intelligence and Automatic Classification System
      </p>
    </div>
  );
}

function isAdminLabel(role) {
  return role === "admin" ? "Register Administrator" : "Create Account";
}

// =========================
// COMPLAINT SUBMISSION PAGE
// =========================

function SubmitComplaint() {
  const [complaintText, setComplaintText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult(null);
    setError("");

    if (complaintText.trim().length < 10) {
      setError("Please enter at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("cci_token");

      if (!token) {
        throw new Error("Please log in before submitting a complaint.");
      }

      const response = await fetch(
        "http://localhost:5001/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            complaint: complaintText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit complaint.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-page">
      <div className="complaint-card">
        <div className="complaint-icon">📄</div>
        <p className="complaint-eyebrow">CUSTOMER SUPPORT</p>
        <h1>Submit a Complaint</h1>
        <p className="complaint-description">
          Describe your issue clearly. Our AI model will analyze your
          complaint and predict its category.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="complaintText">Your Complaint</label>
          <textarea
            id="complaintText"
            value={complaintText}
            onChange={(event) => setComplaintText(event.target.value)}
            placeholder="Explain your problem here..."
            rows={7}
            maxLength={5000}
            required
          />

          <div className="complaint-counter">
            {complaintText.length}/5000 characters
          </div>

          {error && <p className="complaint-error">{error}</p>}

          <button
            type="submit"
            className="complaint-submit-btn"
            disabled={loading}
          >
            {loading ? "Analyzing Complaint..." : "Submit & Analyze"}
          </button>
        </form>
        <Link
           to="/my-complaints"
           className="back-home"
          >
          <ClipboardList size={18} />
            My Complaints
          </Link>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
        <Link
          to="/my-complaints"
          className="complaint-submit-btn"
          style={{
          display: "inline-flex",
          justifyContent: "center",
          textDecoration: "none",
          marginTop: "16px",
          }}
        >
          <ClipboardList size={18} />
            View My Complaints
        </Link>

        {result && (
          <div className="complaint-result">
            <h2>Analysis Result</h2>
            <p>
              <strong>Predicted Category:</strong>{" "}
              {result.complaint?.predictedProduct ||
                result.predictedProduct ||
                result.category ||
                result.prediction ||
                result.product ||
                "Prediction unavailable"}
            </p>

            <p>
              <strong>Confidence:</strong>{" "}
              {result.complaint?.confidence != null
                ? `${(
                    Number(result.complaint.confidence) * 100
                  ).toFixed(2)}%`
                : result.confidence != null
                  ? `${(Number(result.confidence) * 100).toFixed(2)}%`
                  : "Confidence unavailable"}
            </p>

            <p>
              {result.message ||
                "Your complaint was processed successfully."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadComplaints() {
    const token = localStorage.getItem("cci_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/complaints/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("cci_token");
        localStorage.removeItem("cci_user");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load complaints."
        );
      }

      setComplaints(data.complaints || []);
      setStatistics(
        data.statistics || {
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
        }
      );
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
   loadComplaints();
  }, []);
  function logout() {
    localStorage.removeItem("cci_token");
    localStorage.removeItem("cci_user");
    navigate("/login", { replace: true });
  }

  return (
    <div className="complaint-page">
      <div
        className="complaint-card"
        style={{ maxWidth: "1000px", width: "100%" }}
      >
        <div className="complaint-icon">
          <ClipboardList size={32} />
        </div>

        <h1>My Complaints</h1>
        <p className="complaint-description">
          View your submitted complaints and track their status.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            margin: "24px 0",
          }}
        >
          {[
            ["Total", statistics.total],
            ["Pending", statistics.pending],
            ["In Progress", statistics.inProgress],
            ["Resolved", statistics.resolved],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                flex: "1 1 130px",
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <p>{label}</p>
              <h2>{value}</h2>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="complaint-submit-btn"
          onClick={loadComplaints}
          disabled={loading}
        >
          <RefreshCw size={16} />{" "}
          {loading ? "Loading..." : "Refresh Complaints"}
        </button>

        {error && (
          <p className="complaint-error">{error}</p>
        )}

        {loading ? (
          <p>Loading your complaints...</p>
        ) : complaints.length === 0 && !error ? (
          <div style={{ padding: "24px 0" }}>
            <h3>No complaints submitted yet</h3>
            <p>Submit your first complaint to start tracking it.</p>
          </div>
        ) : (
          <div style={{ marginTop: "24px", overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "12px" }}>Complaint</th>
                  <th style={{ padding: "12px" }}>Category</th>
                  <th style={{ padding: "12px" }}>Status</th>
                  <th style={{ padding: "12px" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((item) => (
                  <tr key={item._id}>
                    <td
                      style={{
                        padding: "12px",
                        borderTop: "1px solid #e2e8f0",
                        minWidth: "220px",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.complaint}
                      <p style={{ fontSize: "12px", color: "#64748b" }}>
                        ID: {item._id}
                      </p>
                    </td>

                    <td
                      style={{
                        padding: "12px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      {item.predictedProduct}
                    </td>

                    <td
                      style={{
                        padding: "12px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: "8px",
                          background:
                            item.status === "Resolved"
                              ? "#dcfce7"
                              : item.status === "In Progress"
                                ? "#dbeafe"
                                : "#fef3c7",
                          color:
                            item.status === "Resolved"
                              ? "#166534"
                              : item.status === "In Progress"
                                ? "#1d4ed8"
                                : "#92400e",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "12px",
                        borderTop: "1px solid #e2e8f0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            className="complaint-submit-btn"
            onClick={() => navigate("/submit-complaint")}
          >
            Submit Another Complaint
          </button>

          <button
            type="button"
            className="auth-secondary-button"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>

          <button
            type="button"
            className="auth-secondary-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}


// =========================
// PLACEHOLDER PAGE
// =========================

function SimplePage({ title, description }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading-icon">
          <ShieldCheck size={27} />
        </div>
        <h1>{title}</h1>
        <p className="auth-subtitle">{description}</p>
        <Link to="/" className="auth-secondary-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// =========================
// MAIN APP AND ROUTES
// =========================

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
          path="/my-complaints"
          element={<MyComplaints />}
      />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/submit-complaint"
        element={<SubmitComplaint />}
      />

      <Route
        path="/forgot-password"
        element={
          <SimplePage
            title="Forgot Password?"
            description="Password recovery will be added in the next step."
          />
        }
      />

      <Route
        path="*"
        element={
          <SimplePage
            title="Page Not Found"
            description="The page you requested does not exist."
          />
        }
      />
    </Routes>
  );
}

export default App;
