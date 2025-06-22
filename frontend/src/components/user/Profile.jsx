import Navbar from "../shared/Navbar";
import ProfileCard from "./components/ProfileCard";
import { GrUploadOption } from "react-icons/gr";
import { useNavigate } from "react-router";
import { UserContext } from "../../App";
import Gallery from "./Gallery";

const Profile = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div
        style={{ width: "100%", height: "100%" }}
        className="-text-bg-secondary p-0 mt-2 d-flex flex-column justify-content-start align-items-center"
      >
        <div className="-bg-dark w-100 p-2" style={{ maxWidth: "500px" }}>
          <ProfileCard />
          <hr />
          <div className="d-flex gap-4 align-items-center mx-3 p-0">
            <button
              className="btn btn-outline-success d-flex flex-row align-items-center gap-2"
              onClick={() => navigate("/upload")}
            >
              Upload <GrUploadOption style={{ cursor: "pointer" }} />
            </button>
          </div>
          <hr />
          <Gallery />
        </div>
      </div>
    </>
  );
};
export default Profile;
