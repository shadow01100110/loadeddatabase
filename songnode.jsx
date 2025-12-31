export default function SongNode({ song, onClick }) {
  return (
    <div className="song-node" onClick={onClick}>
      <span>{song.title}</span>
    </div>
  );
}