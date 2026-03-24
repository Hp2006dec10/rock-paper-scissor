import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import api from "./axios";

const GAME_MODES = [
  { id: "classic_5", label: "Classic - 5 points" },
  { id: "classic_10", label: "Classic - 10 points" },
  { id: "classic_20", label: "Classic - 20 points" },
  { id: "sd_120", label: "Sudden Death - 2 minutes" },
  { id: "sd_300", label: "Sudden Death - 5 minutes" },
];

const ModeModal = ({ onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black px-4">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 size-300 md:size-500 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
        <div
          className="absolute bottom-0 right-0 size-300 md:size-500 bg-blue-500/10 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
      <div className="z-40 glass w-4/5 md:w-1/2 lg:w-1/4 max-w-xl rounded-2xl px-5 md:px-8 py-20 text-white">
        <p className="text-xl md:text-3xl text-center mb-20 font-semibold">Select Game Mode</p>
        <div className="grid gap-10 w-9/10 mx-auto">
          {GAME_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className="glass glass-hover rounded-xl px-4 py-3 text-sm md:text-lg cursor-pointer"
              onClick={() => onSelect(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div className="w-full flex items-center justify-center mt-20">
          <button
            type="button"
            className="mt-5 w-1/2 rounded-xl bg-white/20 hover:bg-white/30 py-2 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Menu = ({ token }) => {
  const [showModes, setShowModes] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      if (!token) return;
        const user = jwtDecode(token);
        const response = await api.post("auth/logout", { email: user.email });
        if (response) {
          console.log(response.data.message);
          localStorage.removeItem("token");
        }
      } catch (err) {
      console.log(err);
      console.log(err.response?.data.error);
    }
  };

  const handleModeSelect = (mode) => {
    setShowModes(false);
    navigate("/game", { state: { mode } });
  };

  return (
    <>
      <div className="w-fit max-w-[560px] glass rounded-xl p-15 md:p-20">
        <p className="text-xl md:text-3xl lg:text-4xl text-center font-semibold bg-linear-135 from-purple-500 to-violet-600 bg-clip-text text-transparent">
          Rock Paper Scissor
        </p>
        <div className="mt-8 md:mt-20 flex flex-col gap-20 items-center">
          <button
            type="button"
            className="w-2/5 glass glass-hover py-3 md:py-4 text-lg md:text-2xl text-white rounded-md md:rounded-xl cursor-pointer text-center"
            onClick={() => setShowModes(true)}
          >
            Play
          </button>
          {!token && (
            <Link
              to="/login"
              className="w-2/5 glass glass-hover py-3 md:py-4 text-lg md:text-2xl text-white rounded-md md:rounded-xl cursor-pointer text-center"
            >
              Login
            </Link>
          )}
          {token && (
            <button
              type="button"
              onClick={handleLogOut}
              className="glass glass-hover py-3 md:py-4 text-xl md:text-lg text-white rounded-xl cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      {showModes && (
        <ModeModal onClose={() => setShowModes(false)} onSelect={handleModeSelect} />
      )}
    </>
  );
};
function LandingPage() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  useEffect(() => {
    const interval = setInterval(() => {
      setToken(localStorage.getItem("token"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black h-screen w-screen overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 size-300 md:size-500 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
        <div
          className="absolute bottom-0 right-0 size-300 md:size-500 bg-blue-500/10 rounded-full blur-3xl float-animation"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <Menu token={token} />
      </div>
    </div>
  );
}

export default LandingPage;