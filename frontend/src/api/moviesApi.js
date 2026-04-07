import { mockMovies } from './../data/mockMovies';

const wait = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeMovie = (movie) => ({
  id: movie.id,
  primaryTitle: movie.primaryTitle?.trim() || 'Untitled Movie',
  startYear: Number(movie.startYear) || 0,
  runtimeMinutes: Number(movie.runtimeMinutes) || 0,
  genres: Array.isArray(movie.genres) ? movie.genres : [],
  averageRating: Number(movie.averageRating) || 0,
  plot: movie.plot?.trim() || 'No description available.',
  primaryImage: movie.primaryImage?.trim() || ''
});

export async function getMovies({ limit = 20 } = {}) {
  await wait();
  return mockMovies.slice(0, Number(limit)).map(normalizeMovie);
}
