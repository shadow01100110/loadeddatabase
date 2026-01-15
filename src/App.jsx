import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Sphere from "./Components/Sphere";
import SongPlayer from "./Pages/SongPlayer";
import "./App.css";
import {
  FaInstagram,
  FaYoutube,
  FaSoundcloud,
  FaSpotify,
  FaApple,
  FaLink
} from "react-icons/fa";

/* TERMINAL HEADER */
function TerminalHeader() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        color: "#00ff00",
        fontFamily: "monospace",
        fontSize: "1rem",
        padding: "10px",
        zIndex: 100,
      }}
    >
      _terminal
    </div>
  );
}

/* HOME / SPHERE PAGE */
function SphereWrapper() {
  const [titleAnimated, setTitleAnimated] = useState(false);
  const [passkeyActive, setPasskeyActive] = useState(false);
  const [passkeyValue, setPasskeyValue] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);

  // Songs that require passkey
  const SONGS_REQUIRING_PASSKEY = ["lost-files", "fye-solo"];
  const PASSKEY = "291024";
  const PASSKEY_HINT = "Birth of Originz";

  useEffect(() => {
    setTitleAnimated(true);
  }, []);

  // When a song node is clicked
  const handleSongClick = (songSlug) => {
    if (SONGS_REQUIRING_PASSKEY.includes(songSlug)) {
      setSelectedSong(songSlug);
      setPasskeyValue("");
      setPasskeyActive(true);
    } else {
      window.location.hash = `/song/${songSlug}`;
    }
  };

  const handlePasskeySubmit = () => {
    if (passkeyValue === PASSKEY) {
      setPasskeyActive(false);
      setPasskeyError("");
      window.location.hash = `/song/${selectedSong}`;
    } else {
      setPasskeyError("ERROR: Incorrect passkey");
      setPasskeyValue("");
    }
  };

  const handlePasskeyBack = () => {
    setPasskeyActive(false);
    setPasskeyValue("");
    setPasskeyError("");
    setSelectedSong(null);
  };

  return (
    <div className="sphere-page">
      <TerminalHeader />

      <h1 className={`terminal-title ${titleAnimated ? "typing" : ""}`}>
        loaded_database//
      </h1>

      {/* SOCIAL LINKS */}
      <div className="social-panel">
        <a href="https://www.instagram.com/loaded_rbl/" target="_blank" rel="noreferrer">
          <FaInstagram />
        </a>
        <a href="https://www.youtube.com/channel/UCrzODorxuAl2EtSS9AHxQZw" target="_blank" rel="noreferrer">
          <FaYoutube />
        </a>
        <a href="https://soundcloud.com/loaded-rbl" target="_blank" rel="noreferrer">
          <FaSoundcloud />
        </a>
        <a href="https://open.spotify.com/artist/3WhgQBynaEzARViGBpclDv" target="_blank" rel="noreferrer">
          <FaSpotify />
        </a>
        <a href="https://music.apple.com/us/artist/loaded-rbl/1822960299" target="_blank" rel="noreferrer">
          <FaApple />
        </a>
        <a href="https://linktr.ee/LoadedRBL" target="_blank" rel="noreferrer">
          <FaLink />
        </a>
      </div>

      <div className="sphere-container">
        <Sphere onSongClick={handleSongClick} />
      </div>

      {/* UPDATE LOG */}
      <div className="update-log-wrapper">
        <div className="update-log-header">UPDATE LOG V3.5</div>
        <div className="update-log-body">
          • Update 3.5 is here!<br />
          • Mobile and Ipad user friendly now! :) will be even more stable and better in future updates, but usable and functional right now<br />
          • Rotatable Sphere on phone and Ipad<br />
          • Steady unscrollable horizontally screen on phone and Ipad<br />
          • Update Log hidden only on phone<br />
          • Social buttons resized and new layout only on phone<br />
          • Single tap for song title, double tap on songnode to play the song for mobile and Ipad only<br />
          • Fixed autozoom issues on phone and Ipad<br />
          • Removed volume slider for phone<br />
          • Fixed Sphere dragging issues on PC<br />
          • Higher sensitivity for dragging the Sphere<br />
          • New error message displayed directly on website rather than browser for incorrect passkey inputs<br />
          • New message only for mobile and Ipad users guiding them on how to use the website and open songnodes<br />
        </div>
      </div>

      {/* PASSKEY MODAL */}
      {passkeyActive && (
        <div className="passkey-overlay">
          <div className="passkey-modal">
            <h3>Enter Passkey</h3>
            <p style={{ fontSize: "0.85rem", marginBottom: "10px", color: "#00ff00AA" }}>
              Hint: {PASSKEY_HINT}
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit passkey"
              value={passkeyValue}
              onChange={(e) => {
                setPasskeyValue(e.target.value);
                setPasskeyError("");  // Clear error when typing
              }}
            />
            {passkeyError && (
              <div className="passkey-error">
                {passkeyError}
              </div>
            )}
            <div style={{ marginTop: "12px" }}>
              <button onClick={handlePasskeySubmit}>Submit</button>
              <button onClick={handlePasskeyBack}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* APP ROUTER */
export default function App() {
  return (
    <div className="crt-screen">
      <Router>
        <Routes>
          <Route path="/" element={<SphereWrapper />} />
          <Route path="/song/:id" element={<SongPlayer />} />
        </Routes>
      </Router>
    </div>
  );
}
