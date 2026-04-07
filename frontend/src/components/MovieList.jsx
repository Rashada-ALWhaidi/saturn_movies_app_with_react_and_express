import MovieCard from './MovieCard';

export default function MovieList({ movies }) {
  if (!movies.length) {
    return <p className="status-message">No movies available.</p>;
  }

  return (
    <section className="movie-strip-section">
      <div className="section-header">
        <h2>Movie List</h2>
        <span>{movies.length} movies</span>
      </div>

      <div className="movie-strip">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
