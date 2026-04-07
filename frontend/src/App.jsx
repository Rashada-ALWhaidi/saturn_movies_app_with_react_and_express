import { useEffect, useMemo, useState } from "react";
import { getMovies } from "./api/moviesApi";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await getMovies({ limit: 20 });
      setMovies(data);

      if (data.length > 0) {
        setSelectedMovieId(data[0].id);
      }
    };

    loadMovies();
  }, []);

  const selectedMovie = useMemo(() => {
    return movies.find((movie) => movie.id === selectedMovieId) || null;
  }, [movies, selectedMovieId]);

  return (
    <main className="app-shell">
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
