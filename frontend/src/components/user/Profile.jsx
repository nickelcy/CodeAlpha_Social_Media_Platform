import Navbar from "../shared/Navbar";
import ProfileCard from "./ProfileCard";
import { GrUploadOption } from "react-icons/gr";
import { useNavigate } from "react-router";
import { UserContext } from "../../App";


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
          <ul className="list-unstyled d-flex gap-4 align-items-center mx-3 p-0">
            <li className="text-dark">Manage</li>
            <li className="text-dark">View</li>
            <li className="text-dark">
              <GrUploadOption
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/upload")}
              />
            </li>
          </ul>

          <hr />
        </div>
      </div>
    </>
  );
};
export default Profile;
