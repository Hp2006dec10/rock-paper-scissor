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
    <div className="justify-self-center mt-150">
        <Link to="/game"><div className='h-75 w-200 bg-[rgb(101,70,92)] -outline-offset-10 outline-3 outline-white m-40 flex items-center justify-center text-3xl text-white cursor-pointer'>Play</div></Link>
        {!token && <Link to="/login"><div className='h-75 w-200 bg-[rgb(101,70,92)] -outline-offset-10 outline-3 outline-white m-40 flex items-center justify-center text-3xl text-white cursor-pointer'>Login</div></Link>}
        {token &&
        <>
        <div onClick={handleLogOut} className='h-75 w-200 bg-[rgb(101,70,92)] -outline-offset-10 outline-3 outline-white m-40 flex items-center justify-center text-3xl text-white cursor-pointer'>Logout</div>
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
      <div className='text-[75px] text-white text-center pt-50'>ROCK PAPER SCISSOR</div>
      <Menu token={token}/>
      <div className='absolute left-20 bottom-20'>
      </div>
    </div>
  )
}

export default LandingPage;