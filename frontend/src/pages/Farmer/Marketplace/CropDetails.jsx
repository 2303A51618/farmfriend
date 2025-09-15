// farmfriend/apps/frontend/src/pages/Farmer/Marketplace/CropDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CropDetails.css";
 // ✅ Import CSS
//farmfriend\apps\frontend\src\pages\CropDetails.css
function CropDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/farmers/products/${id}`
        );
        setCrop(res.data);
      } catch (err) {
        console.error("Error fetching crop:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!crop) return <p>❌ Crop not found</p>;

  return (
    <div className="crop-details-container">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Card */}
      <div className="crop-details-card">
        <h2>{crop.name}</h2>
        <p>{crop.description || "No description provided"}</p>

        {/* Image Gallery */}
        <div className="crop-image-gallery">
          {crop.images && crop.images.length > 0 ? (
            crop.images.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000${img}`}
                alt={`crop-${idx}`}
                className="crop-img"
              />
            ))
          ) : (
            <img
              src="/default-crop.jpg"
              alt="default"
              className="crop-img"
            />
          )}
        </div>

        {/* Crop Info */}
        <div className="crop-info">
          <p>
            <strong>Price:</strong> ₹{crop.price}
          </p>
          <p>
            <strong>Quantity:</strong> {crop.quantity} kg
          </p>
          <p>
            <strong>Quality:</strong> {crop.quality}
          </p>
          <p>
            <strong>Organic:</strong>{" "}
            {crop.organic ? (
              <span className="organic">🌱 Yes</span>
            ) : (
              <span className="non-organic">❌ No</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CropDetails;
