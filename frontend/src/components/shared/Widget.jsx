import { useState, useEffect } from "react";

const Widget = ({ setImageUrl }) => {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;

    script.onload = () => {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET,
        },
        (error, result) => {
          if (!error && result.event === "success") {
            setImageUrl(result.info.secure_url);
            setUrl(result.info.secure_url);
          }
        }
      );

      const btn = document.getElementById("upload-button");
      if (btn) {
        btn.addEventListener("click", () => widget.open());
      }
    };

    document.body.appendChild(script);

    return () => {
      const btn = document.getElementById("upload-button");
      if (btn) {
        btn.removeEventListener("click", () => widget.open());
      }
    };
  }, [setImageUrl]);

  return (
    <>
      <button id="upload-button" className="btn btn-primary mb-2" type="button">
        Upload Image
      </button>
      <div
        className={`${url == "" ? "d-none" : "d-flex"} mb-2 flex-wrap gap-2 `}
      >
        <img
          src={url || "https://res.cloudinary.com/dssflbzdi/image/upload/v1748353453/placeholder_a6gfd6.jpg"}
          alt={`upload`}
          style={{
            width: 100,
            height: 100,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </div>
    </>
  );
};


export default Widget;