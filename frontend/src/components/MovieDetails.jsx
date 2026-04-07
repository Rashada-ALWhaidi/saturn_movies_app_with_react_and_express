export default function MovieDetails({ movie, onOpenAdd, onEdit, onDelete }) {
  if (!movie) {
    return (
      <section className="movie-details">
        <div className="details-actions">
          <button type="button" className="primary-btn" onClick={onOpenAdd}>
            Add Movie
          </button>
        </div>
        <p>No movie selected.</p>
      </section>
    );
  }

  return (
    <section className="movie-details">
      <div className="details-actions">
        <button type="button" className="primary-btn" onClick={onOpenAdd}>
          Add Movie
        </button>

        <button
          type="button"
          className="secondary-btn"
          onClick={() => onEdit(movie)}
        >
          Edit
        </button>

        <button
          type="button"
          className="danger-btn"
          onClick={() => onDelete(movie.id)}
        >
          Delete
        </button>
      </div>

      <h1>{movie.primaryTitle}</h1>

      <div className="movie-meta">
        <span>{movie.averageRating} / 10 IMDb</span>
        <span>{movie.startYear}</span>
        <span>{movie.runtimeMinutes} min</span>
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
