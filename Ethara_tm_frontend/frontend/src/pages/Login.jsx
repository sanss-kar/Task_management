import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

 try {
    // 🔐 Step 1: Login
    const res = await API.post("/auth/login/", formData);

    // ✅ Save tokens
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    // 🔥 Step 2: Fetch profile from backend
    const profile = await API.get("/auth/profile/");

    // ✅ Save real data (NOT hardcoded)
    localStorage.setItem("username", profile.data.username);
    localStorage.setItem("role", profile.data.role);

    // 🚀 Redirect
    navigate("/");

  } catch (err) {
    setError("Invalid username or password");
  }
};
  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="text-center mb-4">Login</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-primary w-100">Login</button>
              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <Link to="/signup">Signup</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
