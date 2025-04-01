import React, { createContext, useContext, useState } from "react";

// Create the context with a type definition
const BaseUrlContext = createContext(undefined);

// Create the provider component
export const BaseUrlProvider = ({ children }) => {
  const [baseUrl, setBaseUrl] = useState(
    "https://keellsavuruduai.keellssuper.com/api"
  );

  return (
    <BaseUrlContext.Provider value={{ baseUrl, setBaseUrl }}>
      {children}
    </BaseUrlContext.Provider>
  );
};

// Create a custom hook to use the BaseUrlContext
export const useBaseUrl = () => {
  const context = useContext(BaseUrlContext);

  if (!context) {
    throw new Error("useBaseUrl must be used within a BaseUrlProvider");
  }

  return context;
};
