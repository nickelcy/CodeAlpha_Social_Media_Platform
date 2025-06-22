import { FaUserCircle } from "react-icons/fa";
import { UserContext } from "../../App";
import { useContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
const server = import.meta.env.VITE_SERVER;

const ProfileCard = () => {
  const { setUser } = useContext(UserContext);
  const [info, setInfo ] = useState({})

  useEffect(() => {
    axios
      .get(`${server}/user`, { withCredentials: true })
      .then((response) => {
        if (response.status == 200) {
          setUser(response.data[0]);
          setInfo(response.data[0]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  console.log(info)

  return (
    <div className="w-100 h-100 d-flex flex-row">
      <FaUserCircle size={50} className="my-auto mx-3" />
      <div className="d-flex flex-column">
        <b className="m-0 p-0">{info?.username || "username"}</b>
        <div className="d-flex flex-row gap-4">

        <p className="m-0 p-0">
          {info?.total_likes || "0"} {info?.total_likes == "1" ? "like" : "likes"}
        </p>
        <p className="m-0 p-0">
          {info?.post_count || "0"} {info?.post_count == "1" ? "post" : "posts"}
        </p>
        </div>
      </div>
    </div>
  );
};
export default ProfileCard;
