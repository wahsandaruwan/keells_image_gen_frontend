import React, { useState, useRef, useEffect } from "react";
import { Images, Animations } from "../../constants";
//import Lottie from "lottie-react";
import { useNavigate } from "react-router";
import { Loader } from "../../components/atoms";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailIcon,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
} from "react-share";
import { FAQ } from "../../components/atoms";
import { CgLogOff } from "react-icons/cg";
import { MdOutlineArrowBack } from "react-icons/md";
import { PromptValidation } from "../../validations";
import { FaQuestionCircle } from "react-icons/fa";
import { useBaseUrl } from "../../context/BaseUrl/BaseUrlContext";
import axios from "axios";

const User = () => {
  //const [sunAnimation, setSunAnimation] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const userName = localStorage.getItem("playerName");
  const [isOpenPromtArea, setIsOpenPromtArea] = useState(false);
  const [viewPreviousImages, setViewPreviousImages] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [showSample, setShowSample] = useState(false);
  const [prevImages, setPrevImages] = useState([]);
  const [generatedImage, setGeneratedImage] = useState(null); // here sample image measn generated image
  const [isOpenShareIcons, setIsOpenShareIcons] = useState(false);
  //const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const Navigate = useNavigate();
  const canvasRef = useRef(null);
  const storedMobile = localStorage.getItem("userMobile");
  const playerToken = localStorage.getItem("playerToken");
  const { baseUrl } = useBaseUrl();

  useEffect(() => {
    if (playerToken) {
      Navigate("/user");
      return;
    } else if (!playerToken && !storedMobile) {
      Navigate("/");
      return;
    }
  }, []);

  const HandelLogOutButon = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("playerToken");
      localStorage.removeItem("userMobile");
      localStorage.removeItem("playerName");
      Navigate("/");
    }
  };

  const HandelGenerateButton = () => {
    GetGenerateAttempts().then(() => {
      if (!isOpenPromtArea) {
        setIsOpenPromtArea(true); // Open prompt area if it's not open
      } else {
        if (!prompt) {
          alert("Please enter your prompt.");
          return;
        }

        //const promptValidation = PromptValidation(prompt);

        // if (!promptValidation) {
        //   alert("Please enter valid prompt.");
        //   return;
        // }
        GenerateImage();
      }
    });
  };

  const HandelViewPreviousImages = () => {
    setViewPreviousImages(true);
    GetPreviousImages();
  };

  const ClosePreviousImages = () => {
    setViewPreviousImages(false);
  };

  const HandelSelectPreviousImage = (img) => {
    // Save the currently selected sample image back into the previous images array before setting the new one
    setPrevImages((prevImages) => {
      // Add the current sample image (if any) back to the previous images list
      if (generatedImage) {
        return [...prevImages, generatedImage];
      }
      return prevImages;
    });

    // Set the new image as the selected sample image
    setGeneratedImage(img);

    // console.log(prevImages);
    // // Remove the selected image from the previous images list
    // setPrevImages((prevImages) => prevImages.filter((image) => image.imageName !== img));

    // Show the sample image after selection
    setShowSample(true);

    // Close the popup after selecting an image
    setViewPreviousImages(false);
  };

  const HandelBackButton = () => {
    setIsOpenPromtArea(false);
    setIsOpenShareIcons(false);
    setViewPreviousImages(false);
    setShowSample(false);
    setIsLoad(false);
    setPrompt("");
    setAttemptsLeft(0);
    setIsFAQOpen(false);
  };

  // const HandelShareButtonClick = async () => {
  //   if (!generatedImage) return;

  //   const hashtags = "#AIArt #GeneratedImage #CreativeAI #DigitalArt";
  //   const shareData = {
  //     title: "Generated Image",
  //     text: `Check out this AI-generated image! ${hashtags}`,
  //     url: generatedImage,
  //   };

  //   try {
  //     await navigator.share(shareData);
  //   } catch (error) {
  //     console.error("Error sharing image URL:", error);
  //   }
  // };

  const HandelShareButtonClick = async () => {
    if (!generatedImage) return;

    try {
      // Fetch the image as a blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();

      // Create a file from the blob
      const file = new File([blob], "generated-image.png", { type: blob.type });

      // Define share data with the image file
      const hashtags = "#AIArt #GeneratedImage #CreativeAI #DigitalArt";
      const shareData = {
        title: "Generated Image",
        text: `Check out this AI-generated image! ${hashtags}`,
        files: [file], // Attach the actual image file
      };

      // Share the image
      await navigator.share(shareData);
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };

  // Function to get generate attempts count
  const GetGenerateAttempts = async () => {
    const data = {
      phoneNumber: storedMobile,
    };
    try {
      const response = await axios.post(`${baseUrl}/players/getplayer`, data);

      if (response.data.status) {
        setAttemptsLeft(response.data.player.generateAttempts);
      }
    } catch (error) {
      alert(error.response.data.message);
      console.error(error);
    }
  };

  // ---------- Function to Generate Image ----------
  const GenerateImage = async () => {
    const data = {
      userPrompt: prompt,
      playerToken: playerToken,
      phoneNumber: storedMobile,
    };
    setIsLoad(true);
    try {
      const response = await axios.post(`${baseUrl}/image/generateimage`, data);

      if (response.data.status) {
        const imageUrl = `https://keellsavuruduai.keellssuper.com/downloads/${response.data.imageName}`;

        setShowSample(true);
        setGeneratedImage(imageUrl);
      }
    } catch (error) {
      alert("Failed to generate the image, try again!");
      console.error(error);
    } finally {
      setIsLoad(false); // Ensure loading stops after request is completed
    }
  };

  // ---------- Function to get previous Images ----------
  const GetPreviousImages = async () => {
    const data = {
      phoneNumber: storedMobile,
    };

    setIsLoad(true);
    try {
      const response = await axios.post(`${baseUrl}/image/getimages`, data);

      if (response.data.status && response.data.images?.length > 0) {
        let tempArr = [];
        response.data.images.forEach((item) => {
          tempArr.push({
            ...item, // Spread the existing object properties
            imageName: `https://keellsavuruduai.keellssuper.com/downloads/${item.imageName}`, // Modify imageName
          });
        });
        console.log(tempArr);
        setPrevImages(tempArr);
      } else {
        setPrevImages([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoad(false); // Ensure loading stops after request is completed
    }
  };

  return (
    <div
      className={`w-full flex items-center justify-center h-full min-h-[100vh] px-6 sm:px-12 ${
        isLoad ? "bg-black/50 z-50" : " z-0"
      }`}
    >
      <div className=" w-full relative sm:w-[550px] flex flex-col items-center gap-10 md:w-[700px] bg-slate-100 px-8 py-8 lg:w-[800px] rounded-lg shadows-lg justify-center shadow-2xl min-h-[70vh]">
        <button
          onClick={HandelLogOutButon}
          className="cursor-pointer w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] flex items-center justify-center text-2xl sm:text-3xl bg-[#c1d6bb] text-slate-900 hover:text-red-500 transition-all duration-300 rounded-lg font-semibold z-50 absolute top-5 right-5"
        >
          <CgLogOff />
        </button>
        <div className="absolute top-5 left-5 flex items-center  gap-5">
          {isOpenPromtArea || generatedImage ? (
            <button
              onClick={HandelBackButton}
              className="cursor-pointer w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] flex items-center justify-center text-2xl sm:text-3xl bg-[#c1d6bb] text-slate-900 hover:text-red-500 transition-all duration-300 rounded-lg font-semibold z-50"
            >
              <MdOutlineArrowBack />
            </button>
          ) : null}
          {!isFAQOpen && !isOpenPromtArea && (
            <button
              onClick={() => setIsFAQOpen(true)}
              className="cursor-pointer w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] flex items-center justify-center text-2xl sm:text-3xl bg-[#c1d6bb] text-slate-900 hover:text-red-500 transition-all duration-300 rounded-lg font-semibold z-50 "
            >
              <FaQuestionCircle />
            </button>
          )}
        </div>

        {/* <Lottie
          animationData={sunAnimation}
          loop={true}
          className="w-30 z-50 absolute top-5 right-5 md:w-35"
          style={{ background: "transparent" }}
        /> */}
        <img
          src={Images.mainLogo}
          alt="Logo"
          className="sm:w-[200px] w-[120px]"
        />

        {/* Start Section */}
        {!isOpenPromtArea && !showSample && !isFAQOpen && (
          <span className="sm:text-[2rem] text-[1.3rem] font-bold text-center text-slate-900">
            Hi {userName}
          </span>
        )}

        {/* Prompt Section */}
        {isOpenPromtArea && !isLoad && !showSample && !isFAQOpen && (
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] sm:text-lg font-semibold text-slate-900">
                Enter Prompt
              </span>
              <span className="text-[15px] sm:text-sm font-medium">
                Attempts Left: {attemptsLeft}
              </span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-3 rounded-lg resize-none border-2 border-gray-300 focus:border-[#6cd454] focus:ring-2 focus:ring-[#6cd454] focus:outline-none"
              placeholder="Type your prompt here..."
            />
            {/* <div className="flex items-center justify-center w-full">
              <Recaptcha onVerify={setRecaptchaVerified} />
            </div> */}
          </div>
        )}

        {/* Loader */}
        {isLoad && !isFAQOpen && <Loader />}

        {/* Generate Image Section */}
        {showSample && !isFAQOpen && (
          <div className="relative max-w-[300px] max-h-[300px]">
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
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

        {/* Sample Image Section */}
        <div className="w-full flex  flex-col items-center gap-5">
          {showSample && !isFAQOpen && (
            <button
              onClick={HandelShareButtonClick}
              className={`bg-[#6cd454] w-full sm:w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black hover:bg-[#aae49d] duration-300 transition-all ${
                isOpenShareIcons ? "hidden" : ""
              }`}
            >
              Share
            </button>
          )}
          {!isFAQOpen && (
            <button
              onClick={HandelGenerateButton}
              className={`bg-[#6cd454] w-full sm:w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black hover:bg-[#aae49d] duration-300 transition-all ${
                showSample ? "hidden" : ""
              }`}
            >
              {!isOpenPromtArea && !showSample ? "Generate" : "Send"}
            </button>
          )}
          {isOpenPromtArea && !isFAQOpen && (
            <button
              disabled={isLoad}
              onClick={HandelViewPreviousImages}
              className="bg-[#6cd454] w-full sm:w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black hover:bg-[#aae49d] duration-300 transition-all"
            >
              View Previous Generations
            </button>
          )}
        </div>
        {viewPreviousImages && !isFAQOpen && (
          <div className="fixed inset-0 flex items-center bg-black/50 justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative">
              <button
                onClick={ClosePreviousImages}
                className="absolute top-2 right-2 text-red-500 cursor-pointer text-xl font-bold"
              >
                ❌
              </button>
              <div className="w-full max-h-[300px] overflow-y-auto flex flex-wrap gap-4 mt-6 justify-center">
                {prevImages.length > 0 ? (
                  prevImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.imageName}
                      alt={`Image ${index + 1}`}
                      onClick={() => HandelSelectPreviousImage(img.imageName)}
                      className="w-1/3 max-w-[150px] max-h-[150px] rounded-lg cursor-pointer shadow-lg"
                    />
                  ))
                ) : (
                  <div className="w-full h-[50px] flex items-center justify-center">
                    <p className="font-semibold">No Images Found!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default User;
