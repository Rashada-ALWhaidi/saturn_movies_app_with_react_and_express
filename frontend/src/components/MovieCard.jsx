export default function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      {movie.primaryImage ? (
        <img src={movie.primaryImage} alt={movie.primaryTitle} />
      ) : (
        <div className="movie-card__fallback">{movie.primaryTitle}</div>
      )}
      <div className="movie-card__overlay">
        <p className="movie-card__title">{movie.primaryTitle}</p>
        <span className="movie-card__year">{movie.startYear}</span>
      </div>
    </article>
  );
}
