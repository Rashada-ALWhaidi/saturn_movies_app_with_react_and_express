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
        primaryImage: movie.primaryImage || "",
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
      <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
        <div className="movie-modal-header">
          <h2>{mode === "edit" ? "Edit Movie" : "Add Movie"}</h2>
          <button type="button" className="icon-btn" onClick={onClose}>
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
              step="0.1"
              name="averageRating"
              value={formData.averageRating}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Image URL
            <input
              type="url"
              name="primaryImage"
              value={formData.primaryImage}
              onChange={handleChange}
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

          <div className="movie-form-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {mode === "edit" ? "Save Changes" : "Add Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
