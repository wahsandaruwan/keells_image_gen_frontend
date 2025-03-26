export const UserNameValidation = (name) => {
  const promptPattern = /^[~!@#$%^&*()_+\-=[\]{}|./<>?a-zA-Z0-9]+$/;
  return promptPattern.test(name.trim());
};
