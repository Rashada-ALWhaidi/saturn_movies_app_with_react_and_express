export default function MovieCard({ movie, isSelected, onSelect }) {
  return (
    <article
      className={`movie-card ${isSelected ? "is-selected" : ""}`.trim()}
      onClick={() => onSelect(movie.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(movie.id);
        }
      }}
    >
      {movie.primaryImage ? (
        <img src={movie.primaryImage} alt={movie.primaryTitle} />
      ) : (
        <div className="fallback">{movie.primaryTitle}</div>
      )}

      <p className="card-title">{movie.primaryTitle}</p>
    </article>
  );
}
