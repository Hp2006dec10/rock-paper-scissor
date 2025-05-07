import { useEffect, useState } from "react";
import api from "./axios";
import { useNavigate } from "react-router";


const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password:"",
    cnfrmpassword:""
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!emailRegex.test(formData.email)) errors.email = "Invalid Email";
    if (!phoneRegex.test(formData.phone)) errors.phone = "Invalid Phone No (10 digits)";
    if (formData.password != formData.cnfrmpassword) errors.password = "Passwords do not match";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    try {
      const response = await api.post("auth/signup", formData);
      const {message} = response.data;
      if (message) {
        console.log(message);
        setMessage(message);
      }
    } 
    catch (err) {
      console.log("Signup failed:", err.response?.data.error);
      alert("Signup failed!");
    }
  };

  useEffect(() => {
    if (message){
      setTimeout(()=>{
        navigate("/login");
      }, 2000);
    }
  },[message]);

  return (
    <div className="flex flex-col h-screen">
      <h1 className="w-screen text-white h-100 text-left bg-gradient-to-r from-[rgb(16,187,230)] from-10% via-[rgb(26,207,200)] via-50% to-[rgb(36,227,190)] to-90% pl-20 pt-25 text-4xl">Rock Paper Scissor</h1>
      {message && <p className="text-2xl justify-self-center mt-50 p-10 bg-green-200 text-green-600 rounded-[10px]">✅Signup successful...redirecting to login</p>}
      <div className="flex-grow flex flex-col justify-evenly">
        <form className="w-[100%] md:w-[75%] lg:w-[65%] mx-auto flex flex-col items-center p-[1%] gap-40 md:gap-20 md:text-2xl lg:text-3xl" onSubmit={handleSubmit}>
          <div className="relative w-[100%] justify-between p-[2%]">
            <label htmlFor="name" className="text-right">Name : </label>
            <input type="text" name="name" className="bg-[rgb(226,216,216)] shadow-xl px-10 py-[2.5] absolute right-0 w-[50%]" value={formData.name} onChange={handleChange}/>
            {errors.name && <span className="text-red-500 text-center">{errors.name}</span>}
          </div>
          <div className="relative w-[100%] flex justify-between p-[2%]">
            <label htmlFor="email" className="text-right">Email : </label>
            <input name="email" type="text" className="bg-[rgb(226,216,216)] shadow-xl px-10 py-[2.5] absolute right-0 w-[50%]" value={formData.email} onChange={handleChange}/>
            {errors.email && <span className="text-red-500 text-center">{errors.email}</span>}
          </div>
          <div className="relative w-[100%] flex justify-between p-[2%]">
            <label htmlFor="number" className="text-right">Phone Number :</label>
            <input name="phone" type="text" className="bg-[rgb(226,216,216)] shadow-xl px-10 py-[2.5] absolute right-0 w-[50%]" value={formData.phone} onChange={handleChange}/>
            {errors.phone && <span className="text-red-500 text-center">{errors.phone}</span>}
          </div>
          <div className="relative w-[100%] flex justify-between p-[2%]">
            <label htmlFor="password" className="text-right">Password :</label>
            <input name="password" type="password" className="bg-[rgb(226,216,216)] shadow-xl px-10 py-[2.5] absolute right-0 w-[50%]" value={formData.password} onChange={handleChange}/>
          </div>
          <div className="relative w-[100%] flex justify-between p-[2%]">
            <label htmlFor="cnfrmpassword" className="text-right">Confirm Password :</label>
            <input name="cnfrmpassword" type="password" className="bg-[rgb(226,216,216)] shadow-xl px-10 py-[2.5] absolute right-0 w-[50%]" value={formData.cnfrmpassword} onChange={handleChange} />
            {errors.password && <span className="text-red-500 text-center">{errors.password}</span>}
          </div>

          <button type="submit" className="bg-blue-300 col-span-2 w-fit justify-self-center border-black border-2 px-20 py-10 cursor-pointer">Submit</button>

        </form>
      </div>
    </div>
  );
}

export default Signup;