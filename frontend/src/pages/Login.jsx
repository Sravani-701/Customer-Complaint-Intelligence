
import { Link } from "react-router-dom";

function Login() {
  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h1>Welcome Back</h1>
      <p>Login to your Complaint Intelligence account.</p>

      <form>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          required
          style={{ display: "block", width: "100%", padding: "12px", margin: "10px 0 20px" }}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          required
          style={{ display: "block", width: "100%", padding: "12px", margin: "10px 0 20px" }}
        />

        <button type="submit" style={{ padding: "12px 24px" }}>
          Login
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>

      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default Login;
