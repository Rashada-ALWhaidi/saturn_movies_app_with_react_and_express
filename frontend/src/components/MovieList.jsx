import { useRef } from "react";
import MovieCard from "./MovieCard";

export default function MovieList({
  movies,
  selectedMovieId,
  previewMovieId,
  onHover,
  onLeave,
  onSelect,
}) {
  const listRef = useRef(null);

  const scrollLeft = () => {
    listRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    listRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <>
      <div className="carousel-controls">
        <button type="button" className="nav-btn" onClick={scrollLeft}>
          ‹
        </button>
        <button type="button" className="nav-btn" onClick={scrollRight}>
          ›
        </button>
      </div>

      <div className="movie-strip" ref={listRef}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isSelected={movie.id === selectedMovieId}
            isPreview={movie.id === previewMovieId}
            onHover={onHover}
            onLeave={onLeave}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
}
