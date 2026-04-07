import { useEffect, useMemo, useState } from "react";
import { getMovies } from "./api/moviesApi";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await getMovies({ search: searchValue, limit: 20 });

        setMovies(data);

        setStatusMessage(
          data.length
            ? `${data.length} movie${data.length > 1 ? "s" : ""} found.`
            : "No movies found for this search.",
        );

        setSelectedMovieId((prev) =>
          data.some((movie) => movie.id === prev)
            ? prev
            : (data[0]?.id ?? null),
        );
      } catch (error) {
        setStatusMessage(error.message || "Failed to load movies.");
      }
    };

    loadMovies();
  }, [searchValue]);

  const selectedMovie = useMemo(() => {
    return movies.find((movie) => movie.id === selectedMovieId) || null;
  }, [movies, selectedMovieId]);

  return (
    <main className="app-shell">
      <header className="top-bar">
        <h1>Movie App</h1>

        <input
          type="text"
          placeholder="Search by movie title..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
      </header>

      <p className="status-message">{statusMessage}</p>

      <section className="hero-content">
        <MovieDetails movie={selectedMovie} />
      </section>

      <section className="movies-section">
        <MovieList
          movies={movies}
          selectedMovieId={selectedMovieId}
          onSelect={setSelectedMovieId}
        />
      </section>
    </main>
  );
}
