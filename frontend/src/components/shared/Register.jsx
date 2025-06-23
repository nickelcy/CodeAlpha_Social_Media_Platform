import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER;
import { LoginContext } from "../../App";

const Register = (props) => {
  const navigate = useNavigate();
  const { loginStatus, setLoginStatus } = useContext(LoginContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploadData, setUploadData] = useState();
  const [error1, setError1] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loginStatus) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    setUploadData({ username, password });
  }, [username, password, confirmPassword]);

  const handleSubmit = async (e) => {
    if (loading) return;
    setLoading(true)
    e.preventDefault();
    if (error1) {
      alert("Please ensure passwords are matching.");
      return;
    }
    try {
      const res = await axios.post(`${serverUrl}/register`, uploadData, {
        withCredentials: true,
      });
      setLoading(false)
      alert("Account created. You are Logged In.");
      setLoginStatus(true);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert(error.response.data.message || "There was an error registering.");
    }
  };

  return (
    <div
      className="row m-0 d-flex justify-content-center align-items-center text-bg-dark"
      style={{ minHeight: "100vh" }}
    >
      <button
        className="btn btn-secondary position-absolute top-0 start-0 mx-2 my-3 overflow-y-auto opacity"
        onClick={() => navigate(`/`)}
        style={{ maxWidth: "125px" }}
      >
        ← Go back
      </button>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="col-10 col-sm-7 text-bg-secondary text-center pb-4 px-0 rounded overflow-y-auto"
        // style={{ maxWidth: "500px", maxHeight: "98vh" }}
        style={{ transform: "translateY(-10%)", maxWidth: "500px" }}
      >
        <h2 className="mt-4 mb-4">User Registration</h2>

        <div className="form-floating mb-2 w-75 m-auto">
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            type="text"
            name="username"
            id="username"
            value={username}
            placeholder="username"
            required
          />
          <label htmlFor="username">Username (try using firstname)</label>
        </div>
        <div className="form-floating mb-2 w-75 m-auto">
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="Password"
            minLength={8}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <p
          className={`mb-0 fw-bolder text-start w-75 mx-auto rounded-3 ${
            error1 ? "d-block" : "d-none"
          }`}
          style={{ color: "#A20000" }}
        >
          Password do not match.
        </p>
        <div className="form-floating mb-4 w-75 m-auto">
          <input
            onChange={(e) =>
              setConfirmPassword(() => {
                if (password !== "" && password !== e.target.value) {
                  setError1(true);
                } else setError1(false);
                return e.target.value;
              })
            }
            className="form-control"
            type="password"
            name="confirm"
            id="confirm"
            value={confirmPassword}
            placeholder="confirm"
            minLength={8}
            required
          />
          <label htmlFor="confirm">Confirm Password</label>
        </div>
        <button
          type="submit"
          className="btn btn-success w-75"
          disabled={loading}
        >
          Sign up
        </button>

        <p className="mt-4 mx-4">
          Already have an account?{" "}
          <span
            className="text-warning"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login", { replace: true })}
          >
            Click here.
          </span>
        </p>
      </form>
    </div>
  );
};
export default Register;
