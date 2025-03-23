import React, { useEffect, useState } from "react";
import { Images, Animations } from "../../constants";
import Lottie from "lottie-react";
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

const User = () => {
  const [sunAnimation, setSunAnimation] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [isOpenPromtArea, setIsOpenPromtArea] = useState(false);
  const [viewPreviousImages, setViewPreviousImages] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [showSample, setShowSample] = useState(false);
  const [prevImages, setPrevImages] = useState([
    Images.sample1,
    Images.sample2,
  ]);
  const [sampleImage, setSampleImage] = useState(
    "https://picsum.photos/200/300"
  );
  const [isOpenShareIcons, setIsOpenShareIcons] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    // Fetch both animation files
    Promise.all([fetch(Animations.sun).then((response) => response.json())])
      .then(([headerData]) => {
        setSunAnimation(headerData);
      })
      .catch((error) => console.error("Failed to load animations:", error));
  }, []);

  const HandelLogOutButon = () => {
    Navigate("/");
  };

  const HandelGenerateButton = () => {
    if (!isOpenPromtArea) {
      setIsOpenPromtArea(true); // Open prompt area if it's not open
    } else {
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
  };

  const HandelShareButtonClick = () => {
    setIsOpenShareIcons(true);
  };

  return (
    <div
      className={`w-full flex items-center justify-center h-full min-h-[100vh] px-12 ${
        isLoad ? "bg-black/50 z-50" : " z-0"
      }`}
    >
      <div className=" w-full relative sm:w-[550px] flex flex-col items-center gap-10 md:w-[700px] bg-slate-100 px-8 py-8 lg:w-[800px] rounded-lg shadows-lg justify-center shadow-2xl min-h-[70vh]">
        <button
          onClick={HandelLogOutButon}
          className="cursor-pointer px-4 py-2 bg-[#c1d6bb] text-slate-900 hover:text-red-500 transition-all duration-300 rounded-lg font-semibold z-50 absolute top-5 left-5 "
        >
          Log Out
        </button>
        {isOpenPromtArea && sampleImage && (
          <button
            onClick={HandelBackButton}
            className="cursor-pointer px-4 py-2 bg-[#c1d6bb] text-slate-900 hover:text-red-500 transition-all duration-300 rounded-lg font-semibold z-50 absolute bottom-5 left-5 "
          >
            Back
          </button>
        )}

        <Lottie
          animationData={sunAnimation}
          loop={true}
          className="w-30 z-50 absolute top-5 right-5 md:w-35"
          style={{ background: "transparent" }}
        />
        <img src={Images.mainLogo} alt="Logo" className="w-[200px]" />
        {!isOpenPromtArea && !showSample && (
          <span className="text-[2rem] font-bold text-center text-slate-900">
            Hi Kamal
          </span>
        )}
        {isOpenPromtArea && !isLoad && !showSample && (
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">
                Enter Prompt
              </span>
              <span className="text-sm text-red-500 font-medium">
                Attempts Left: {attemptsLeft}
              </span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6cd454]"
              placeholder="Type your prompt here..."
            />
          </div>
        )}
        {isLoad && <Loader />}
        {showSample && (
          <img
            src={sampleImage || Images.sample3}
            alt="Sample "
            className="w-full max-w-[300px] max-h-[300px] rounded-lg shadow-lg"
          />
        )}

        <div className="w-full flex  flex-col items-center gap-5">
          {showSample && (
            <button
              onClick={HandelShareButtonClick}
              className={`bg-[#6cd454] w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 transition-all ${
                isOpenShareIcons ? "hidden" : ""
              }`}
            >
              Share
            </button>
          )}
          <button
            onClick={HandelGenerateButton}
            className={`bg-[#6cd454] w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 transition-all ${
              showSample ? "hidden" : ""
            }`}
          >
            {!isOpenPromtArea && !showSample ? "Generate" : "Send"}
          </button>
          {isOpenPromtArea && (
            <button
              disabled={isLoad}
              onClick={HandelViewPreviousImages}
              className="bg-[#6cd454] w-2/3 px-5 py-3 rounded-lg text-white text-[16px] cursor-pointer font-bold hover:text-black duration-300 transition-all"
            >
              View Previous Generations
            </button>
          )}
        </div>
        {viewPreviousImages && (
          <div className="fixed inset-0 flex items-center bg-black/50 justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative">
              <button
                onClick={ClosePreviousImages}
                className="absolute top-2 right-2 text-red-500 cursor-pointer text-xl font-bold"
              >
                ❌
              </button>
              <div className="w-full flex flex-wrap gap-4 mt-6 justify-center">
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
        {isOpenShareIcons && showSample && (
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
                  url={sampleImage}
                  subject="Check this image"
                  body="Hey, check this out!"
                >
                  <EmailIcon size={50} round />
                </EmailShareButton>

                <FacebookShareButton url={sampleImage}>
                  <FacebookIcon size={50} round />
                </FacebookShareButton>

                <WhatsappShareButton
                  url={sampleImage}
                  title="Check out this image"
                >
                  <WhatsappIcon size={50} round />
                </WhatsappShareButton>

                <TwitterShareButton
                  url={sampleImage}
                  title="Check out this image"
                >
                  <TwitterIcon size={50} round />
                </TwitterShareButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
