export default function Player({ song }) {
  return (
    <div className="player">
      <p>NOW PLAYING :: {song.title}</p>
      <audio controls autoPlay src={song.file}></audio>
    </div>
  );
}