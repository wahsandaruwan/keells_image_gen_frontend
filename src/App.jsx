import { Route, Routes } from "react-router";
import "./App.css";
import { Home, Register, User } from "./pages";

function App() {
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
