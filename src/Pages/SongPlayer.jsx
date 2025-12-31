import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

// Lyrics database — NOW ONE STRING
const LYRICS_DB = {
  "seek-ft.-duvidha": `Lyrics:

unbecoming fate
desire, annihilate
destroy human, you so hate
speakers fucked with 808s
and so welcome to heartbreak
there i am, inside their brain
seek, kill, fuck, and die, decay
witness to my rotting face

welcome to my brain it says
blood and warfare's the only way
ohhhhhhh the only way
how you gon feel when i get to the finish line
need me some breaks, it takes for another life
how you gon trill while you gotta pay the bills
take it from me, run it all up the hills

steel soliders bargin in, play it cool, watch the joules
dystopia where we live, sins drowning all the fools
i'm a seeker, imma im believer
getting all the tenfolds like I'm bieber
buildings broken down, new gens built up now
rebellion rise, fight the lies right now

no bad blood i dont hold any grudge
but they still wanna come and test out their luck
all bad blood but I still hold a grudge
drilla wanna seek he can come catch this jugg
search and destroy you can't hide only run
finna go insane, come swinging out the gun
fuck that shit, always right never wrong
fuck you bitch keep your words in your tongue
you feel so much better whne you tell them that im gone
was it ever real, what the fuck is even love

seek, kill, fuck and die decay
seek, kill, fuck and die decay
seek, kill, fuck and die decay

seek, seek, seek for the truth and strength
we have been long long longing
fuck, fuck, fuck all yous
We have been fight, fight, fighting yeaaaahh

witness to my rotting face
witness to my - seek

seek
seek, kill, fuck and die decay
seek, kill, fuck and die decay
`,

"cyberstar": `Lyrics:

whoo
whoo
whoo
rebel

it's 2040
go on, switch the telly, yeah
run up the shootaz
so perfect style, yeah

i be dinin on that hoe, they all be gettin used like tools
computerised en troupes, my french sharper than them jewels
money up so high, money problems bye bye
im a fly cyberstar, fit glossier than nya

it's 2040
go on, switch the telly, yeah
run up the shootaz
so perfect style, yeah

off the lean, my shit better than kodak
imma get with you just to fuck, know that
my alter-ego just got done with loader.exe
run this shit up like ceo
aston martin deo
hit shit harder than icl
im with ties with nfl
open gate to futuristic hell
ive been on business, you fell

new maybach yeah
new killaz at the fest
i only hire the best
dont test
you less
too easy just rest
just rest
cyberstar start drippin
on the neuro-gas we tippin
`,

"lost-files": `Loaded Tape V3 | Unloaded Tape Prelude

they wont like us
they wont find us
they wont stop us
`,
};

export default function SongPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    setLyrics(LYRICS_DB[id] || "No lyrics available.");

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#00aa00",
      progressColor: "#00ff00",
      cursorColor: "#00ff00",
      barWidth: 2,
      barGap: 1,
      height: 90,
      normalize: true,
    });

    wavesurfer.current.load(`/songfiles/${id}.wav`);
    wavesurfer.current.setVolume(volume);

    wavesurfer.current.on("finish", () => setIsPlaying(false));

    return () => wavesurfer.current.destroy();
  }, [id]);

  const togglePlay = () => {
    wavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        fontFamily: "monospace",
        color: "#00ff00",
      }}
    >
      <div style={{ width: "100%", maxWidth: "720px", padding: "20px" }}>
        {/* TERMINAL HEADER */}
        <div style={{ position: "fixed", top: 10, left: 10 }}>_terminal</div>

        {/* TITLE */}
        <h2 style={{ textAlign: "center", letterSpacing: "2px" }}>
          {id.replace(/-/g, " ").toUpperCase()}
        </h2>

        {/* WAVEFORM */}
        <div
          ref={waveformRef}
          style={{
            background: "#000",
            border: "1px solid #00ff00",
            borderRadius: "6px",
            padding: "10px",
          }}
        />

        {/* CONTROLS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          <button onClick={() => navigate("/")} style={buttonStyle}>
            &lt; BACK
          </button>

          <button onClick={togglePlay} style={buttonStyle}>
            {isPlaying ? "PAUSE" : "PLAY"}
          </button>

          <a href={`/songfiles/${id}.wav`} download style={buttonStyle}>
            DOWNLOAD
          </a>
        </div>

        {/* VOLUME */}
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            fontSize: "0.85rem",
          }}
        >
          VOL
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              wavesurfer.current.setVolume(v);
            }}
            style={{ width: "140px", accentColor: "#00ff00" }}
          />
        </div>

        {/* LYRICS */}
        <div
          style={{
            marginTop: "30px",
            height: "45vh",
            overflowY: "auto",
            marginBottom: "60px", // 👈 space AFTER lyrics
            whiteSpace: "pre-wrap",
            lineHeight: "1.6",
            textAlign: "center",
            border: "1px solid #00ff00",
            padding: "14px",
          }}
        >
          {lyrics}
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: "#000",
  border: "1px solid #00ff00",
  color: "#00ff00",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontFamily: "monospace",
};
