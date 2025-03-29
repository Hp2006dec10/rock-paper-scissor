import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useNavigate, useLocation } from "react-router";
import {jwtDecode} from "jwt-decode";
import api from "./axios";

const LoginPage = () => {
    const [formData, changeData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState(null);
    const [errors,setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";
    const handleChange = (e) => {
        changeData({...formData,[e.target.name]: e.target.value});
    };
    const validateForm = () =>{
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        let errors = {};
        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) errors.email = "Invalid Email";

        if (!formData.password.trim()) errors.password = "Password is required";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(()=>{
        setTimeout(()=>{
            if (message) navigate('/');
        },2000);
    },[message]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm) return;

        try{
            const response = await api.post("auth/login", formData);
            const {message, token} = response.data;
            if (message) {
                console.log(message);
                localStorage.setItem("token", token);
                setMessage(message);
            }
            setTimeout(async () => {
                const user = jwtDecode(localStorage.getItem("token"));
                localStorage.removeItem("token");
                console.log(user.email);
                const response = await api.post('auth/logout',{email: user.email});
                console.log(response.data);
            }, 4 * 60 * 60 * 1000);
        }
        catch (err){
            alert("Login Failed!!!");
            console.log(err.response?.data.error);
        }
    };

    return (
        <div className="flex h-screen w-screen justify-center items-center">
            <div className={`bg-gradient-to-r from-blue-600 from-10% via-blue-500 via-30% to-blue-400 to-90% h-fit ${message ? "py-50":"py-100"} rounded-[40px]`}>
                {message && <p className="text-2xl justify-self-center my-50 p-10 bg-gray-200 text-green-600 rounded-[10px]">✅Login successful...redirecting to home page</p>}
                <div className="text-2xl text-center">
                    <form className={`flex flex-col w-fit gap-40 text-xl text-white px-50`} onSubmit={handleSubmit}>
                        <p className="justify-self-center text-3xl">LOGIN</p>

                        <div className="flex gap-40 justify-between">
                            <label htmlFor="email" className="justify-self-end">Email : </label>
                            <input onChange={handleChange} type="text" name="email" className="h-20 justify-self-start w-400 bg-white text-blue-600 rounded-full shadow-[5px_5px_15px_rgba(0,0,0,0.4)] py-20 px-10"/>
                            {errors.email && <span className="text-red-500 col-span-2 text-center">{errors.email}</span>}
                        </div>

                        <div className="flex gap-40 justify-between">
                            <label htmlFor="passwd" className="justify-self-end">Password :</label>
                            <input onChange={handleChange} type="password" name="password" className="h-20 w-400 justify-self-start w-150 bg-white text-blue-600 rounded-full shadow-[5px_5px_15px_rgba(0,0,0,0.4)] py-20 px-10"/>
                            {errors.password && <span className="text-red-500 col-span-2 text-center">{errors.password}</span>}
                        </div>
                        
                        {/* <p className="text-white">Forgot password?</p> */}
                        <button className="text-blue-600 bg-gray-100 size-fit px-20 py-10 justify-self-center relative left-[40%] mb-40 cursor-pointer shadow-[5px_5px_20px_rgba(0,0,0,1)]">Submit</button>
                    </form>
                    <p className="text-white">New User? <Link to="/signup" className="underline text-[rgb(255,68,0)]">Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;