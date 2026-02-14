import React from "react";
import "./ImageGallery.css";

const images = [
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/160",
  "https://via.placeholder.com/170",
  "https://via.placeholder.com/180",
  "https://via.placeholder.com/190",
  "https://via.placeholder.com/200",
  "https://via.placeholder.com/210",
  "https://via.placeholder.com/220"
];

const ImageGallery = () => {
  return (
    <div className="image-grid">
      {images.map((src, index) => (
        <img key={index} src={src} alt={`Image ${index + 1}`} />
      ))}
    </div>
  );
};

export default ImageGallery;
