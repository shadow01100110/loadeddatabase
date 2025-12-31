import React, { useEffect, useState } from "react";

export default function SongNameTooltip({ songName, position }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(songName.slice(0, i + 1));
      i++;
      if (i >= songName.length) clearInterval(interval);
    }, 50); // slower typewriter for tooltip
    return () => clearInterval(interval);
  }, [songName]);

  if (!songName || !position) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: position.y + 10,
        left: position.x + 10,
        background: "black",
        color: "#00ff00",
        padding: "4px 8px",
        fontFamily: "monospace",
        border: "1px solid #00ff00",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        fontSize: "0.9rem",
      }}
    >
      {displayedText}
    </div>
  );
}
