import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const ConfirmPopup = ({ onYes, onNo }) => (
  <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="fixed inset-0 z-0">
      <div className="absolute top-0 left-0 size-300 md:size-500 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
      <div
        className="absolute bottom-0 right-0 size-300 md:size-500 bg-blue-500/10 rounded-full blur-3xl float-animation"
        style={{ animationDelay: "1.5s" }}
      ></div>
    </div>
    <div className="z-30 glass w-4/5 md:w-1/3 lg:w-1/5 rounded-lg py-20 text-white">
      <p className="text-center text-lg md:text-2xl mb-5">Are you sure you want to exit?</p>
      <div className="flex gap-15 w-9/10 mx-auto">
        <button type="button" className="w-1/2 py-2.5 rounded-md bg-white/20 hover:bg-white/30 cursor-pointer" onClick={onYes}>
          Yes
        </button>
        <button type="button" className="w-1/2 py-2.5 rounded-md bg-white/20 hover:bg-white/30 cursor-pointer" onClick={onNo}>
          No
        </button>
      </div>
    </div>
  </div>
);

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
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!emailRegex.test(formData.email)) errors.email = "Invalid email";
    if (!phoneRegex.test(formData.phone)) errors.phone = "Invalid phone number (10 digits)";
    if (formData.password !== formData.cnfrmpassword) errors.password = "Passwords do not match";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setMessage("Signup is temporarily disabled until DB status is verified.");
  };

  useEffect(() => {
    if (message){
      setTimeout(()=>{
        navigate("/login");
      }, 2000);
    }
  },[message]);

  return (
    <>
      {/*<div className="bg-black ">
        
      </div>*/}
      <div className="relative flex items-center justify-center px-4 py-4 bg-black h-[100dvh] w-screen overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 left-0 size-200 md:size-500 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
          <div
            className="absolute bottom-0 right-0 size-200 md:size-500 bg-blue-500/10 rounded-full blur-3xl float-animation"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
        <div className="z-10 glass w-4/5 md:w-1/2 lg:w-1/3 rounded-xl p-8 md:p-16 lg:p-24 text-white">
          <p className="text-2xl md:text-4xl text-center mb-2 font-semibold">SIGN UP</p>
          <p className="text-center text-sm md:text-base text-slate-200 mb-4">Create your account.</p>
          {message && (
            <p className="text-sm md:text-base mb-5 p-3 bg-white/20 rounded-xl text-center text-[rgb(254,245,151)]">
              {message}
            </p>
          )}
          <form className="grid grid-cols-2 gap-5 md:gap-15" onSubmit={handleSubmit}>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="name" className="block text-sm md:text-base mb-1">Name</label>
              <input type="text" name="name" className="w-full px-4 py-2.5 rounded-md bg-white/15 border border-white/25 text-white outline-none focus:border-white/60" value={formData.name} onChange={handleChange}/>
              {errors.name && <span className="text-red-300 text-sm">{errors.name}</span>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="email" className="block text-sm md:text-base mb-1">Email</label>
              <input name="email" type="text" className="w-full px-4 py-2.5 rounded-md bg-white/15 border border-white/25 text-white outline-none focus:border-white/60" value={formData.email} onChange={handleChange}/>
              {errors.email && <span className="text-red-300 text-sm">{errors.email}</span>}
            </div>
            <div className="col-span-2">
              <label htmlFor="phone" className="block text-sm md:text-base mb-1">Phone Number</label>
              <input name="phone" type="text" className="w-full px-4 py-2.5 rounded-md bg-white/15 border border-white/25 text-white outline-none focus:border-white/60" value={formData.phone} onChange={handleChange}/>
              {errors.phone && <span className="text-red-300 text-sm">{errors.phone}</span>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="password" className="block text-sm md:text-base mb-1">Password</label>
              <input name="password" type="password" className="w-full px-4 py-2.5 rounded-md bg-white/15 border border-white/25 text-white outline-none focus:border-white/60" value={formData.password} onChange={handleChange}/>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="cnfrmpassword" className="block text-sm md:text-base mb-1">Confirm Password</label>
              <input name="cnfrmpassword" type="password" className="w-full px-4 py-2.5 rounded-md bg-white/15 border border-white/25 text-white outline-none focus:border-white/60" value={formData.cnfrmpassword} onChange={handleChange} />
              {errors.password && <span className="text-red-300 text-sm">{errors.password}</span>}
            </div>

            <div className="col-span-2 flex justify-between items-center mt-10">
              <button type="submit" className="py-2.5 px-6 text-lg rounded-sm bg-white/20 hover:bg-white/30 cursor-pointer">
                Submit
              </button>
              <button type="button" className="glass glass-hover text-lg px-4 py-1.5 rounded-sm cursor-pointer" onClick={() => setShowExitConfirm(true)}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
      {showExitConfirm && <ConfirmPopup onYes={() => navigate("/")} onNo={() => setShowExitConfirm(false)} />}
    </>
  );
}

export default Signup;