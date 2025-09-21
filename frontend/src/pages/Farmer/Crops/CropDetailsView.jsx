import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api";
import "./CropDetailsView.css";

const CropDetailsView = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch crop + harvest status
  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await API.get(`/crops/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cropData =
          res.data?.crop || (Array.isArray(res.data) ? res.data[0] : res.data);
        setCrop(cropData);
      } catch (err) {
        console.error("❌ Error fetching crop:", err);
      }
    };

    const fetchHarvest = async () => {
      try {
        const res = await API.get("/harvest", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const harvestList = res.data?.crops || [];
        const found = harvestList.some(
          (c) => c.cropId._id === id || c.cropId === id
        );
        setIsAdded(found);
      } catch (err) {
        console.error("❌ Error fetching harvest:", err);
      }
    };

    fetchCrop();
    fetchHarvest();
  }, [id, token]);

  // ✅ Toggle Add/Remove Harvest
  const handleToggleHarvest = async () => {
    if (!crop) return;
    setLoading(true);

    try {
      if (isAdded) {
        // ❌ Remove from harvest (backend expects crop._id as param)
        await API.delete(`/harvest/${crop._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdded(false);
      } else {
        // ➕ Add to harvest
        await API.post(
          "/harvest",
          {
            cropId: crop._id,
            name: crop.name,
            category: crop.category,
            quality: crop.quality,
            price: crop.price,
            quantity: crop.quantity,
            image: `/cropimages/${crop.name.toLowerCase()}.jpeg`,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsAdded(true);
      }
    } catch (err) {
      console.error("❌ Error updating harvest:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!crop) return <p>Loading...</p>;

  return (
    <div className="crop-details-view">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="crop-header">
        <img
          src={`${process.env.PUBLIC_URL}/cropimages/${crop.name.toLowerCase()}.jpeg`}
          alt={crop.name}
          onError={(e) =>
            (e.target.src = `${process.env.PUBLIC_URL}/cropimages/default.jpeg`)
          }
        />
        <h2>{crop.name}</h2>
      </div>

      <div className="crop-info">
        <p>
          <b>Category:</b> {crop.category || "General"}
        </p>
        <p>
          <b>Quality:</b> {crop.quality || "Organic"}
        </p>
        <p>
          <b>Price:</b> ₹{crop.price}/kg
        </p>
        <p>
          <b>Quantity:</b> {crop.quantity} kg
        </p>
        <p>
          <b>Harvest Time:</b> {crop.harvestTime || "3-4 months"}
        </p>
        <p>
          <b>Expected Investment:</b> ₹{crop.investment || "20000"} /acre
        </p>
        <p>
          <b>Expected Profit:</b> ₹{crop.profit || "50000"} /acre
        </p>
      </div>

      <div className="crop-actions">
        <button
          onClick={handleToggleHarvest}
          disabled={loading}
          className="toggle-btn"
        >
          {loading
            ? "Processing..."
            : isAdded
            ? "❌ Remove from Harvest"
            : "➕ Add to Harvest"}
        </button>

        <button
          onClick={() => navigate("/farmer/harvest")}
          className="harvest-btn"
        >
          🌾 Go to Harvest List
        </button>
      </div>
    </div>
  );
};

export default CropDetailsView;
