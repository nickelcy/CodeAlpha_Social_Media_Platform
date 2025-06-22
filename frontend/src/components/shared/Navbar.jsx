import { FaUserCircle } from "react-icons/fa";
import { RiLoginCircleLine, RiLogoutCircleLine } from "react-icons/ri";
import { SiPicsart } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../../App";
import axios from "axios";
const server = import.meta.env.VITE_SERVER

const Navbar = (props) => {
  const navigate = useNavigate();
  const { loginStatus, setLoginStatus } = useContext(LoginContext);

  return (
    <nav className="navbar navbar-dark bg-dark px-3 py-3">
      <div className="container d-flex justify-content-between">
        <a className="navbar-brand m-0 h1 d-flex gap-1" href="/">
          <SiPicsart className="text-primary" />
          PicShare
        </a>
        <div className="d-flex justify-content-between align-items-center">
          <FaUserCircle
            onClick={() => {
              navigate("/profile");
            }}
            className="text-white fs-4 me-3"
            style={{ cursor: "pointer" }}
          />
          {loginStatus ? (
            <>
              <div
                className="d-flex"
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  try {
                    const res = await axios.post(
                      `${server}/logout`,
                      {},
                      { withCredentials: true }
                    );
                    alert(res.data.message);
                    setLoginStatus(false);
                  } catch (error) {
                    console.error(error);
                    alert("Error logging out!");
                  }
                }}
              >
                <RiLogoutCircleLine className="text-danger fs-4" />
                <b className="text-danger m-0 ps-1 d-none d-md-inline">
                  Logout
                </b>
              </div>
            </>
          ) : (
            <>
              <div
                className="d-flex"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                <RiLoginCircleLine className="text-white fs-4" />
                <b className="text-light m-0 ps-1 d-none d-md-inline">Login</b>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
