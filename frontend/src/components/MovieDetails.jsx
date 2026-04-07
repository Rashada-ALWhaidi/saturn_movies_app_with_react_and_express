export default function MovieDetails({ movie }) {
  if (!movie) {
    return (
      <section className="movie-details">
        <p>No movie selected.</p>
      </section>
    );
  }

  return (
    <section className="movie-details">
      <h1>{movie.primaryTitle}</h1>

      <div className="movie-meta">
        <span>{movie.startYear}</span>
        <span>{movie.runtimeMinutes} min</span>
        <span>{movie.averageRating} / 10</span>
      </div>

      <div className="movie-genres">
        {movie.genres?.map((genre) => (
          <span key={genre} className="genre-badge">
            {genre}
          </span>
        ))}
      </div>

      <p className="movie-plot">{movie.plot}</p>
    </section>
  );
}
