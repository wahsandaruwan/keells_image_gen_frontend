import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = ({ onVerify }) => {
  const [Verified, setVerified] = useState(false);

  const HandleRecaptchaChange = (token) => {
    if (token) {
      setVerified(true);
      onVerify(true);
    }
  };

  return (
    <div className="mt-5">
      <ReCAPTCHA
        sitekey="6Lf8o_0qAAAAADJm5saVO2TbgiKjFoN3GaQneuBm"
        onChange={HandleRecaptchaChange}
      />
    </div>
  );
};

export default Recaptcha;
