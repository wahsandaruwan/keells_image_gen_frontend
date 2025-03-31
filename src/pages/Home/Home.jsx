import React, { useRef, useState, useEffect } from "react";
import { Images, Animations } from "../../constants";
import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import { Recaptcha } from "../../components/atoms";
import { MobileNumberValidation } from "../../validations";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FAQData } from "../../data";

const Home = () => {
  const [sunAnimation, setSunAnimation] = useState(null);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [OTP, setOTP] = useState(["", "", "", ""]);
  const [showOTP, setShowOTP] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [mobile, setMobile] = useState("");
  const inputsRef = useRef([]);
  const Navigate = useNavigate();

  const HandleButtonClick = () => {
    const mobileValidation = MobileNumberValidation(mobile);

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

    if (isOTPOpen && !showOTP) {
      setIsOTPOpen(false);
      setShowOTP(true);
      return;
    }
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

  const HandelVerifyButtonClick = () => {
    if (OTP.some((digit) => digit === "")) {
      alert("Please enter OTP.");
      return;
    }
    Navigate("/register");
  };
  return (
    <div
      className={`w-full flex items-center justify-center h-full min-h-[100vh] px-6 sm:px-12 `}
      style={{
        backgroundImage: `url( ${Images.backGroundPage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
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
          <img
            src={Images.backGround}
            alt="Keells Awrudu"
            className="min-w-[320px] w-[390px] h-auto overflow-hidden"
            style={{
              overflow: "hidden",
            }}
          />
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
        {showOTP && (
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
        )}

        {/* FAQ Section */}
        {isFAQOpen && (
          <div className="w-full sm:w-2/3 max-h-[600px] mt-16">
            <h2 className="text-[15px] sm:text-[16px] font-bold text-center">
              Frequently Asked Questions
            </h2>
            <div className="w-full space-y-3 overflow-y-auto mt-4 max-h-[200px]">
              {FAQData.map((faq, index) => (
                <div key={index} className="border-b pb-3">
                  <button
                    onClick={() =>
                      setExpandedQuestion(
                        expandedQuestion === index ? null : index
                      )
                    }
                    className="w-full flex justify-between items-center py-2 text-left font-medium text-[13px] sm:text-[14px] focus:outline-none"
                  >
                    {faq.question}
                    {expandedQuestion === index ? (
                      <FaChevronUp className="text-gray-600" />
                    ) : (
                      <FaChevronDown className="text-gray-600" />
                    )}
                  </button>
                  {expandedQuestion === index && (
                    <p className="text-gray-700 mt-2 text-[13px] sm:text-[14px]">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isFAQOpen && (
          <button
            onClick={() => setIsFAQOpen(false)}
            className={`bg-[#6cd454] w-9/12 sm:mt-0 sm:w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 hover:bg-[#aae49d] transition-all`}
          >
            Close
          </button>
        )}
        <button
          onClick={HandleButtonClick}
          className={`bg-[#6cd454] w-9/12 sm:mt-0 sm:w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 hover:bg-[#aae49d] transition-all ${
            showOTP || isFAQOpen ? "hidden" : ""
          }`}
        >
          {isOTPOpen && !showOTP
            ? "Send"
            : !isOTPOpen && !showOTP
            ? "Generate"
            : ""}
        </button>
      </div>
    </div>
  );
};

export default Home;
