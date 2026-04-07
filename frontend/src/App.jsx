import { useEffect, useMemo, useState } from "react";
import { addMovie, deleteMovie, getMovies, updateMovie } from "./api/moviesApi";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import MovieFormModal from "./components/MovieFormModal";
import "./styles/main.css";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [previewMovieId, setPreviewMovieId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState({
    type: "loading",
    message: "Loading movies...",
  });
  const [modalState, setModalState] = useState({
    open: false,
    mode: "add",
    movie: null,
  });

  useEffect(() => {
    const trimmed = searchInput.trim();

    // إذا الحقل فارغ، رجّعي كل الأفلام مباشرة
    if (trimmed.length === 0) {
      setSearchValue("");
      return;
    }

    // إذا أقل من 3 أحرف، لا تبحث بعد
    if (trimmed.length < 3) {
      return;
    }

    // بحث تلقائي بعد 3 أحرف مع تأخير بسيط
    const timer = setTimeout(() => {
      setSearchValue(trimmed);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setStatus({
          type: "loading",
          message: "Please wait while movies are loading.",
        });

        const data = await getMovies({ search: searchValue, limit: 20 });
        setMovies(data);

      setStatus(
        data.length
          ? {
              type: "success",
              message:
                searchValue.trim().length >= 3
                  ? `${data.length} result${data.length > 1 ? "s" : ""} found for "${searchValue}".`
                  : `${data.length} movie${data.length > 1 ? "s" : ""} available.`,
            }
          : {
              type: "empty",
              message:
                searchValue.trim().length >= 3
                  ? "No movies found for this search."
                  : "No movies available.",
            },
      );

        setSelectedMovieId((prev) =>
          data.some((movie) => movie.id === prev)
            ? prev
            : (data[0]?.id ?? null),
        );
        setPreviewMovieId(null);
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error.message || "Something went wrong while loading movies.",
        });
      }
    };

    loadMovies();
  }, [searchValue]);

  const activeMovie = useMemo(() => {
    const currentId = previewMovieId || selectedMovieId;
    return movies.find((movie) => movie.id === currentId) || movies[0] || null;
  }, [movies, previewMovieId, selectedMovieId]);

  const handleAddMovie = async (movieData) => {
    try {
      const created = await addMovie(movieData);
      const refreshed = await getMovies({ search: searchValue, limit: 20 });
      setMovies(refreshed);
      setSelectedMovieId(created.id);
      setModalState({ open: false, mode: "add", movie: null });
      setStatus({ type: "success", message: "Movie added successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to add movie.",
      });
    }
  };

  const handleUpdateMovie = async (movieData) => {
    try {
      const editingMovie = modalState.movie;
      if (!editingMovie) return;

      const updated = await updateMovie(editingMovie.id, movieData);
      const refreshed = await getMovies({ search: searchValue, limit: 20 });

      setMovies(refreshed);
      setSelectedMovieId(updated.id);
      setModalState({ open: false, mode: "add", movie: null });
      setStatus({ type: "success", message: "Movie updated successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to update movie.",
      });
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this movie?",
      );
      if (!confirmed) return;

      await deleteMovie(movieId);
      const refreshed = await getMovies({ search: searchValue, limit: 20 });

      setMovies(refreshed);
      setSelectedMovieId((prev) =>
        prev === movieId ? (refreshed[0]?.id ?? null) : prev,
      );
      setStatus({ type: "success", message: "Movie deleted successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to delete movie.",
      });
    }
  };

  return (
    <div className="app">
      <div
        className="background-layer"
        style={{
          backgroundImage: activeMovie?.primaryImage
            ? `url(${activeMovie.primaryImage})`
            : "none",
        }}
      />
      <div className="overlay" />

      <main className="hero">
        <header className="topbar">
          <div className="badge">
            <span className="badge-new">New</span>
            <span className="badge">Movie App</span>
          </div>
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search by movie title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </header>

        <section className="hero-content">
          <MovieDetails
            movie={activeMovie}
            onOpenAdd={() =>
              setModalState({ open: true, mode: "add", movie: null })
            }
            onEdit={(movie) =>
              setModalState({ open: true, mode: "edit", movie })
            }
            onDelete={handleDeleteMovie}
          />
        </section>

        <div className={`status-message ${status.type}`}>{status.message}</div>

        <section className="movie-strip-section">
          <MovieList
            movies={movies}
            selectedMovieId={selectedMovieId}
            previewMovieId={previewMovieId}
            onHover={setPreviewMovieId}
            onLeave={() => setPreviewMovieId(null)}
            onSelect={setSelectedMovieId}
          />
        </section>

        <MovieFormModal
          open={modalState.open}
          mode={modalState.mode}
          movie={modalState.movie}
          onClose={() =>
            setModalState({ open: false, mode: "add", movie: null })
          }
          onSubmit={
            modalState.mode === "edit" ? handleUpdateMovie : handleAddMovie
          }
        />
      </main>
    </div>
  );
}