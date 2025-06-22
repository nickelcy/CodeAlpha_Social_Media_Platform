import { useState, useContext, createContext, useEffect, use } from "react";
import axios from "axios";
import Home from "./page/Home.jsx";
const server = import.meta.env.VITE_SERVER;
export const LoginContext = createContext();
import { Route, Routes } from "react-router";
import Login from "./components/shared/Login.jsx";
import Register from "./components/shared/Register.jsx";
import Profile from "./components/user/Profile.jsx";
import Private from "./components/user/Private.jsx";
import Upload from "./components/user/Upload.jsx";
export const UserContext = createContext();

function App() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get(`${server}/verify`, { withCredentials: true })
      .then((response) => {
        if (response.status == 200) {
          setUser(response.data.user);
          setLoginStatus(true);
        } else {
          setLoginStatus(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoginStatus(false);
      });
  }, []);

  return (
    <LoginContext.Provider value={{ loginStatus, setLoginStatus }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Private />}>
            <Route path="profile" element={<Profile />} />
            <Route path="upload" element={<Upload />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </LoginContext.Provider>
  );
}

export default App;
