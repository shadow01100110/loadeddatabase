import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

// iPhone detection
const isIPhone =
  typeof navigator !== "undefined" &&
  /iPhone/.test(navigator.userAgent) &&
  !/iPad/.test(navigator.userAgent);

const LYRICS_DB = {
  "seek-ft.-duvidha": `Description:

broken free from the curse at last and aware of rebel, loader must save this reality of the future and scotty before the reckoning
track 3/5 'Neuro Musik'

Lyrics:

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

  "cyberstar": `Description:

the warp was successful, now rebellion is the final step of the mission he was sent out to do. in order to annihilate, deception is required
track 2/5 'Neuro Musik'

Lyrics:

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

  "lost-files": `Description:

they wont like us
they wont find us
they wont stop us
track 1/28 'Unloaded Tape'
`,

  "fye-solo": `Description:

the JACKBOYS just inspired a new generation, brownin out at the thought of glory. they ready to do whatever it takes before its too late
track 2/7 'BLACKBOYS'

Lyrics:

hollup sis, sumn up
yo spit fam. yeah, we up we up
shit tonight fam?
aight then, i'll bring the goods n that
oh and, tell them motherfuckin boys we doin this
shit finna be fye


fye, whoo
fye, fhoo
yee, fye, whoo, fyeeeee
mhmm, mhmm, mhmm, fool go
back in the stu, go flow
we ain't goin back home
run up on brothers on fellas
she so fine, she one of my dealers 
got too many bitches on film yea
i just banged the shit outta her yea
we fuckn round the block yea
the sirens right out the condo yeah

let's go, thats trill yea
let's blow, thats flow yea 
let's go
too fye
too fye
too fye
too fye
too fye for your bitch
too fye for this list
too fye for your shit
boys

i put my dick in her mouth, she slurp my kids up
i got me this exotic shi huh, put the ice in my drank huh
she a fan yuh
anything for the cuh yea
clubbin with yo cut hmm

outside with the draco, please dont film
censor the shit, we ain't gon go
they wanna see the jackboys yap
face, Ass press, bend over that fat ass
big titties bouncin cross the damn dash

slim lap ain't phase me yeah, i do whatever i please hmm
hope we become the next big scene, off tha lean
off tha lean, in the hills, we on flames bitch
the sirens right out the condo yeah

let's go, thats trill yea
let's blow, thats flow yea 
let's go
too fye
too fye
too fye
too fye
too fye for your bitch
too fye for this list
too fye for your shit

the sirens right out the condo yeah
let's go, thats trill yea
let's blow, thats flow yea 
let's go
too fye
too fye
too fye
too fye
too fye for your bitch
too fye for this list
too fye for your shit
`,

  "originz-ft.-duvidha-original": `Description:

once upon a time, in a unknown barren land centuries ago, a disciple by the name of scotty bestowed his wings and birthed Loaded RBL, but with it, gave the very defects that would curse his soul for eternity. this is originz
track 1/1 'Originz'
https://soundcloud.com/loaded-rbl/prod-sapjer-originz-ft-scotty-clouvre

Lyrics:

silver knife in my back, silverback going hard
if he here to bang his chest I might take your fucking heart 
rosemary shaft, white powder from afar
if that za aint from my kingdom I might jetpack back to Mars 
back in all black but we still in this bitch
back to back packrunning all night in this shit
sword on my hand, slaying ghouls in this hoe
that bitch need an excorcist yeah she gon need to go

its the autumn night chilling off with the gods
hellhounds are my dogs, break my sword from the rod
knights in all black, going gaurd, go vangaurd
bitch we need no saving, only racks and fast cars 

metal armour save me for slaying the devil 
knighted by the council of mysterious people

angel
gaurdian
theres a chalice of light that seems to beam
spiral eyes in the sky watching down from above

silver knife in my back, silverback going hard
if he here to bang his chest I might take your fucking heart 
rosemary shaft, white powder from afar
if that za aint from my kingdom I might jetpack back to Mars 
back in all black but we still in this bitch
back to back packrunning all night in this shit
sword on my hand, slaying ghouls in this hoe
that bitch need an excorcist yeah she gon need to go

`,

"enigma": `Description:

when the sun goes down, we up. let it consume you, for it is the one thing that feeds hunger
track 1/1 'Enigma'

Lyrics:

loader, yeah

shoutouts to my exes, im fuckin on, fuckin on cash (cash cash)
im calling yo shit, yeah im callin up sayin i dont miss (givin the best)
im poppin a perk, down it all and fulfil my wish, wish

i know who you is, i know you and your biz and 
i aint finna stop
i feel outta the line
im done feel outta line

spend tens from my tenfolds
gotta switch up the pace hoe
i dont vibe with ten of yall
got hennesy, now there way more
get me a vanguard
go go, call me duvidha and some gangs Mo

walk around until imma
walk around in black
fuckin on this bitch and i done fuck with all this sass
come out swingin guns driftin tokyo, smoke that pack

i double it
i triple it
im geekin
i forgettin that
yall dry as fuck lame as fuck bitches 
never gon get to ever feel the high that im feelin yea

im feelin it, but yall dreamin it

walk around in black, walk around in all black drip (flash)
Walk round fuck they say, man fuck them, im the fame (stop it)
and thats the name of the game, go dumb go stupid, wham (blam)
not gonna run away, go dumb, go stupid away (gang)

walk around in all black, walk around in all black
i be outta whack, i be on whack
go
go
go
go
woah

`,
};

export default function SongPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const volumeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [volume, setVolume] = useState(0.5);

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

    const BASE = "/loadeddatabase";
    wavesurfer.current.load(`${BASE}/songfiles/${id}.wav`);

    wavesurfer.current.setVolume(volume);
    wavesurfer.current.on("finish", () => setIsPlaying(false));

    return () => wavesurfer.current.destroy();
  }, [id]);

  useEffect(() => {
    if (!isIPhone || !volumeRef.current) return;

    const slider = volumeRef.current;
    const allowTouch = (e) => e.stopPropagation();

    slider.addEventListener("touchstart", allowTouch, { passive: true });
    slider.addEventListener("touchmove", allowTouch, { passive: true });

    return () => {
      slider.removeEventListener("touchstart", allowTouch);
      slider.removeEventListener("touchmove", allowTouch);
    };
  }, []);

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
        <div style={{ position: "fixed", top: 10, left: 10 }}>_terminal</div>

        <h2 style={{ textAlign: "center", letterSpacing: "2px" }}>
          {id.replace(/-/g, " ").toUpperCase()}
        </h2>

        <div
          ref={waveformRef}
          style={{
            background: "#000",
            border: "1px solid #00ff00",
            borderRadius: "6px",
            padding: "10px",
          }}
        />

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

          <a
            href={`/loadeddatabase/songfiles/${id}.wav`}
            download
            style={buttonStyle}
          >
            DOWNLOAD
          </a>
        </div>

        {/* HIDE VOLUME ON iPhone ONLY */}
        {!isIPhone && (
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
              ref={volumeRef}
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
              style={{
                width: "140px",
                accentColor: "#00ff00",
                touchAction: "none",
              }}
            />
          </div>
        )}

        <div
          style={{
            marginTop: "30px",
            height: "45vh",
            overflowY: "auto",
            marginBottom: "60px",
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
