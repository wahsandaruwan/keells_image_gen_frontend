import React, { useState } from "react";
import { FAQData } from "../../../data";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useLocation } from "react-router";

const FAQ = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const location = useLocation();
  return (
    <div
      className={`w-full sm:w-2/3 max-h-[600px] ${
        location.pathname === "/" ? "mt-16" : "mt-0"
      }`}
    >
      <h2 className="text-[15px] sm:text-[16px] font-bold text-center">
        Notes
      </h2>
      <div className="w-full space-y-3 overflow-y-auto mt-4 max-h-[200px]">
        {/* {FAQData.map((faq, index) => (
          <div key={index} className="border-b pb-3">
            <button
              onClick={() =>
                setExpandedQuestion(expandedQuestion === index ? null : index)
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
        ))} */}
        <p>Keells Avurudu AI supports English, සිංහල, and தமிழ், ensuring an
        inclusive experience for all users.</p> 
        <p>To generate high-quality AI images, be specific and detailed in your prompt.</p>
        <p>Use Concise and Structured Language</p>
        <p>❌ "A New Year food table"</p>
        <p>✅ "Sinhala New Year feast with kiribath, kokis, kavum, sweet mung kavum, fresh fruits, and a glowing clay oil lamp."</p>
        <p>Keells Avurudu AI also includes safeguards to protect minors, restricting queries that could generate outputs related to children. We are committed to ensuring a safe, enjoyable, and responsible AI experience for all users, with strict content guidelines in place.</p>
      </div>
    </div>
  );
};

export default FAQ;
