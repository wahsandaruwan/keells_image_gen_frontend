import React, { useEffect, useState } from "react";
import { Images, Animations } from "../../constants";
import Lottie from "lottie-react";
import { useNavigate } from "react-router";

const Register = () => {
  const [sunAnimation, setSunAnimation] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {
    // Fetch both animation files
    Promise.all([fetch(Animations.sun).then((response) => response.json())])
      .then(([headerData]) => {
        setSunAnimation(headerData);
      })
      .catch((error) => console.error("Failed to load animations:", error));
  }, []);
  return (
    <div className="w-full flex items-center justify-center h-full min-h-[100vh] px-12">
      <div className=" w-full relative sm:w-[550px] flex flex-col items-center gap-10 md:w-[700px] bg-slate-100 px-8 py-8 lg:w-[800px] rounded-lg shadows-lg justify-center shadow-2xl min-h-[70vh]">
        <Lottie
          animationData={sunAnimation}
          loop={true}
          className="w-30 z-50 absolute top-5 right-5 md:w-35"
          style={{ background: "transparent" }}
        />
        <img src={Images.mainLogo} alt="Logo" className="w-[200px]" />
        <div className="flex flex-col w-full items-center gap-6">
          <div className="flex flex-col w-2/3">
            <label className="text-sm md:text-lg font-bold text-gray-700 mb-2">
              Name <span className="text-red-500 text-lg">*</span>
            </label>
            <input
              placeholder="Enter Your Name"
              className="bg-white px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#6cd454] focus:ring-2 focus:ring-[#6cd454] focus:outline-none transition duration-200"
            />
          </div>

          <div className="flex flex-col w-2/3">
            <label className="text-sm md:text-lg font-bold text-gray-700 mb-2">
              Code <span className="text-red-500 text-lg">*</span>
            </label>
            <input
              placeholder="Enter Your NIC"
              className="bg-white px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#6cd454] focus:ring-2 focus:ring-[#6cd454] focus:outline-none transition duration-200"
            />
          </div>
        </div>
        <button
          onClick={() => Navigate("/user")}
          className="bg-[#6cd454] w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 transition-all"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
