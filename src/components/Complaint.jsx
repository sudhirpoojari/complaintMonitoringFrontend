import React, { use } from 'react'
import { useEffect } from "react";
import { useState } from "react";

export default function Complaint() {

  const [categories, setCategories] = React.useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [gps, setGps] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper function to decode JWT and extract userId
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  
  const [formData, setFormData] = React.useState({
    category:"",
    latitude: "",
    longitude: "",
    state: "",
    district: "",
    taluk: "",
    gramPanchayat: "",
    image: null,
    remarks: ""
  });

  const handlechange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({...formData, [name]: files[0]});
    } else {
      setFormData({...formData, [name]: value});
    }
    setError("");
  }

  const handleCategoryChange = (e) => {
    setFormData({...formData, category: e.target.value});
    setError("");
  }

  const handleStateChange = async (e) => {
    const state = e.target.value;
    setFormData({...formData, state, district: "", taluk: "", gramPanchayat: ""});
    setDistricts([]);
    setTaluks([]);
    setGps([]);
    
    if (!state) return;
    
    try {
      const res = await fetch(`https://complaintmonitoringbackend.onrender.com/districts/${state}`);
      if (res.ok) {
        const data = await res.json();
        setDistricts(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setFormData({...formData, district, taluk: "", gramPanchayat: ""});
    setTaluks([]);
    setGps([]);
    
    if (!district || !formData.state) return;
    
    try {
      const res = await fetch(`https://complaintmonitoringbackend.onrender.com/taluks/${formData.state}/${district}`);
      if (res.ok) {
        const data = await res.json();
        setTaluks(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleTalukChange = async (e) => {
    const taluk = e.target.value;
    setFormData({...formData, taluk, gramPanchayat: ""});
    setGps([]);
    
    if (!taluk || !formData.state || !formData.district) return;
    
    try {
      const res = await fetch(`https://complaintmonitoringbackend.onrender.com/gp/${formData.state}/${formData.district}/${taluk}`);
      if (res.ok) {
        const data = await res.json();
        setGps(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleGPChange = (e) => {
    setFormData({...formData, gramPanchayat: e.target.value});
  }
  
  useEffect(() => {
    fetchcategory();
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch("https://complaintmonitoringbackend.onrender.com/states");
      if (response.ok) {
        const data = await response.json();
        setStates(data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchcategory = async () => {
    try {
      const response = await fetch("https://complaintmonitoringbackend.onrender.com/getcategory");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError("Error fetching categories: " + error.message);
    }
  };

  const getLocation = () => {
    setError("");
    setSuccess("");
    
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setSuccess("Location captured successfully");
        setError("");
      },
      (error) => {
        setError("Permission denied or unable to get location: " + error.message);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    if (!formData.latitude) {
      setError("Please capture location");
      return;
    }
    if (!formData.longitude) {
      setError("Please capture location");
      return;
    }
    if (!formData.image) {
      setError("Please upload an image");
      return;
    }
    if (!formData.taluk) {
      setError("Please select a taluk");
      return;
    }
    if (!formData.gramPanchayat) {
      setError("Please select a gram panchayat");
      return;
    }

    setLoading(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(formData.image);
      reader.onload = async () => {
        const base64Image = reader.result;
        
        try {
          const userId = getUserIdFromToken();
          if (!userId) {
            setError("User not authenticated. Please login again.");
            setLoading(false);
            return;
          }

          const response = await fetch("https://complaintmonitoringbackend.onrender.com/saveComplaint", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              category: formData.category,
              latitude: parseFloat(formData.latitude),
              longitude: parseFloat(formData.longitude),
              state: formData.state,
              district: formData.district,
              taluk: formData.taluk,
              gramPanchayat: formData.gramPanchayat,
              image: base64Image,
              remarks: formData.remarks,
              userId: userId
            })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to save complaint");
          }

          setSuccess("Complaint saved successfully!");
          setFormData({
            category: "",
            latitude: "",
            longitude: "",
            state: "",
            district: "",
            taluk: "",
            gramPanchayat: "",
            image: null,
            remarks: ""
          });
          setLoading(false);
        } catch (error) {
          setError("Error: " + error.message);
          setLoading(false);
        }
      };
    } catch (error) {
      setError("Error: " + error.message);
      setLoading(false);
    }
  }


  return (
    <div className='p-2'>
      <h1 className="text-2xl font-bold mb-4">Complaint Page</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          
          {/* Category Selection */}
          <div>
            <label className="block font-semibold mb-2">Select Complaint Type</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleCategoryChange} 
              className="w-full border p-2 rounded"
            >
              <option value="">Select Category</option>
              {categories.map((item) => (
                <option key={item._id} value={item.category}>
                  {item.category}
                </option>
              ))}
            </select>
          </div>

          {/* State Selection */}
          <div>
            <label className="block font-semibold mb-2">Select State</label>
            <select 
              name="state"
              value={formData.state}
              onChange={handleStateChange} 
              className="w-full border p-2 rounded"
            >
              <option value="">Select State</option>
              {states.map((item, idx) => (
                <option key={idx} value={item.state}>
                  {item.state}
                </option>
              ))}
            </select>
          </div>

          {/* District Selection */}
          <div>
            <label className="block font-semibold mb-2">Select District</label>
            <select 
              name="district"
              value={formData.district}
              onChange={handleDistrictChange} 
              className="w-full border p-2 rounded"
              disabled={!formData.state}
            >
              <option value="">Select District</option>
              {districts.map((item, idx) => (
                <option key={idx} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Taluk Selection */}
          <div>
            <label className="block font-semibold mb-2">Select Taluk</label>
            <select 
              name="taluk"
              value={formData.taluk}
              onChange={handleTalukChange} 
              className="w-full border p-2 rounded"
              disabled={!formData.district}
            >
              <option value="">Select Taluk</option>
              {taluks.map((item, idx) => (
                <option key={idx} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* GP Selection */}
          <div>
            <label className="block font-semibold mb-2">Select Gram Panchayat</label>
            <select 
              name="gramPanchayat"
              value={formData.gramPanchayat}
              onChange={handleGPChange} 
              className="w-full border p-2 rounded"
              disabled={!formData.taluk}
            >
              <option value="">Select GP</option>
              {gps.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold mb-2">Get Location</label>
            <button 
              type="button"
              onClick={getLocation} 
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Get Current Location
            </button>
            {formData.latitude && (
              <div className="mt-2 text-sm">
                <p>Latitude: {formData.latitude}</p>
                <p>Longitude: {formData.longitude}</p>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-semibold mb-2">Upload Image</label>
            <input 
              type="file" 
              name="image"
              accept="image/*"
              onChange={handlechange}
              className="w-full border p-2 rounded"
            />
            {formData.image && (
              <p className="text-sm text-green-600 mt-1">Image selected: {formData.image.name}</p>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block font-semibold mb-2">Remarks</label>
            <textarea 
              name="remarks"
              value={formData.remarks}
              onChange={handlechange}
              placeholder="Enter remarks"
              className="w-full border p-2 rounded"
              rows="3"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-green-500 text-white p-2 rounded w-full disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}
