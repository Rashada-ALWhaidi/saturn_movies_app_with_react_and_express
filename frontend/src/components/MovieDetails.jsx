export default function MovieDetails({ movie, onOpenAdd, onEdit, onDelete }) {
  if (!movie) {
    return (
      <div className="details">
        <div className="details-actions-top">
          <button type="button" className="ghost-action" onClick={onOpenAdd}>
            Add Movie
          </button>
        </div>
        <h1>No movie selected</h1>
      </div>
    );
  }

  return (
    <div className="details">
      <div className="details-actions-top">
        <div className="details-actions">
          <button type="button" className="ghost-action" onClick={onOpenAdd}>
            Add Movie
          </button>
          <button
            type="button"
            className="secondary-action"
            onClick={() => onEdit(movie)}
          >
            Edit
          </button>
          <button
            type="button"
            className="danger-action"
            onClick={() => onDelete(movie.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <h1>{movie.primaryTitle}</h1>

      <div className="meta">
        <span className="meta-rating">{Number(movie.averageRating || 0).toFixed(1)} / 10 IMDb</span>
        <span>{movie.startYear}</span>
        <span>{movie.runtimeMinutes} min</span>
        <span>{movie.genres?.join(" • ")}</span>
      </div>

      <p className="description">{movie.plot}</p>
    </div>
  );
}
