import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = ({ onVerify }) => {
  const [Verified, setVerified] = useState(false);
  const SiteKey = import.meta.env.VITE_SITE_KEY;

  const HandleRecaptchaChange = (token) => {
    if (token) {
      setVerified(true);
      onVerify(true);
    }
  };
  return (
    <div className="mt-5">
      <ReCAPTCHA sitekey={SiteKey} onChange={HandleRecaptchaChange} />
    </div>
  );
};

export default Recaptcha;
