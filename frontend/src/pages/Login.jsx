import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password
    });

    localStorage.setItem("token", res.data.token);
    navigate("/users");
  };

  return (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="card shadow-lg" style={{ width: "420px" }}>
      <div className="card-body">
        <h3 className="text-center mb-4">Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid gap-2">
            <button className="btn btn-primary">Login</button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/register")}
            >
              New user? Register
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default Login;
