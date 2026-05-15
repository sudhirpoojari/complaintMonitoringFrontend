import React from 'react'
import axios from "axios";
import API_URL from "../config/api";

import { useNavigate } from "react-router-dom";

export default function GpLogin() {
  const navigate = useNavigate();
  const [error,setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const[formData,setFormData]=React.useState({
    gp_email:"",
    gp_password:""
})

const handlechange = (e) => { 
  setFormData({...formData,
    [e.target.name]:e.target.value
  });  
};

const handlesubmit= async(e)=> {
    e.preventDefault();   

    setLoading(true);
    try{ 
        console.log("GP login send:", formData);
        const response = await axios.post(`${API_URL}/gp/login`, formData);
        const data = response.data;
        console.log("GP login response:", data);
        
        // FIX: Save token to localStorage before navigating!
        localStorage.setItem("token", data.token);
        
        setSuccess(data.message || "Login successful");
        setError("");
    
        // Navigate to dashboard
        navigate("/gpdashboard");
    }

    catch(error){
        setError(error.response?.data?.error || error.response?.data?.message || "An error occurred during login");
        setSuccess("");
    } finally {
        setLoading(false);
    }
}
  return (
    <div>
      <div className=' font-bold font-serif  text-center  bg-cyan-200 text-shadow-green-500 text-3xl justify-center hover:text-amber-500'>Grama Panchayath Login </div>
            <div className="flex flex-col p-4 gap-4 md:flex-row align-middle justify-center">              
          <form onSubmit={handlesubmit}>
             
             
            <div className='pt-2'>              
              <label>Username:</label>
              <input type="text"
               name="gp_email" 
               value={formData.gp_email}
               onChange={handlechange}
               className="border p-2 mb-4 w-full rounded-2xl" />
            </div>
            <div className='pt-1 '>
              <label>Password:</label>
              <input type="password" 
               name="gp_password" 
               value={formData.gp_password}
               onChange={handlechange}
               className="border p-2 mb-4 w-full rounded-2xl" />
            </div>
            <div>
              <button disabled={loading} className="bg-blue-600 text-white p-2 w-full rounded-2xl mt-4 disabled:bg-gray-400">
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
            </div>
    </div>
  )

}