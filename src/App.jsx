import { Route, Routes } from "react-router";
import { useEffect } from "react";
import "./App.css";
import { Home, Register, User } from "./pages";
import ReactGA from "react-ga4";

function App() {
  useEffect(() => {
    ReactGA.initialize(import.meta.env.VITE_GA_KEY);

    // Send pageview with a custom path
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "App.jsx",
    });
  }, []);

  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
