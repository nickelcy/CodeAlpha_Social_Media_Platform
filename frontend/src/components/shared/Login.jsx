import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
const server = import.meta.env.VITE_SERVER;
import { LoginContext } from "../../App";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({});
  const { loginStatus, setLoginStatus } = useContext(LoginContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loginStatus) {
      navigate("/");
    }
  }, [loginStatus]);

  useEffect(() => {
    setData({ username, password });
  }, [username, password]);

  const handleSubmit = async (e) => {
    if (loading) return;
    setLoading(true)
    e.preventDefault();
    try {
      const result = await axios.post(`${server}/login`, data, {
        withCredentials: true,
      });
      setLoading(false)
      alert(result.data.message);
      setLoginStatus(true);
      navigate("/");
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
      console.error(error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center overflow-hidden bg-dark"
      style={{ width: "100vw", height: "100vh" }}
    >
      <button
        className="btn btn-secondary position-absolute top-0 start-0 mx-2 my-3 overflow-y-auto opacity w-100"
        onClick={() => navigate(`/`)}
        style={{ maxWidth: "125px" }}
      >
        ← Go back
      </button>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="col-10 col-sm-4 text-bg-secondary text-center pb-4 px-0 rounded"
        style={{ transform: "translateY(-10%)", maxWidth: "500px" }}
      >
        <h2 className="mt-4 mb-4">User Login</h2>

        <div className="form-floating mb-2 w-75 m-auto">
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            type="text"
            name="username"
            id="username"
            value={username}
            placeholder="Username"
            required
          />
          <label htmlFor="username">Username</label>
        </div>

        <div className="form-floating mb-4 w-75 m-auto">
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="Password"
            required
          />
          <label htmlFor="password">Password</label>
        </div>

        <button type="submit" className="btn btn-success w-75" disabled={loading}>
          Sign in
        </button>

        <p className="mt-4 mx-4">
          Don't have an account?{" "}
          <span
            className="text-warning"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register", { replace: true })}
          >
            Click here.
          </span>
        </p>
      </form>
    </div>
  );
};
export default Login;
