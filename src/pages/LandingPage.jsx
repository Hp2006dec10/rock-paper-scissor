import { useState, useEffect} from "react";
import { Link } from "react-router";
import { jwtDecode } from "jwt-decode";
import api from './axios';

const Menu = ({token}) => {
  const handleLogOut  = async () => {
      try{
        const user = jwtDecode(token);
        const response = await api.post("auth/logout",{email:user.email});
        if (response){
          console.log(response.data.message);
          localStorage.removeItem("token");
        }
      }
      catch(err){
        console.log(err);
        console.log(err.response?.data.error);
      }
  }
  return (
    <div className="justify-self-center relative right-[5%] mt-150 md:mt-[20%] lg:mt-[10%]">
        <Link to="/game"><div className='glass glass-hover px-25 py-10 m-auto flex items-center justify-center text-2xl md:text-3xl text-white rounded-[10px] relative cursor-pointer'>Play</div></Link>
        
        {!token && <Link to="/login"><div className='glass glass-hover px-25 py-10 mx-auto my-[40%] flex items-center justify-center text-2xl md:text-3xl text-white cursor-pointer rounded-[10px] relative'>Login</div></Link>}
        {token &&
        <div>
          <div onClick={handleLogOut} className=' glass glass-hover px-25 py-10 mx-auto my-[20%] flex items-center justify-center text-2xl md:text-3xl text-white cursor-pointer relative rounded-[10px]'>Logout</div>
        </div>}
      </div>
  )
}
function LandingPage(){
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    useEffect(() => {
      const interval = setInterval(() => {
          setToken(localStorage.getItem("token"));
      }, 1000); 
  
      return () => clearInterval(interval);
  }, []);

  return(
    <div className='bg-black h-screen w-screen'>
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 size-300 md:size-500 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-0 right-0 size-300 md:size-500 bg-blue-500/10 rounded-full blur-3xl float-animation" style={{animationDelay: "1.5s"}}></div>
      </div>
      <div className="z-10">
        <div className='text-[30px] md:text-[60px] lg:text-[100px] text-white text-center pt-50'>Rock Paper Scissor</div>
        <Menu token={token}/>
      </div>
    </div>
  )
}

export default LandingPage;