import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Sphere from "./Components/Sphere";
import SongPlayer from "./Pages/SongPlayer";
import { useEffect, useState } from "react";
import "./App.css";

function TerminalHeader() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, color: "#00ff00", fontFamily: "monospace", fontSize: "1rem", padding: "10px", zIndex: 100 }}>
      _terminal
    </div>
  );
}

function SphereWrapper() {
  const [titleAnimated, setTitleAnimated] = useState(false);

  useEffect(() => {
    setTitleAnimated(true);
  }, []);

  return (
    <div className="sphere-page">
      <TerminalHeader />
      <h1 className={`terminal-title ${titleAnimated ? "typing" : ""}`}>
        loaded_database//
      </h1>
      <Sphere />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Sphere page */}
        <Route path="/" element={<SphereWrapper />} />

        {/* SongPlayer page */}
        <Route path="/song/:id" element={<SongPlayer />} />
      </Routes>
    </Router>
  );
}

