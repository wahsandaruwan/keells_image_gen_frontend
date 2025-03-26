export const MobileNumberValidation = (mobileNumber) => {
  const cleanedNumber = mobileNumber.replace(/[^0123456789]/g, "");
  return cleanedNumber.length === 10;
};
