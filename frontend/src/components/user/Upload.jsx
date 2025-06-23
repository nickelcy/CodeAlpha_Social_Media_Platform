import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Widget from "../shared/Widget";
import Navbar from "../shared/Navbar";
import { UserContext } from "../../App";

const Upload = (props) => {
  const serverUrl = import.meta.env.VITE_SERVER;
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState("");
  const [uploadData, setUploadData] = useState({});
  const {user} = useContext(UserContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUploadData({
      caption: caption,
      image: media,
    });
  }, [caption, media]);

  const handleSubmit = async (e) => {
    if (loading) return
    setLoading(true)
    e.preventDefault();
    try {
      const res = await axios.post(`${serverUrl}/upload`, uploadData, {
        withCredentials: true,
      });
      setLoading(false)
      alert(res.data.message);
      navigate("/")
      Notification.requestPermission().then( perm => {
        if (perm === "granted") {
          new Notification(`${user.username} uploaded a new post!`)
        }
      })
    } catch (error) {
      console.error(error);
    }
  };

  const clear = () => {
    setCaption("");
    setMedia("");
  };

  const cancel = () => {
    clear();
    navigate("/");
  };

  return (
    <>
      <Navbar source={"upload"} />
      <div
        className="w-100 h-100 d-flex justify-content-center align-items-center "
        style={{ minWidth: "100%", minHeight: "70vh" }}
      >
        <form
          className="container m- mx-2 text-bg-dark px-4 py-3 overflow-y-auto rounded text-secondary"
          style={{ maxWidth: "500px", maxHeight: "100vh" }}
          onSubmit={(e) => handleSubmit(e)}
        >
          <h3 className="text-light">Create new post</h3>

          <div className="mb-2">
            <label htmlFor="description" className="form-label">
              Caption
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="1"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add image caption."
              required
            />
          </div>

          <Widget setImageUrl={setMedia} />

          <div className="w-100 mt-2 d-flex flex-row justify-content-between">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={() => clear()}
              disabled={media.length !== 0}
            >
              Clear
            </button>
            <div>
              <button
                type="button"
                className="btn btn-danger me-2"
                onClick={() => cancel()}
                disabled={media.length !== 0}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={media.length === 0 || loading === true}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default Upload;
