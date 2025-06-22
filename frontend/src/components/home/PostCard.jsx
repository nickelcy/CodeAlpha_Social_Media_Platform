import { FaUserCircle } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useState } from "react";
import "./home.css";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../App";
import { useNavigate } from "react-router";
import { UserContext } from "../../App";
import axios from "axios";
const server = import.meta.env.VITE_SERVER;

const PostCard = ({ username, image, liked, likes, caption, pid }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [likesCount, setLikesCount] = useState(likes);
  const { loginStatus } = useContext(LoginContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const like = async () => {
    try {
      const result = await axios.patch(
        `${server}/like`,
        { pid },
        { withCredentials: true }
      );
      console.log(result);
    } catch (error) {
      console.error(error);
      alert(error.response.data.message || "There was an error.");
    }
  };
  const unlike = async () => {
    try {
      const result = await axios.patch(
        `${server}/unlike`,
        { pid },
        { withCredentials: true }
      );
      console.log(result);
    } catch (error) {
      console.error(error);
      console.log(error)
      alert(error.response.data.message || "There was an error.");
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center">
      <div
        className="text-bg-dark mx-2 mt-2 w-100 d-flex flex-column p-4"
        style={{ maxWidth: "500px" }}
      >
        <div className="container-fluid d-flex flex-row align-items-center mb-4">
          <FaUserCircle className="text-white fs-4 me-3" />
          <b>{username || "user"}</b>
        </div>
        <div
          className="container bg-secondary w-100 p-0 overflow-hidden"
          // style={{ maxHeight: "50%" }}
        >
          <img
            src={
              image ||
              "https://res.cloudinary.com/dssflbzdi/image/upload/v1748353453/placeholder_a6gfd6.jpg"
            }
            alt="username post"
            height="100%"
            width="100%"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              minHeight: "50vh",
            }}
          />
        </div>

        {loginStatus ? (
          <>
            <div
              className="container-fluid  d-flex flex-row align-items-center mt-3"
              onClick={() => {
                if (isLiked) {
                  setLikesCount((prev) => {
                    return prev - 1;
                  });
                  setIsLiked(false);
                  setUser((prev) => {
                    return {...prev, likes: prev.likes - 1}
                  })
                  unlike()
                } else if (!isLiked) {
                  setIsLiked(true);
                  setLikesCount((prev) => {
                    return prev + 1;
                  });
                  setUser((prev) => {
                    return { ...prev, likes: prev.likes + 1 };
                  });
                  like();
                }
              }}
            >
              <FaHeart
                style={{ cursor: "pointer" }}
                className={`fs-5 ${isLiked ? "text-danger" : "text-white"}`}
              />
              <b className="m-0 mx-2">{likesCount || 0}</b>
            </div>
          </>
        ) : (
          <>
            <div
              className="container-fluid  d-flex flex-row align-items-center mt-3"
              style={{ cursor: "pointer" }}
              onClick={() => {
                alert("Login to like this post!");
                navigate("/login");
              }}
            >
              <FaHeart className={`fs-5 text-white`} />
              <b className="m-0 mx-2">{likesCount || 0}</b>
            </div>
          </>
        )}

        <div
          className="container-fluid w-100 h-100 d-flex flex-row align-items-center mt-2"
          style={{ overflowY: "auto" }}
        >
          <p className="w-100 h-75">{caption || ""}</p>
        </div>
      </div>
    </div>
  );
};
export default PostCard;
