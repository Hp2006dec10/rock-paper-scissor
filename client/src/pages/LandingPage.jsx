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
        <Link to="/game"><div className='px-[100%] py-[25%] bg-[rgb(101,70,92)]  m-auto flex items-center justify-center text-2xl md:text-3xl text-white rounded-[10px] relative hover:px-[120%] hover:-left-[10%] hover:py-[30%] hover:rounded-[0px] cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]'>Play</div></Link>
        
        {!token && <Link to="/login"><div className='px-[100%] py-[25%] bg-[rgb(101,70,92)]  mx-auto my-[40%] flex items-center justify-center text-2xl md:text-3xl text-white cursor-pointer rounded-[10px] relative hover:px-[115%] hover:-left-[10%] hover:py-[30%] hover:rounded-[0px] hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]'>Login</div></Link>}
        {token &&
        <>
        <div onClick={handleLogOut} className='px-[100%] py-[25%] bg-[rgb(101,70,92)]  mx-auto my-[20%] flex items-center justify-center text-2xl md:text-3xl text-white cursor-pointer relative rounded-[10px] hover:px-[115%] hover:-left-[10%] hover:py-[30%] hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]'>Logout</div>
        </>}
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
    <div className='bg-gradient-to-r from-black from-10% via-[rgb(28,22,27)] via-50% to-black to-90% h-screen w-screen'>
      <div className='text-[30px] md:text-[60px] lg:text-[100px] text-white text-center pt-50 text-shadow'>ROCK PAPER SCISSOR</div>
      <Menu token={token}/>
      <div className='absolute left-20 bottom-20'>
      </div>
    </div>
  )
}

export default LandingPage;