import { useState } from "react";
import React from 'react'
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
function Register() {

const [formData,setFormData] = React.useState({
  name:"",
  email:"",
  mobile:"",
  password:"",
  state:"",
  district:"",
  taluk:"",
  gramPanchayat:""
})

  const [error,setError] = useState("");  
  const [success, setSuccess] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [gps, setGps] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");
  const [selectedGp, setSelectedGp] = useState("");

// Hande Input change
const handlechange = (e) => {
  setFormData({...formData,
    [e.target.name]:e.target.value
  });
};

//Handle form submit 
const handlesubmit = async (e) => {
  e.preventDefault();
  try{

    const response = await axios.post("https://complaintmonitoringbackend.onrender.com/register",formData)  
    alert("Registration successful");
    //alert(response.error || response.data.message || "Registration successful"  );

  }
  catch(error)
  {
   console.error(error.response?.data || error.message);
   setError(error.response?.data?.error || "An error occurred during registration");
  }
  console.log(formData);
}



 // Load states
  useEffect(() => {
    axios.get("https://complaintmonitoringbackend.onrender.com/states")
      .then(res => setStates(res.data));
  }, []);


    // State change
  const handleState = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setFormData({ ...formData, state, district: "", taluk: "", gramPanchayat: "" });
    setSelectedDistrict("");
    setSelectedTaluk("");
    setSelectedGp("");
    setDistricts([]);
    setTaluks([]);
    setGps([]);
    setError("");

    try {
      const res = await axios.get(`https://complaintmonitoringbackend.onrender.com/districts/${state}`);
      setDistricts(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError("Unable to load districts for the selected state.");
    }
  };

    // District change
  const handleDistrict = async (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setFormData({ ...formData, district, taluk: "", gramPanchayat: "" });
    setSelectedTaluk("");
    setSelectedGp("");
    setTaluks([]);
    setGps([]);
    setError("");

    if (!selectedState) {
      setError("Please select a state before choosing a district.");
      return;
    }

    try {
      const res = await axios.get(`https://complaintmonitoringbackend.onrender.com/taluks/${selectedState}/${district}`);
      setTaluks(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError("Unable to load taluks for the selected district.");
    }
  };


    // ✅ Load taluks
// Taluk change
  const handleTaluk = async (e) => {
    const taluk = e.target.value;
    setSelectedTaluk(taluk);
    setFormData({ ...formData, taluk, gramPanchayat: "" });
    setSelectedGp("");
    setGps([]);
    setError("");

    if (!selectedState || !selectedDistrict) {
      setError("Please select state and district before choosing a taluk.");
      return;
    }

    try {
      const res = await axios.get(
        `https://complaintmonitoringbackend.onrender.com/gp/${selectedState}/${selectedDistrict}/${taluk}`
      );
      setGps(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError("Unable to load Gram Panchayats for the selected taluk.");
    }
  };

  const handleGp = (e) => {
    const gp = e.target.value;
    setSelectedGp(gp);
    setFormData({ ...formData, gramPanchayat: gp });
  };



  return (
    <div className="">
       <form onSubmit={handlesubmit} className="">
      
       <div className=' font-bold font-serif  text-center  bg-cyan-200 text-shadow-green-500 text-3xl justify-center hover:text-amber-500'>Citizen Registration </div>

      <div className="flex flex-row p-1">
            <div className="basis-1/4 p-1">  
            <label>Name</label>        
                    <input type="text" 
                     name="name"
                    placeholder="Enter Name" 
                    onChange={handlechange}
                    value={formData.name}              
                    className="border p-2 mb-4 w-full rounded-2xl" />                 
              </div>        
            <div className="basis-1/4 p-1">
            <label>Email</label>
                  <input type="email"
                    placeholder="Enter Email-ID"
                      name="email"
                    onChange={handlechange}
                    value={formData.email}
                    className="border p-2 mb-4 w-full rounded-2xl" />
            </div>
            <div className="basis-1/4 p-1">  
            <label>Mobile No</label> 
                  <input type="mobile"        
                  placeholder="Enter Mobile No" 
                    name="mobile"
                  onChange={handlechange}
                  value={formData.mobile}
                  className="border p-2 mb-2 w-full rounded-2xl " />
            </div>

             

            <div className="basis-1/4 p-1"> 
            <label>Password</label>   
                  <input type="password"        
                  placeholder="EnterPassword" 
                    name="password"
                  onChange={handlechange}
                  value={formData.password}
                  className="border p-2 mb-4 w-full rounded-2xl" />
            </div>       
    </div>

    <div className="flex flex-row p-1">          
              <div className="basis-1/4 p-1">  
            <label>State</label>

                <select
                  value={selectedState}
                  onChange={handleState}
                  className="border p-2 mb-4 w-full rounded-2xl"
                >
                  <option value="">Select State</option>
                  {states.map((s, i) => (
                    <option key={i} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>

              </div>
              <div className="basis-1/4 p-1">  
              {/* District */}
               <label>District</label>
                <select
                  value={selectedDistrict}
                  onChange={handleDistrict}
                  className="border p-2 mb-4 w-full rounded-2xl"
                >
                  <option value="">Select District</option>
                  {districts.map((d, i) => (
                    <option key={i} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="basis-1/4 p-1">  
                <label>Taluk</label>
                <select
                  value={selectedTaluk}
                  onChange={handleTaluk}
                  className="border p-2 mb-4 w-full rounded-2xl"
                >
                  <option value="">Select Taluk</option>
                  {taluks.map((t, i) => (
                    <option key={i} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="basis-1/4 p-1">  
              <label>Gram Panchayat</label>
                   <select
                     value={selectedGp}
                     onChange={handleGp}
                     className="border p-2 mb-4 w-full rounded-2xl"
                   >
        <option value="">Select GP</option>
        {gps.map((g, i) => (
          <option key={i} value={g}>
            {g}
          </option>
        ))}
      </select>
              </div>
            </div>  



    <div className="flex flex-row">
      
        <div className="basis-1/3 p-1"> </div>
        <div className="basis-1/3 p-1"> 
        <button className="bg-blue-600 text-white p-2 w-full rounded-2xl">Register</button>
        </div>
        <div className="basis-1/3 p-1"> </div>
    </div>

 </form>

 
    <div className="flex flex-row">
  <div>{error && <p className="text-red-500">{error}</p>}</div>
 </div>

 
    </div>
  );
}

export default Register;