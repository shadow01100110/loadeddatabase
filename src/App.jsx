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
  const SONGS_REQUIRING_PASSKEY = ["lost-files", "fye-solo", "enigma"];

  // Existing passkey
  const PASSKEY = "291024";
  const PASSKEY_HINT = "Birth of Originz";

  // NEW Enigma passkey (ADDITION ONLY)
  const ENIGMA_PASSKEY = "12231";
  const ENIGMA_HINT = "Scour the Database, Chronological Order is key";

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
    const isEnigma = selectedSong === "enigma";

    const correctPasskey = isEnigma ? ENIGMA_PASSKEY : PASSKEY;

    if (passkeyValue === correctPasskey) {
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
          • Update 4.0 is here!<br />
          • New Song! Enigma (Upcoming Release)<br />
          • New Song Descriptions on every song<br />
          • Originz ORIGINAL Lyrics added<br />
          • Brand New Passkey for accessing Enigma<br />
          • Sphere autorotation is now faster<br />
        </div>
      </div>

      {/* PASSKEY MODAL */}
      {passkeyActive && (
        <div className="passkey-overlay">
          <div className="passkey-modal">
            <h3>Enter Passkey</h3>
            <p style={{ fontSize: "0.85rem", marginBottom: "10px", color: "#00ff00AA" }}>
              Hint: {selectedSong === "enigma" ? ENIGMA_HINT : PASSKEY_HINT}
            </p>
            <input
              type="text"
              placeholder={selectedSong === "enigma" ? "Enter 5-digit passkey" : "Enter 6-digit passkey"}
              value={passkeyValue}
              onChange={(e) => {
                setPasskeyValue(e.target.value);
                setPasskeyError("");
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
