import { useEffect, useState } from "react";

const initialForm = {
  primaryTitle: "",
  startYear: "",
  runtimeMinutes: "",
  genres: "",
  averageRating: "",
  plot: "",
  primaryImage: "",
};

export default function MovieFormModal({
  open,
  mode = "add",
  movie = null,
  onClose,
  onSubmit,
}) {
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialForm);



  useEffect(() => {
    if (mode === "edit" && movie) {
      setFormData({
        primaryTitle: movie.primaryTitle || "",
        startYear: movie.startYear || "",
        runtimeMinutes: movie.runtimeMinutes || "",
        genres: Array.isArray(movie.genres) ? movie.genres.join(", ") : "",
        averageRating: movie.averageRating || "",
        plot: movie.plot || "",
        primaryImage: movie?.primaryImage || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [mode, movie, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

      const year = Number(formData.startYear);
      const runtime = Number(formData.runtimeMinutes);
      const rating = Number(formData.averageRating);

      if (!year || year < 1900 || year > currentYear) {
        setError("Year must be between 1900 and the current year.");
        return;
      }

      if (!rating || rating < 1 || rating > 10) {
        setError("Rating must be between 1 and 10.");
        return;
      }

      if (!runtime || runtime < 1) {
        setError("Runtime must be at least 1 minute.");
        return;
      }

      setError("");

    onSubmit({
      ...formData,
      genres: formData.genres
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "edit" ? "Edit Movie" : "Add Movie"}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="movie-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              name="primaryTitle"
              value={formData.primaryTitle}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Year
            <input
              type="number"
              name="startYear"
              value={formData.startYear}
              onChange={handleChange}
              required
              min="1900"
              max={currentYear}
              className="no-spinner"
            />
          </label>
          <label>
            Runtime (minutes)
            <input
              type="number"
              name="runtimeMinutes"
              value={formData.runtimeMinutes}
              onChange={handleChange}
              required
              min="1"
              className="no-spinner"
            />
          </label>
          <label>
            Genres
            <input
              type="text"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="Action, Drama, Sci-Fi"
              required
            />
          </label>
          <label>
            Rating
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              className="no-spinner"
              name="averageRating"
              value={formData.averageRating}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            URL
            <input
              type="text"
              name="primaryImage"
              value={formData.primaryImage}
              onChange={handleChange}
              placeholder="https://example.com/movie-image.jpg"
            />
          </label>
          <label>
            Plot
            <textarea
              name="plot"
              rows="5"
              value={formData.plot}
              onChange={handleChange}
              required
            />
          </label>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="movie-form-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="ghost-action">
              {mode === "edit" ? "Save Changes" : "Add Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
