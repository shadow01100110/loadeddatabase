import { useState } from "react";
import { songs } from "./data/songs";
import SongNode from "./components/SongNode";
import Player from "./components/Player";
import Lyrics from "./components/Lyrics";

export default function App() {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <div className="terminal">
      <h1 className="terminal-title">RETRO::AUDIO_NODE</h1>

      <div className="node-grid">
        {songs.map(song => (
          <SongNode
            key={song.id}
            song={song}
            onClick={() => setCurrentSong(song)}
          />
        ))}
      </div>

      {currentSong && (
        <>
          <Player song={currentSong} />
          <Lyrics lyrics={currentSong.lyrics} />
        </>
      )}
    </div>
  );
}