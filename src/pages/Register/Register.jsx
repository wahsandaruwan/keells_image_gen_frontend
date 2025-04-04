import React, { useEffect, useState } from "react";
import { Images, Animations } from "../../constants";
import Lottie from "lottie-react";
import ReactGA from "react-ga4";
import { useNavigate } from "react-router";
import { FAQ } from "../../components/atoms";
import { UserNameValidation } from "../../validations";
import { FaQuestionCircle } from "react-icons/fa";
import { useBaseUrl } from "../../context/BaseUrl/BaseUrlContext";
import axios from "axios";

const Register = () => {
  const [sunAnimation, setSunAnimation] = useState(null);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  //const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [UserName, setUserName] = useState("");
  const storedMobile = localStorage.getItem("userMobile");
  const { baseUrl } = useBaseUrl();
  const Navigate = useNavigate();

  const playerToken = localStorage.getItem("playerToken");

  useEffect(() => {
    if (playerToken) {
      Navigate("/user");
      return;
    } else if (!playerToken && !storedMobile) {
      Navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    // Fetch both animation files
    Promise.all([fetch(Animations.sun).then((response) => response.json())])
      .then(([headerData]) => {
        setSunAnimation(headerData);
      })
      .catch((error) => console.error("Failed to load animations:", error));
  }, []);

  const HandelRegisterButton = () => {
    const userNameValidation = UserNameValidation(UserName);
    if (!UserName) {
      alert("Please enter your user name .");
      return;
    }
    // if (!recaptchaVerified) {
    //   alert("Please verify the reCAPTCHA.");
    //   return;
    // }
    if (!userNameValidation) {
      alert("Please enter valid user name .");
      return;
    }
    RegisterUser();
  };

  // ---------- Function to Register  new user ----------
  const RegisterUser = async () => {
    const data = {
      phoneNumber: storedMobile,
      name: UserName,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/players/registeruser`,
        data
      );

      if (response.data.status) {
        localStorage.setItem("playerToken", response.data.user.playerToken);
        localStorage.setItem("playerName", response.data.user.name);
        Navigate("/user");
        ReactGA.event({
          category: "Authentication",
          action: "Registration",
          label: "Successfull Registration",
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full flex items-center justify-center h-full min-h-[100vh] px-6 sm:px-12">
      <div className=" w-full relative sm:w-[550px] flex flex-col items-center gap-10 md:w-[700px] bg-slate-100 px-8 py-8 lg:w-[800px] rounded-lg shadows-lg justify-center shadow-2xl min-h-[70vh]">
        <Lottie
          animationData={sunAnimation}
          loop={true}
          className="sm:w-30 w-[60px] z-50 absolute top-5 right-5 md:w-35"
          style={{ background: "transparent" }}
        />
        <img
          src={Images.mainLogo}
          alt="Logo"
          className="sm:w-[200px] w-[120px]"
        />

        {!isFAQOpen && (
          <button
            onClick={() => setIsFAQOpen(true)}
            className="cursor-pointer w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] flex items-center justify-center text-2xl sm:text-3xl text-slate-900 hover:text-red-500 transition-all duration-300 rounded-lg font-semibold z-50 absolute top-5 left-5"
          >
            <FaQuestionCircle />
          </button>
        )}

        {/* Regitser Section */}
        {!isFAQOpen && (
          <div className="flex flex-col w-full items-center gap-6">
            <div className="flex flex-col w-full sm:w-2/3">
              <label className="text-sm md:text-lg font-bold text-gray-700 mb-2">
                User Name <span className="text-red-500 text-lg">*</span>
              </label>
              <input
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter Your User Name"
                className="bg-white px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#6cd454] focus:ring-2 focus:ring-[#6cd454] focus:outline-none transition duration-200"
              />
            </div>

            {/* <Recaptcha onVerify={setRecaptchaVerified} /> */}
          </div>
        )}

        {/* FAQ Section */}
        {isFAQOpen && <FAQ />}
        {isFAQOpen && (
          <button
            onClick={() => setIsFAQOpen(false)}
            className={`bg-[#6cd454] w-9/12 sm:mt-0 sm:w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 hover:bg-[#aae49d] transition-all`}
          >
            Close
          </button>
        )}

        {!isFAQOpen && (
          <button
            onClick={HandelRegisterButton}
            className="bg-[#6cd454] w-full sm:w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black hover:bg-[#aae49d] duration-300 transition-all"
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
};

export default Register;
