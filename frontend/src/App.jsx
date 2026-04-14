import { useEffect, useMemo, useState } from "react";
import {
  addMovie,
  deleteMovie,
  getMovieById,
  getMovies,
  updateMovie,
} from "./api/moviesApi";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import MovieFormModal from "./components/MovieFormModal";
import "./styles/main.css";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [previewMovieId, setPreviewMovieId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [modalState, setModalState] = useState({
    open: false,
    mode: "add",
    movie: null,
  });
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [deleteState, setDeleteState] = useState({
    open: false,
    movieId: null,
  });
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    type: "",
    message: "",
  });

  const closeFeedbackModal = () => {
    setFeedbackModal({
      open: false,
      type: "",
      message: "",
    });
  };

  const closeMovieModal = () => {
    setModalState({
      open: false,
      mode: "add",
      movie: null,
    });
  };

  const showFeedback = (type, message) => {
    setFeedbackModal({
      open: true,
      type,
      message,
    });
  };

  const refreshMovies = async () => {
    const refreshed = await getMovies({ search: searchValue, limit: 20 });
    setMovies(refreshed);
    return refreshed;
  };

  const loadMovies = async ({ isSearch = false } = {}) => {
    try {
      if (isSearch) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      const data = await getMovies({ search: searchValue, limit: 20 });
      setMovies(data);

      setSelectedMovieId((prev) =>
        data.some((movie) => movie.id === prev) ? prev : (data[0]?.id ?? null),
      );

      setPreviewMovieId(null);
    } catch (error) {
      showFeedback(
        "error",
        error.message || "Something went wrong while loading movies.",
      );
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }

      setHasLoadedOnce(true);
    }
  };

  useEffect(() => {
    const trimmed = searchInput.trim();

    if (trimmed.length === 0) {
      setSearchValue("");
      return;
    }

    const timer = setTimeout(() => {
      setSearchValue(trimmed);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadMovies({ isSearch: hasLoadedOnce });
  }, [searchValue]);

  useEffect(() => {
    let ignore = false;

    const loadSelectedMovie = async () => {
      if (!selectedMovieId) {
        setSelectedMovieDetails(null);
        return;
      }

      try {
        const movie = await getMovieById(selectedMovieId);

        if (!ignore) {
          setSelectedMovieDetails(movie);
        }
      } catch {
        if (!ignore) {
          setSelectedMovieDetails(
            movies.find((movie) => movie.id === selectedMovieId) || null,
          );
        }
      }
    };

    loadSelectedMovie();

    return () => {
      ignore = true;
    };
  }, [selectedMovieId, movies]);

  useEffect(() => {
    if (!feedbackModal.open) return;

    const timer = setTimeout(() => {
      closeFeedbackModal();
    }, 2500);

    return () => clearTimeout(timer);
  }, [feedbackModal.open]);

  const activeMovie = useMemo(() => {
    if (previewMovieId) {
      return movies.find((movie) => movie.id === previewMovieId) || null;
    }

    return (
      selectedMovieDetails ||
      movies.find((movie) => movie.id === selectedMovieId) ||
      movies[0] ||
      null
    );
  }, [movies, previewMovieId, selectedMovieDetails, selectedMovieId]);

  const handleAddMovie = async (movieData) => {
    try {
      const created = await addMovie(movieData);
      const refreshed = await getMovies({ search: searchValue, limit: 20 });

      setMovies(refreshed);
      setSelectedMovieId(created.id);
      closeMovieModal();

      setFeedbackModal({
        open: true,
        type: "success",
        message: "Movie added successfully.",
      });
    } catch (error) {
      closeMovieModal();

      setFeedbackModal({
        open: true,
        type: "error",
        message:
          error.message === "Movie already exists"
            ? "This movie already exists."
            : error.message || "Failed to add movie.",
      });
    }
  };

  const handleUpdateMovie = async (movieData) => {
    try {
      const editingMovie = modalState.movie;
      if (!editingMovie) return;

      const updated = await updateMovie(editingMovie.id, movieData);
      await refreshMovies();

      setSelectedMovieId(updated.id);
      setSelectedMovieDetails(updated);
      closeMovieModal();
      showFeedback("success", "Movie updated successfully.");
    } catch (error) {
      showFeedback("error", error.message || "Failed to update movie.");
    }
  };

  const handleDeleteMovie = (movieId) => {
    setDeleteState({
      open: true,
      movieId,
    });
  };

  const confirmDeleteMovie = async () => {
    try {
      if (!deleteState.movieId) return;

      const movieId = deleteState.movieId;
      await deleteMovie(movieId);
      const refreshed = await refreshMovies();

      setSelectedMovieId((prev) =>
        prev === movieId ? (refreshed[0]?.id ?? null) : prev,
      );

      setDeleteState({ open: false, movieId: null });
      showFeedback("success", "Movie deleted successfully.");
    } catch (error) {
      setDeleteState({ open: false, movieId: null });
      showFeedback("error", error.message || "Failed to delete movie.");
    }
  };

  const cancelDeleteMovie = () => {
    setDeleteState({ open: false, movieId: null });
  };


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <div
        className="background-layer"
        style={{
          backgroundImage: activeMovie?.primaryImage
            ? `linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.88) 0%,
                rgba(0, 0, 0, 0.55) 40%,
                rgba(0, 0, 0, 0.28) 100%
              ), url(${activeMovie.primaryImage})`
            : "linear-gradient(90deg, rgba(0,0,0,0.88), rgba(0,0,0,0.55), rgba(0,0,0,0.28))",
        }}
      />
      <div className="overlay" />

      <main className="hero">
        <header className="topbar">
          <div className="badge">
            <span className="badge-new">New</span>
            <span className="badge-movie">Movie</span>
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

        {searchLoading && (
          <div className="search-loading-message">Searching movies...</div>
        )}

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

        {deleteState.open && (
          <div className="modal-backdrop" onClick={cancelDeleteMovie}>
            <div
              className="confirm-delete-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Delete Movie</h3>
              <p>Are you sure you want to delete this movie?</p>

              <div className="confirm-delete-actions">
                <button
                  type="button"
                  className="secondary-action"
                  onClick={cancelDeleteMovie}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="danger-action"
                  onClick={confirmDeleteMovie}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <MovieFormModal
          open={modalState.open}
          mode={modalState.mode}
          movie={modalState.movie}
          onClose={closeMovieModal}
          onSubmit={
            modalState.mode === "edit" ? handleUpdateMovie : handleAddMovie
          }
        />

        {feedbackModal.open && (
          <div className="modal-backdrop" onClick={closeFeedbackModal}>
            <div
              className={`feedback-modal ${feedbackModal.type}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{feedbackModal.type === "success" ? "Success" : "Error"}</h3>
              <p>{feedbackModal.message}</p>

              <div className="confirm-delete-actions">
                <button
                  type="button"
                  className={
                    feedbackModal.type === "success"
                      ? "ghost-action"
                      : "danger-action"
                  }
                  onClick={closeFeedbackModal}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
