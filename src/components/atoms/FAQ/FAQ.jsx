import React, { useState } from "react";
import { useLocation } from "react-router";
import { FaArrowDown } from "react-icons/fa";

const FAQ = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const location = useLocation();

  // Handle scroll event
  const handleScroll = (event) => {
    const element = event.target;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight - element.clientHeight;
    const percentage = (scrollTop / scrollHeight) * 100;

    setScrollPercentage(percentage);
    setShowScrollHint(scrollTop < 10); // Hide hint after first scroll
  };

  return (
    <div
      className={`w-full sm:w-2/3 max-h-[600px] ${
        location.pathname === "/" ? "mt-16" : "mt-0"
      }`}
    >
      <h2 className="text-[15px] sm:text-[16px] font-bold text-center">
        Notes
      </h2>

      {/* Scroll Progress Bar */}
      <div
        className="h-1 bg-[#6cd454] transition-all sm:hidden mt-2 duration-200"
        style={{ width: `${scrollPercentage}%` }}
      ></div>

      {/* Scrollable Content */}
      <div
        className={`relative w-full mt-4 ${
          location.pathname == "/user" ? "max-h-[230px]" : "max-h-[300px]"
        } overflow-y-scroll px-4 py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100`}
        onScroll={handleScroll}
      >
        {/* Scroll Hint (Hidden after first scroll) */}
        {showScrollHint && (
          <div className="absolute bottom-2 left-1/2 sm:hidden transform -translate-x-1/2 animate-bounce text-gray-500">
            <FaArrowDown size={20} />
          </div>
        )}

        {/* FAQ Content */}
        <p className="mb-2">
          Keells Avurudu AI supports English, සිංහල, and தமிழ், ensuring an
          inclusive experience for all users.
        </p>
        <p className="mb-2">
          To generate high-quality AI images, be specific and detailed in your
          prompt.
        </p>
        <p className="mb-2">Use Concise and Structured Language</p>
        <p className="mb-2">❌ "A New Year food table"</p>
        <p className="mb-2">
          ✅ "Sinhala New Year feast with kiribath, kokis, kavum, sweet mung
          kavum, fresh fruits, and a glowing clay oil lamp."
        </p>
        <p>
          Keells Avurudu AI also includes safeguards to protect minors,
          restricting queries that could generate outputs related to children.
          We are committed to ensuring a safe, enjoyable, and responsible AI
          experience for all users, with strict content guidelines in place.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
