import { useEffect, useState } from "react";
import { getMovies } from "./api/moviesApi";
import MovieList from "./components/MovieList";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState({
    type: "loading",
    message: "Loading movies...",
  });

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setStatus({ type: "loading", message: "Loading movies..." });
        const data = await getMovies({ limit: 20 });
        setMovies(data);
        setStatus({
          type: "success",
          message: `${data.length} movies loaded.`,
        });
      } catch (error) {
        setStatus({
          type: "error",
          message: error.message || "Failed to load movies.",
        });
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1>Movie App</h1>
          <p className="hero__text">
            React frontend rebuild started with the first task: displaying the
            movie list while keeping the visual direction close to the original
            project.
          </p>
          <p className={`status-message status-message--${status.type}`}>
            {status.message}
          </p>
        </div>
      </header>

      <main className="page-content">
        <MovieList movies={movies} />
      </main>
    </div>
  );
}
