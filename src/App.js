import { useState } from "react";
import "./App.css";
import Earth from "./components/earth/earth.jsx";
import ReactTooltip from "react-tooltip";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function App() {
  const [content, setContent] = useState("");

  return (
    <div className="app">
      <Header />
      <>
        <Earth setTooltipContent={setContent} />
        <ReactTooltip>{content}</ReactTooltip>
      </>

      <Footer />
    </div>
  );
}

export default App;
