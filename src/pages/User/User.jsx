import React, { useState, useRef } from "react";
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
import { Recaptcha, FAQ } from "../../components/atoms";
import { CgLogOff } from "react-icons/cg";
import { MdOutlineArrowBack } from "react-icons/md";
import { PromptValidation } from "../../validations";
import { FaQuestionCircle } from "react-icons/fa";

const User = () => {
  //const [sunAnimation, setSunAnimation] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [isOpenPromtArea, setIsOpenPromtArea] = useState(false);
  const [viewPreviousImages, setViewPreviousImages] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [showSample, setShowSample] = useState(false);
  const [prevImages, setPrevImages] = useState([
    Images.sample1,
    Images.sample2,
    Images.sample3,
    Images.sample4,
    Images.sample5,
    Images.sample6,
    Images.sample7,
    Images.sample8,
  ]);
  const [sampleImage, setSampleImage] = useState(
    "https://picsum.photos/200/300"
  );
  const [finalImage, setFinalImage] = useState("");
  const [isOpenShareIcons, setIsOpenShareIcons] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const Navigate = useNavigate();
  const canvasRef = useRef(null);

  // useEffect(() => {
  //   // Fetch both animation files
  //   Promise.all([fetch(Animations.sun).then((response) => response.json())])
  //     .then(([headerData]) => {
  //       setSunAnimation(headerData);
  //     })
  //     .catch((error) => console.error("Failed to load animations:", error));
  // }, []);

  const HandelLogOutButon = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      Navigate("/");
    }
  };

  const HandelGenerateButton = () => {
    if (!isOpenPromtArea) {
      setIsOpenPromtArea(true); // Open prompt area if it's not open
    } else {
      if (!prompt) {
        alert("Please enter your prompt.");
        return;
      }
      if (!recaptchaVerified) {
        alert("Please verify the reCAPTCHA.");
        return;
      }

      const promptValidation = PromptValidation(prompt);

      if (!promptValidation) {
        alert("Please enter valid prompt.");
        return;
      }

      setIsLoad(true); // Start loading while the image is being generated
      setTimeout(() => {
        setIsLoad(false); // Stop loading after 2 seconds
        setShowSample(true); // Show the generated image (or sample)
      }, 2000);
    }
  };

  const HandelViewPreviousImages = () => {
    setViewPreviousImages(true);
  };

  const ClosePreviousImages = () => {
    setViewPreviousImages(false);
  };

  const HandelSelectPreviousImage = (img) => {
    // Save the currently selected sample image back into the previous images array before setting the new one
    setPrevImages((prevImages) => {
      // Add the current sample image (if any) back to the previous images list
      if (sampleImage) {
        return [...prevImages, sampleImage];
      }
      return prevImages;
    });

    // Set the new image as the selected sample image
    setSampleImage(img);

    // Remove the selected image from the previous images list
    setPrevImages((prevImages) => prevImages.filter((image) => image !== img));

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
    setAttemptsLeft(3);
    setRecaptchaVerified(false);
    setIsFAQOpen(false);
  };

  const HandelShareButtonClick = () => {
    mergeImageWithFrame();
    setIsOpenShareIcons(true);
  };

  // Function to merge images
  const mergeImageWithFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const generatedImg = new Image();
    generatedImg.crossOrigin = "anonymous";
    generatedImg.src = sampleImage;

    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = Images.frame;

    generatedImg.onload = () => {
      frameImg.onload = () => {
        canvas.width = generatedImg.width;
        canvas.height = generatedImg.height;

        ctx.drawImage(generatedImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

        // Convert canvas to Blob
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            setFinalImage(blobUrl); // Use Blob URL instead of Base64
          }
        }, "image/png");
      };
    };
  };

  return (
    <div
      className={`w-full flex items-center justify-center h-full min-h-[100vh] px-6 sm:px-12 ${
        isLoad ? "bg-black/50 z-50" : " z-0"
      }`}
      style={{
        backgroundImage: `url( ${Images.backGroundPage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <div className=" w-full relative sm:w-[550px] flex flex-col items-center gap-10 md:w-[700px] bg-slate-100 px-8 py-8 lg:w-[800px] rounded-lg shadows-lg justify-center shadow-2xl min-h-[70vh]">
        <button
          onClick={HandelLogOutButon}
          className="cursor-pointer w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] flex items-center justify-center text-2xl sm:text-3xl bg-[#c1d6bb] text-slate-900 hover:text-red-500 transition-all duration-300 rounded-lg font-semibold z-50 absolute top-5 right-5"
        >
          <CgLogOff />
        </button>
        <div className="absolute top-5 left-5 flex items-center  gap-5">
          {isOpenPromtArea && sampleImage && (
            <button
              onClick={HandelBackButton}
              className="cursor-pointer w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] flex items-center justify-center text-2xl sm:text-3xl bg-[#c1d6bb] text-slate-900 hover:text-red-500 transition-all duration-300 rounded-lg font-semibold z-50"
            >
              <MdOutlineArrowBack />
            </button>
          )}
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
            Hi Kamal
          </span>
        )}

        {/* Prompt Section */}
        {isOpenPromtArea && !isLoad && !showSample && !isFAQOpen && (
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] sm:text-lg font-semibold text-slate-900">
                Enter Prompt
              </span>
              <span className="text-[15px] sm:text-sm text-red-500 font-medium">
                Attempts Left: {attemptsLeft}
              </span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6cd454]"
              placeholder="Type your prompt here..."
            />
            <div className="flex items-center justify-center w-full">
              <Recaptcha onVerify={setRecaptchaVerified} />
            </div>
          </div>
        )}

        {/* Loader */}
        {isLoad && !isFAQOpen && <Loader />}

        {/* Generate Image Section */}
        {showSample && !isFAQOpen && (
          <div className="relative max-w-[300px] max-h-[300px]">
            <img
              src={sampleImage}
              alt="Generated"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <img
              src={Images.frame}
              alt="Frame"
              className="absolute top-0 left-0 w-full h-full rounded-b-lg pointer-events-none"
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
                {prevImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Sample ${index + 1}`}
                    onClick={() => HandelSelectPreviousImage(img)}
                    className="w-1/3 max-w-[150px] max-h-[150px] rounded-lg cursor-pointer shadow-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {isOpenShareIcons && showSample && !isFAQOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-7/12 max-w-lg relative">
              <button
                onClick={() => setIsOpenShareIcons(false)} // Close the share popup
                className="absolute top-2 right-2 text-red-500 cursor-pointer text-xl font-bold"
              >
                ❌
              </button>
              <div className="w-full flex flex-wrap gap-5 mt-6 justify-center">
                {/* Share buttons */}
                <EmailShareButton
                  url={finalImage}
                  subject="Check this image"
                  body="Hey, check this out!"
                  className="hover:scale-110 duration-300 transition-all"
                >
                  <EmailIcon size={50} round />
                </EmailShareButton>

                <FacebookShareButton
                  url={finalImage}
                  hashtag="#GeneratedImage"
                  className="hover:scale-110 duration-300 transition-all"
                >
                  <FacebookIcon size={50} round />
                </FacebookShareButton>

                <WhatsappShareButton
                  url={finalImage}
                  title="Check out this image"
                  className="hover:scale-110 duration-300 transition-all"
                >
                  <WhatsappIcon size={50} round />
                </WhatsappShareButton>

                <TwitterShareButton
                  url={finalImage}
                  title="Check out this image"
                  className="hover:scale-110 duration-300 transition-all"
                >
                  <TwitterIcon size={50} round />
                </TwitterShareButton>
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
