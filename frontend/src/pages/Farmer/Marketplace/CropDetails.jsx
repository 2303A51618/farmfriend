// farmfriend/apps/frontend/src/pages/Farmer/Marketplace/CropDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api";
import "./CropDetails.css";

function CropDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Safe API Base URL (remove `/api` so we can attach `/uploads/...`)
  //const apiBaseUrl =
   // process.env.REACT_APP_API_URL?.replace("/api", "") || "";

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        // 🔹 Try public crop API first
        let res = await API.get(`/crops/${id}`);
        setCrop(res.data);
      } catch (err) {
        try {
          // 🔹 If not found, fallback to farmer’s product API
          const token = localStorage.getItem("token");
          let res = await API.get(`/farmers/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCrop(res.data);
        } catch (error2) {
          console.error("Error fetching crop:", error2);
          setCrop(null);
        }
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
        {/* <div className="crop-image-gallery">
          {crop.images && crop.images.length > 0 ? (
            crop.images.map((img, idx) => (
              <img
                key={idx}
                src={
                  img.startsWith("http")
                    ? img
                    : `${apiBaseUrl}/uploads/${img.replace(
                        /^\/?uploads\//,
                        ""
                      )}`
                }
                alt={`crop-${idx}`}
                className="crop-img"
              />
            ))
          ) : (
            <img src="/default-crop.jpg" alt="default" className="crop-img" />
          )}
        </div> */}

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
