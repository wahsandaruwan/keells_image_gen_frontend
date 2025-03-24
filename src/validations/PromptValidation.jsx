export const PromptValidation = (prompt) => {
  const promptPattern = /^(?!.*(.)\1{2,})[A-Za-z\s]+$/;
  return promptPattern.test(prompt.trim());
};
