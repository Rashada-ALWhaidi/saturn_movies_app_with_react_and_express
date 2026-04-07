import { useRef } from "react";
import MovieCard from "./MovieCard";

export default function MovieList({ movies, selectedMovieId, onSelect }) {
  const listRef = useRef(null);

  const scrollLeft = () => {
    listRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    listRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="movie-list-section">
      <div className="movie-list-header">
        <h2>Popular Movies</h2>

        <div className="carousel-actions">
          <button type="button" onClick={scrollLeft} className="carousel-btn">
            ❮
          </button>
          <button type="button" onClick={scrollRight} className="carousel-btn">
            ❯
          </button>
        </div>
      </div>

      <div className="movie-list" ref={listRef}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isSelected={movie.id === selectedMovieId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
