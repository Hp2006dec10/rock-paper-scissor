import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

const ConfirmPopup = ({ onYes, onNo }) => (
  <div className="fixed z-20 inset-0 flex items-center justify-center bg-black px-4">
    <div className="absolute top-0 left-0 size-300 md:size-500 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
    <div
      className="absolute bottom-0 right-0 size-300 md:size-500 bg-blue-500/10 rounded-full blur-3xl float-animation"
      style={{ animationDelay: "1.5s" }}
    ></div>
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

const LoginPage = () => {
  const [formData, changeData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    changeData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const nextErrors = {};
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) nextErrors.email = "Invalid email";

    if (!formData.password.trim()) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setMessage("Login is temporarily disabled until DB status is verified.");
  };

  return (
    <>
      <div className="bg-black h-[100dvh] w-screen overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 left-0 size-300 md:size-500 bg-purple-500/10 rounded-full blur-3xl float-animation"></div>
          <div
            className="absolute bottom-0 right-0 size-300 md:size-500 bg-blue-500/10 rounded-full blur-3xl float-animation"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="glass w-4/5 md:w-1/2 lg:w-1/3 rounded-xl p-8 md:p-16 lg:p-24 text-white">
            <p className="text-2xl md:text-4xl text-center mb-2 font-semibold">LOGIN</p>
            <p className="text-center text-sm md:text-base text-slate-200 mb-6">
              Use your account to continue playing.
            </p>

            {message && (
              <p className="text-sm md:text-base mb-5 p-3 bg-white/20 rounded-xl text-center text-[rgb(254,245,151)]">
                {message}
              </p>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-md md:text-xl mb-1">
                  Email
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="email"
                  value={formData.email}
                  className="w-full px-4 py-2.5 rounded-md bg-white/15 border border-white/25 text-white outline-none focus:border-white/60"
                />
                {errors.email && <span className="text-red-300 text-sm">{errors.email}</span>}
              </div>

              <div>
                <label htmlFor="password" className="block text-md md:text-xl mb-1">
                  Password
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  value={formData.password}
                  className="w-full px-4 py-2.5 rounded-md bg-white/15 border border-white/25 text-white outline-none focus:border-white/60"
                />
                {errors.password && <span className="text-red-300 text-sm">{errors.password}</span>}
              </div>
                <div className="w-full flex items-center justify-center my-15">
                    <button
                        type="submit"
                        className="w-fit px-10 mt-2 py-2.5 rounded-sm bg-white/20 hover:bg-white/30 cursor-pointer"
                    >
                        Submit
                    </button>
                </div>
            </form>

            <div className="mt-5 flex justify-between items-center text-sm md:text-base">
              <p>
                New user?{" "}
                <Link to="/signup" className="underline text-[rgb(254,245,151)]">
                  Sign Up
                </Link>
              </p>
              <button
                type="button"
                className="glass glass-hover px-4 py-1.5 rounded-sm cursor-pointer"
                onClick={() => setShowExitConfirm(true)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
      {showExitConfirm && <ConfirmPopup onYes={() => navigate("/")} onNo={() => setShowExitConfirm(false)} />}
    </>
  );
};

export default LoginPage;