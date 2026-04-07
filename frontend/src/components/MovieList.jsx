import MovieCard from "./MovieCard";

export default function MovieList({ movies, selectedMovieId, onSelect }) {
  return (
    <section className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isSelected={movie.id === selectedMovieId}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}
