import React from 'react'
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [error,setError] = React.useState("");          
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const[formData,setFormData]=React.useState({
        email:"",
        password:""
    })



// Hande Input change
const handlechange = (e) => {
  setFormData({...formData,
    [e.target.name]:e.target.value
  });
};


const handlesubmit= async(e)=> {
    e.preventDefault();
  
    setLoading(true);

      try{
        const response = await axios.post("http://localhost:3000/login",formData)
        setSuccess("Login successful");
       //
       localStorage.setItem("token", response.data.token);

     window.location.href = "/dashboard";

        setError("");
        console.log(response.data);
    }
    catch(error){
        setError(error.response?.data?.error || "An error occurred during login");
              setSuccess("");

       // console.error(error.response?.data || error.message);
        setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
    } finally {
        setLoading(false);
    }
   
}



  return (
    <div>

    <div className=' font-bold font-serif  text-center  bg-cyan-200 text-shadow-green-500 text-3xl justify-center hover:text-amber-500'>Citizen Login </div>

                <div className="flex flex-col p-4 gap-6 md:flex-row align-middle justify-center">

                    <form onSubmit={handlesubmit}>

                       
                        <div className='pt-2'>

                            <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handlechange}
                             placeholder="Username" className="border p-2 mb-4 w-full rounded-2xl" />
                        </div>
                        <div>
                            <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handlechange}
                            placeholder="Password" className="border p-2 mb-4 w-full rounded-2xl" />
                        </div>
                        <div>

                            {error && <p className="text-red-500 text-2xl ">{error}</p>}
                            {success && <p className="text-green-500 text-2xl ">{success}</p>}

                            <button disabled={loading} className="bg-blue-600 text-white p-2 rounded-2xl w-full disabled:bg-gray-400">
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                        </form>
                </div>

      
    </div>
  )
}
