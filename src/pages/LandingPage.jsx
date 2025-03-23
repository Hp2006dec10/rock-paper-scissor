import { useState} from "react";
import { Link } from "react-router";
const Menu = ({token}) => {
  return (
    // <div className={`justify-self-center ${!token ? 'mt-100':'mt-50'}`}>
    <div className={`justify-self-center mt-200`}>
        <Link to="/game"><div className='h-75 w-200 bg-[rgb(101,70,92)] -outline-offset-10 outline-3 outline-white m-20 flex items-center justify-center text-3xl text-white cursor-pointer'>Play</div></Link><br/>
        {/* {!token && <div className='h-75 w-200 bg-[rgb(101,70,92)] -outline-offset-10 outline-3 outline-white m-20 flex items-center justify-center text-3xl text-white cursor-pointer'>Login</div>} */}
        {/* {token &&
        <>
        <button className='h-75 w-200 bg-[rgb(101,70,92)] -outline-offset-10 outline-3 outline-white m-20 flex items-center justify-center text-3xl text-white cursor-pointer'>Stats</button><br/>
        <button className='h-75 w-200 bg-[rgb(101,70,92)] -outline-offset-10 outline-3 outline-white m-20 flex items-center justify-center text-3xl text-white cursor-pointer'>Profile</button>
        </>} */}
        {/* <br/>
        <div className='h-75 w-200 bg-[rgb(101,70,92)] -outline-offset-10 outline-3 outline-white m-20 flex items-center justify-center text-3xl text-white cursor-pointer'>Settings</div><br/>  */}
      </div>
  )
}
function LandingPage(){
    const [token, setToken] = useState(localStorage.getItem("token") || null);

  return(
    <div className='bg-black h-screen w-screen'>
      <div className='text-[75px] text-white text-center pt-50'>ROCK PAPER SCISSOR</div>
      <Menu token={token}/>
      <div className='absolute left-20 bottom-20'>
      </div>
    </div>
  )
}

export default LandingPage;