import { mockMovies } from "../data/mockMovies";

const wait = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

let moviesStore = [...mockMovies];

const normalizeSearchText = (value = "") =>
  String(value).toLowerCase().trim().replace(/\s+/g, " ");

const normalizeMovie = (movie) => ({
  id: movie.id || crypto.randomUUID(),
  primaryTitle: movie.primaryTitle?.trim() || "Untitled Movie",
  startYear: Number(movie.startYear) || "----",
  runtimeMinutes: Number(movie.runtimeMinutes) || 0,
  genres: Array.isArray(movie.genres)
    ? movie.genres.filter(Boolean)
    : String(movie.genres || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
  averageRating: Number(movie.averageRating) || 0,
  plot: movie.plot?.trim() || "No description available for this movie yet.",
  primaryImage: movie.primaryImage?.trim() || "",
});

export async function getMovies({ search = "", limit } = {}) {
  await wait();

  let movies = [...moviesStore].map(normalizeMovie);
  const q = normalizeSearchText(search);

  if (q) {
    movies = movies.filter((movie) =>
      normalizeSearchText(movie.primaryTitle).includes(q),
    );
  }

  if (limit) {
    movies = movies.slice(0, Number(limit));
  }

  return movies;
}

export async function getMovieById(id) {
  await wait();
  const movie = moviesStore.find((item) => item.id === id);
  if (!movie) throw new Error("Movie not found");
  return normalizeMovie(movie);
}

export async function addMovie(movieData) {
  await wait();
  const movie = normalizeMovie({ ...movieData, id: crypto.randomUUID() });
  moviesStore = [movie, ...moviesStore];
  return movie;
}

export async function updateMovie(id, movieData) {
  await wait();
  let updatedMovie = null;

  moviesStore = moviesStore.map((movie) => {
    if (movie.id !== id) return movie;

    updatedMovie = normalizeMovie({ ...movie, ...movieData, id });
    return updatedMovie;
  });

  if (!updatedMovie) throw new Error("Movie not found");

  return updatedMovie;
}

export async function deleteMovie(id) {
  await wait();
  const exists = moviesStore.some((movie) => movie.id === id);

  if (!exists) throw new Error("Movie not found");

  moviesStore = moviesStore.filter((movie) => movie.id !== id);
  return { success: true };
}
