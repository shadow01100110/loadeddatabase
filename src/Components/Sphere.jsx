import { useRef, useEffect, useState } from "react";

const SONGS = [
  { id: 1, name: "Seek ft. duvidha", slug: "seek-ft.-duvidha", lat: 30, lon: 60 },
  { id: 2, name: "Cyberstar ORIGINAL", slug: "cyberstar", lat: -20, lon: 120 },
  { id: 3, name: "Originz ORIGINAL ft. duvidha", slug: "originz-ft.-duvidha-original", lat: 101, lon: 180 },
  { id: 4, name: "Lost Files", slug: "lost-files", lat: -10, lon: 250 },
  { id: 5, name: "FYE (Solo)", slug: "fye-solo", lat: -60, lon: 60 },
];

export default function Sphere({ onSongClick }) {
  const canvasRef = useRef(null);
  const lastTouch = useRef(null);
  const lastTappedNode = useRef(null);
  const lastTapTime = useRef(0);

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(null);

  const size = 500;
  const radius = 180;
  const perspective = 600;

  /* ---------------- AUTO ROTATION ---------------- */
  useEffect(() => {
    let frame;
    const loop = () => {
      setRotation(r => ({ x: r.x, y: r.y + 0.00015 }));
      frame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, []);

  /* ---------------- DRAW SPHERE ---------------- */
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
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      return [x1, y1, z2];
    };

    // Latitude & longitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      ctx.beginPath();
      for (let lon = 0; lon <= 360; lon += 6) {
        const latR = (lat * Math.PI) / 180;
        const lonR = (lon * Math.PI) / 180;
        const x = radius * Math.cos(latR) * Math.cos(lonR);
        const y = radius * Math.sin(latR);
        const z = radius * Math.cos(latR) * Math.sin(lonR);
        const p = project(rotate([x, y, z]));
        lon === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath();
      for (let lat = -90; lat <= 90; lat += 4) {
        const latR = (lat * Math.PI) / 180;
        const lonR = (lon * Math.PI) / 180;
        const x = radius * Math.cos(latR) * Math.cos(lonR);
        const y = radius * Math.sin(latR);
        const z = radius * Math.cos(latR) * Math.sin(lonR);
        const p = project(rotate([x, y, z]));
        lat === -90 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Draw nodes
    SONGS.forEach(song => {
      const latR = (song.lat * Math.PI) / 180;
      const lonR = (song.lon * Math.PI) / 180;
      const x = radius * Math.cos(latR) * Math.cos(lonR);
      const y = radius * Math.sin(latR);
      const z = radius * Math.cos(latR) * Math.sin(lonR);
      const p = project(rotate([x, y, z]));
      ctx.beginPath();
      ctx.fillStyle = "#00ff00";
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [rotation]);

  const projectPoint = song => {
    const latR = (song.lat * Math.PI) / 180;
    const lonR = (song.lon * Math.PI) / 180;
    const x = radius * Math.cos(latR) * Math.cos(lonR);
    const y = radius * Math.sin(latR);
    const z = radius * Math.cos(latR) * Math.sin(lonR);

    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);

    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const y1 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const scale = perspective / (perspective + z2);
    return { x: size / 2 + x1 * scale, y: size / 2 + y1 * scale };
  };

  /* ---------------- MOUSE (PC) ---------------- */
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

  /* ---------------- TOUCH / MOBILE ---------------- */
  const onTouchStart = e => {
    e.preventDefault();
    lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchMove = e => {
    e.preventDefault();
    if (!lastTouch.current) return;
    const dx = e.touches[0].clientX - lastTouch.current.x;
    const dy = e.touches[0].clientY - lastTouch.current.y;
    setRotation(r => ({ x: r.x + dy * 0.003, y: r.y + dx * 0.003 }));
    lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = e => {
    e.preventDefault();
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = e.changedTouches[0].clientX - rect.left;
    const touchY = e.changedTouches[0].clientY - rect.top;

    let tappedNode = null;
    SONGS.forEach(song => {
      const p = projectPoint(song);
      const dx = touchX - p.x;
      const dy = touchY - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < 12) tappedNode = song;
    });

    if (!tappedNode) return;

    const now = Date.now();
    if (lastTappedNode.current?.slug === tappedNode.slug && now - lastTapTime.current < 400) {
      onSongClick(tappedNode.slug);
      lastTappedNode.current = null;
    } else {
      const rectAbs = canvasRef.current.getBoundingClientRect();
      setHovered({
        name: tappedNode.name,
        slug: tappedNode.slug,
        screenX: rectAbs.left + projectPoint(tappedNode).x,
        screenY: rectAbs.top + projectPoint(tappedNode).y,
      });
      lastTappedNode.current = tappedNode;
      lastTapTime.current = now;
    }
  };

  const onClick = () => {
    if (hovered) onSongClick(hovered.slug);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="sphere-canvas"
        style={{ marginTop: "20px", touchAction: "none" }}
        onMouseMove={handleMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={() => setHovered(null)}
        onMouseMoveCapture={onDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
      />

      {hovered && (
        <div
          className="song-tooltip"
          style={{ top: hovered.screenY + 14, left: hovered.screenX + 14 }}
        >
          <span>{hovered.name}</span>
        </div>
      )}
    </>
  );
}
