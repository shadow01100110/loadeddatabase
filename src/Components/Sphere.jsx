import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Song database
const SONGS = [
  { id: 1, name: "Seek ft. duvidha", slug: "seek-ft.-duvidha", lat: 30, lon: 60 },
  { id: 2, name: "Cyberstar ORIGINAL", slug: "cyberstar", lat: -20, lon: 120 },
  { id: 3, name: "Originz ORIGINAL ft. duvidha", slug: "originz-ft.-duvidha-original", lat: 101, lon: 180 },
  { id: 4, name: "Lost Files", slug: "lost-files", lat: -10, lon: 250 },
];

export default function Sphere() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(null);

  const size = 500;
  const radius = 180;
  const perspective = 600;

  // ---------------- AUTO ROTATION ----------------
  useEffect(() => {
    let frame;
    const loop = () => {
      setRotation(r => ({ x: r.x, y: r.y + 0.00015 })); // slow horizontal rotation
      frame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, []);

  // ---------------- DRAW SPHERE ----------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(0,255,0,0.4)";
    ctx.setLineDash([4, 6]);

    const project = ([x, y, z]) => {
      const scale = perspective / (perspective + z);
      return { x: size / 2 + x * scale, y: size / 2 + y * scale };
    };

    const rotate = ([x, y, z]) => {
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);

      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;
      let y1 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;
      return [x1, y1, z2];
    };

    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      ctx.beginPath();
      for (let lon = 0; lon <= 360; lon += 6) {
        const latR = (lat * Math.PI) / 180;
        const lonR = (lon * Math.PI) / 180;
        let x = radius * Math.cos(latR) * Math.cos(lonR);
        let y = radius * Math.sin(latR);
        let z = radius * Math.cos(latR) * Math.sin(lonR);
        const p = project(rotate([x, y, z]));
        lon === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath();
      for (let lat = -90; lat <= 90; lat += 4) {
        const latR = (lat * Math.PI) / 180;
        const lonR = (lon * Math.PI) / 180;
        let x = radius * Math.cos(latR) * Math.cos(lonR);
        let y = radius * Math.sin(latR);
        let z = radius * Math.cos(latR) * Math.sin(lonR);
        const p = project(rotate([x, y, z]));
        lat === -90 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Draw nodes
    SONGS.forEach(song => {
      const latR = (song.lat * Math.PI) / 180;
      const lonR = (song.lon * Math.PI) / 180;
      let x = radius * Math.cos(latR) * Math.cos(lonR);
      let y = radius * Math.sin(latR);
      let z = radius * Math.cos(latR) * Math.sin(lonR);
      const p = project(rotate([x, y, z]));
      ctx.beginPath();
      ctx.fillStyle = "#00ff00";
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [rotation]);

  // ---------------- HOVER DETECTION ----------------
  const projectPoint = song => {
    const latR = (song.lat * Math.PI) / 180;
    const lonR = (song.lon * Math.PI) / 180;
    let x = radius * Math.cos(latR) * Math.cos(lonR);
    let y = radius * Math.sin(latR);
    let z = radius * Math.cos(latR) * Math.sin(lonR);

    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);

    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;
    let y1 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;

    const scale = perspective / (perspective + z2);
    return { x: size / 2 + x1 * scale, y: size / 2 + y1 * scale };
  };

  const handleMouseMove = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found = null;
    SONGS.forEach(song => {
      const p = projectPoint(song);
      const dx = mx - p.x;
      const dy = my - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        found = { name: song.name, slug: song.slug, screenX: e.clientX, screenY: e.clientY };
      }
    });
    setHovered(found);
  };

  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);
  const onDrag = e => {
    if (!dragging) return;
    setRotation(r => ({ x: r.x + e.movementY * 0.002, y: r.y + e.movementX * 0.002 }));
  };

  // ---------------- NODE CLICK ----------------
  const onClick = () => {
    if (hovered) {
      navigate(`/song/${hovered.slug}`); // navigate to SongPlayer
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="sphere-canvas"
        style={{ marginTop: "20px" }}
        onMouseMove={handleMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={() => setHovered(null)}
        onMouseMoveCapture={onDrag}
        onClick={onClick}
      />
      {hovered && (
        <div className="song-tooltip" style={{ top: hovered.screenY + 14, left: hovered.screenX + 14 }}>
          <span>{hovered.name}</span>
        </div>
      )}
    </>
  );
}
