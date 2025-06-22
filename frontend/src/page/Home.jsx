import Navbar from "../components/shared/Navbar";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../App";
import PostCard from "../components/home/PostCard";
const server = import.meta.env.VITE_SERVER;

const home = () => {
  const { loginStatus } = useContext(LoginContext);
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    axios
      .get(`${server}/auth/posts`, { withCredentials: true })
      .then((response) => {
        setPosts(response.data);
        console.log("Rendering personalized posts");

      })
      .catch((error) => {
        console.error(error);
        axios
          .get(`${server}/posts`, { withCredentials: true })
          .then((response) => {
            setPosts(response.data);
            console.log("Rendering public posts");
          })
          .catch((error) => {
            console.error(error);
          });
      });
  }, [loginStatus]);

  return (
    <div>
      <Navbar />
      {posts.map((post, index) => {
        return (
          <PostCard
            key={index}
            pid={post.post}
            username={post.username}
            image={post.image}
            liked={post.liked || false}
            likes={post.likes}
            caption={post.caption}
          />
        );
      })}
    </div>
  );
};
export default home;
