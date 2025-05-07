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
            <div className={`bg-gradient-to-r from-blue-600 from-10% via-blue-500 via-30% to-blue-400 to-90% h-fit w-[80%] md:w-[60%] lg:w-[52.5%] rounded-[5%] py-[5%] px-[2%]`}>
                {message && <p className="text-[1rem] md:text-[1.5rem] mx-[2%] justify-self-center mb-[2%] p-[1%] bg-gray-200 text-green-600 rounded-full text-center">✅Login successful...redirecting to home page</p>}
                <div className="text-center">
                    <form className={`flex flex-col items-center text-white`} onSubmit={handleSubmit}>
                        <p className="text-xl md:text-2xl lg:text-3xl">LOGIN</p>

                        <div className="flex w-[100%] py-[5%] px-[1%] relative">
                            <label htmlFor="email" className="md:text-xl lg:text-2xl">Email : </label>
                            <input onChange={handleChange} type="text" name="email" className="h-fit w-[75%] p-[1%] bg-white text-blue-600 rounded-full shadow-[5px_5px_15px_rgba(0,0,0,0.4)] absolute right-[1%]"/>
                            {errors.email && <span className="text-red-500 text-center">{errors.email}</span>}
                        </div>

                        <div className="flex w-[100%] py-[5%] px-[1%] relative">
                            <label htmlFor="passwd" className="md:text-xl lg:text-2xl">Password :</label>
                            <input onChange={handleChange} type="password" name="password" className="h-fit w-[75%] p-[1%] bg-white text-blue-600 rounded-full shadow-[5px_5px_15px_rgba(0,0,0,0.4)] absolute right-[1%]"/>
                            {errors.password && <span className="text-red-500 text-center">{errors.password}</span>}
                        </div>
                        
                        {/* <p className="text-white">Forgot password?</p> */}
                        <button className="text-blue-600 p-[1%] my-[5%] bg-gray-100 size-fit cursor-pointer shadow-[5px_5px_20px_rgba(0,0,0,1)]">Submit</button>
                    </form>
                    <p className="text-white">New User? <Link to="/signup" className="underline text-[rgb(255,68,0)]">Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;