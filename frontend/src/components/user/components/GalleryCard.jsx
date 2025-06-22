import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";
const server = import.meta.env.VITE_SERVER

const GalleryCard = ({ post, getPosts }) => {
  return (
    <div
      className="text-bg-dark w-100 h-100 d-flex flex-column justify-content-between p-2"
      style={{ maxWidth: "150px", maxHeight: "200px", minHeight: "200px" }}
    >
      <div className="w-100 overflow-hidden" style={{ height: "150px" }}>
        <img
          src={post.image}
          alt="post"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      <div
        className="w-100 d-flex justify-content-between align-items-center px-2"
        style={{ height: "20%" }}
      >
        <span className="text-white">
          {post?.likes || "0"}{" "}
          {post?.likes == "1" ? "like" : "likes"}
        </span>

        <RiDeleteBin5Line
          className="text-danger"
          style={{ cursor: "pointer" }}
          onClick={async () => {
            try {
              const result = await axios.delete(`${server}/delete/${post.post}`, {withCredentials: true})
              getPosts()
              alert("You deleted post")
            } catch (error) {
              console.log(error)
              alert("Error deleting your post!")
            }
          }}
        />
      </div>
    </div>
  );
};

export default GalleryCard;
