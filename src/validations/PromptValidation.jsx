export const PromptValidation = (prompt) => {
  const promptPattern = /^[A-Za-z0-9\s.,'"-]+$/;
  return promptPattern.test(prompt.trim());
};
