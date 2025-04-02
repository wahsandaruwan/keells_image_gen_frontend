import React, { useRef, useState, useEffect } from "react";
import { Images, Animations } from "../../constants";
import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import { Recaptcha, FAQ } from "../../components/atoms";
import { MobileNumberValidation } from "../../validations";
import { FaQuestionCircle } from "react-icons/fa";
import { useBaseUrl } from "../../context/BaseUrl/BaseUrlContext";
import axios from "axios";

const Home = () => {
  const [sunAnimation, setSunAnimation] = useState(null);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [OTP, setOTP] = useState(["", "", "", ""]);
  const [showOTP, setShowOTP] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [mobile, setMobile] = useState("");
  const [mobileStatus, setMobileStatus] = useState("");
  const inputsRef = useRef([]);
  const Navigate = useNavigate();

  const playerToken = localStorage.getItem("playerToken");

  const { baseUrl } = useBaseUrl();

  // useEffect(() => {
  //   if(playerToken){
  //     Navigate("/user");
  //   }
  // },[playerToken]);

  const HandleButtonClick = () => {
    const mobileValidation = MobileNumberValidation(mobile);

    if (playerToken) {
      Navigate("/user");
      return;
    }

    if (!isOTPOpen) {
      setIsOTPOpen(true);
      return;
    }
    if (!mobile) {
      alert("Please enter your mobile number.");
      return;
    }
    if (!recaptchaVerified) {
      alert("Please verify the reCAPTCHA.");
      return;
    }
    if (!mobileValidation) {
      alert("Please enter valid mobile number.");
      return;
    }

    CheckMobileNumberAvailability();

    // if (isOTPOpen && !showOTP) {
    //   setIsOTPOpen(false);
    //   setShowOTP(true);
    //   return;
    // }
  };

  useEffect(() => {
    // Fetch both animation files
    Promise.all([fetch(Animations.sun).then((response) => response.json())])
      .then(([headerData]) => {
        setSunAnimation(headerData);
      })
      .catch((error) => console.error("Failed to load animations:", error));
  }, []);

  const HandleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOTP = [...OTP];
      newOTP[index] = value;
      setOTP(newOTP);

      // Move to next input if value is entered
      if (value && index < OTP.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  // ---------- Function to check mobile number availability ----------
  const CheckMobileNumberAvailability = async () => {
    const data = {
      phoneNumber: mobile,
    };

    try {
      const response = await axios.post(`${baseUrl}/players/checkphone`, data);

      console.log(response);
      if (response.data.status) {
        setMobileStatus(response.data.phoneExist);
        setIsOTPOpen(false);
        setShowOTP(true);
        localStorage.setItem("userMobile", mobile);
        GetOTPCode();
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------- Function to get otp code ----------
  const GetOTPCode = async () => {
    const data = {
      phoneNumber: mobile,
    };

    try {
      const response = await axios.post(`${baseUrl}/otp/generateotp`, data);

      if (response.data.status) {
        //ValidateOTPCode();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------- Function to verify button click ----------
  const HandelVerifyButtonClick = () => {
    if (OTP.some((digit) => digit === "")) {
      alert("Please enter OTP.");
      return;
    }
    ValidateOTPCode();
  };

  // ---------- Function to validate otp code ----------
  const ValidateOTPCode = async () => {
    const data = {
      phoneNumber: mobile,
      otpCode: OTP.join(""),
    };
    console.log(data);
    try {
      const response = await axios.post(`${baseUrl}/otp/validateotp`, data);

      if (response.data.status && !mobileStatus) {
        alert("OTP validated successfully!");
        Navigate("/register");
        return;
      } else if (response.data.status && mobileStatus) {
        alert("OTP validated successfully!");
        LoginUser();
        return;
      } else {
        alert("Enter valid OTP");
        setOTP(["", "", "", ""]);
        return;
      }
    } catch (error) {
      alert(error.response.data.message);
      console.error(error);
    }
  };

  // ---------- Function to Login User ----------
  const LoginUser = async () => {
    const data = {
      phoneNumber: mobile,
    };

    try {
      const response = await axios.post(`${baseUrl}/players/loginuser`, data);
      if (response.data.status) {
        localStorage.setItem("playerToken", response.data.user.playerToken);
        localStorage.setItem("playerName", response.data.user.name);
        localStorage.setItem("userMobile", response.data.user.phoneNumber);
        Navigate("/user");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`w-full flex items-center justify-center h-full min-h-[100vh] px-6 sm:px-12 `}
    >
      <div
        className={`w-full h-full relative sm:w-[550px] flex flex-col items-center justify-center gap-10 md:w-[700px] lg:w-[800px]  ${
          !isOTPOpen && !showOTP && !isFAQOpen
            ? "bg-transparent min-h-[100vh] sm:min-h-[70vh]"
            : "bg-slate-100 rounded-lg shadows-lg min-h-[70vh] px-8 py-8 shadow-2xl"
        }`}
      >
        {/* FAQ Button */}
        {(isOTPOpen || showOTP) && !isFAQOpen && (
          <button
            onClick={() => setIsFAQOpen(true)}
            className="cursor-pointer w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] flex items-center justify-center text-2xl sm:text-3xl text-slate-900 hover:text-red-500 transition-all duration-300 rounded-lg font-semibold z-50 absolute top-5 left-5"
          >
            <FaQuestionCircle />
          </button>
        )}

        {/* Home section */}
        {!isOTPOpen && !showOTP && !isFAQOpen && (
          <div
            style={{
              position: "relative",
              width: "350px",
              height: "550px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={Images.backGround}
              alt="Keells Awrudu"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                position: "absolute",
                objectFit: "cover",
                top: 0,
                left: 0,
              }}
            />
            <button
              style={{
                position: "relative",
                zIndex: 999,
                marginTop: "250px",
              }}
              onClick={HandleButtonClick}
              className={`bg-[#6cd454] w-6/12 sm:mt-0 sm:w-6/12 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 hover:bg-[#aae49d] transition-all ${
                showOTP || isFAQOpen ? "hidden" : ""
              }`}
            >
              {!isOTPOpen && !showOTP ? "Generate" : null}
            </button>
          </div>
        )}
        {
          <Lottie
            animationData={sunAnimation}
            loop={true}
            className={`sm:w-28 w-[60px] z-50 absolute top-5 right-5 md:w-32 ${
              !isOTPOpen && !showOTP ? "hidden" : ""
            }`}
            style={{ background: "transparent" }}
          />
        }

        {/* Get Mobile Number section */}
        {isOTPOpen && !showOTP && !isFAQOpen && (
          <div className="text-center flex flex-col items-center ">
            <span className="text-[15px] mt-10 sm:text-[16px] font-bold text-center">
              Please Enter Mobile Number To Get OTP
            </span>
            <input
              placeholder="Enter Mobile Number"
              onChange={(e) => setMobile(e.target.value)}
              maxLength="10"
              className="bg-white px-4 py-3 mt-5 text-[15px] sm:text-[16px] rounded-lg border-2 border-gray-300 focus:border-[#6cd454] focus:ring-2 focus:ring-[#6cd454] focus:outline-none transition duration-200"
            />
            <Recaptcha onVerify={setRecaptchaVerified} />
          </div>
        )}

        {/* OTP section */}
        {showOTP && !isFAQOpen ? (
          <div className="text-center flex flex-col items-center w-full ">
            <span className="text-[15px] sm:text-[16px] font-bold text-center">
              Enter OTP
            </span>
            <div className="flex items-center mt-5 justify-center gap-4">
              {OTP.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => HandleOtpChange(index, e.target.value)}
                  className="w-12 h-12  text-center text-xl font-bold border border-gray-400 rounded-lg focus:border-[#6cd454] focus:ring-2 focus:ring-[#6cd454] focus:outline-none transition duration-200"
                />
              ))}
            </div>
            <button
              onClick={HandelVerifyButtonClick}
              className="bg-[#6cd454] mt-10 w-full sm:w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black hover:bg-[#aae49d] duration-300 transition-all"
            >
              Verify
            </button>
          </div>
        ) : null}

        {/* FAQ Section */}
        {isFAQOpen && <FAQ />}

        {isFAQOpen && (
          <button
            onClick={() => setIsFAQOpen(false)}
            className={`bg-[#6cd454] w-6/12 sm:mt-0 sm:w-6/12 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 hover:bg-[#aae49d] transition-all`}
          >
            Close
          </button>
        )}
        {isOTPOpen && !showOTP ? (
          <button
            onClick={HandleButtonClick}
            className={`bg-[#6cd454] w-6/12 sm:mt-0 sm:w-6/12 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 hover:bg-[#aae49d] transition-all ${
              showOTP || isFAQOpen ? "hidden" : ""
            }`}
          >
            Send
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
