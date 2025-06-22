import GalleryCard from "./components/GalleryCard";
const server = import.meta.env.VITE_SERVER;
import { useEffect, useState } from "react";
import axios from "axios";

const Gallery = () => {
  const [myPosts, setMyPosts] = useState([]);

  const getMyPosts = () => {
    axios
      .get(`${server}/my-posts`, { withCredentials: true })
      .then((response) => {
        setMyPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getMyPosts()
  }, []);

  return (
    <div
      className="container d-flex flex-row flex-wrap gap-1 justify-content-center align-items-start"
      style={{ maxWidth: "500px" }}
    >
      {myPosts.length > 0 ? (
        myPosts.map((post, i) => <GalleryCard key={i} post={post} getPosts={getMyPosts}/>)
      ) : (
        <b>No Posts</b>
      )}
    </div>
  );
};

export default Gallery;
