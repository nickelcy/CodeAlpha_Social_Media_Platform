import { useContext, useEffect } from "react";
import { LoginContext } from "../../App";
import { Outlet, useNavigate } from "react-router-dom";

const Private = () => {
  const navigate = useNavigate();
  const { loginStatus } = useContext(LoginContext);

  useEffect(() => {
    if (loginStatus === false) {
      navigate("/login");
    }
  }, [loginStatus]);

  if (loginStatus === true) {
    return <Outlet />;
  }

  return null; 
};

export default Private;
