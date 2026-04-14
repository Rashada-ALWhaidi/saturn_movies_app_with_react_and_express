import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getMoviePoster } from "../utils/tmdb.js";
import { AppError } from "../utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, "../data/movies-db.json");

async function readJsonFile() {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function writeJsonFile(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function enrichMovie(movie) {
  if (!movie) return movie;

  if (movie.primaryImage) {
    return movie;
  }

  const primaryImage = await getMoviePoster(movie.imdb_id);

  return {
    ...movie,
    primaryImage: primaryImage || "",
  };
}

async function enrichMovies(movies) {
  return Promise.all(movies.map(enrichMovie));
}

export const getAllMovies = async () => {
  const readingData = await readJsonFile();
  return enrichMovies(readingData);
};

export const getMovieById = async (id) => {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new AppError("Invalid movie ID", 400);
  }

  const readingData = await readJsonFile();
  const movie = readingData.find((item) => Number(item.id) === parsedId);

  if (!movie) {
    throw new AppError("Movie not found", 404);
  }

  return enrichMovie(movie);
};

export const createMovie = async ({
  title,
  release_date,
  vote_average,
  runtime,
  overview,
  genres,
  primaryImage,
}) => {
  const readingData = await readJsonFile();

  const normalizedTitle = String(title || "").trim();
  const normalizedReleaseDate = String(release_date || "").trim();
  const normalizedOverview = String(overview || "").trim();
  const normalizedGenres = String(genres || "").trim();
  const normalizedPrimaryImage = String(primaryImage || "").trim();

  const existingMovie = readingData.find(
    (movie) =>
      String(movie.title || "").toLowerCase() === normalizedTitle.toLowerCase(),
  );

  if (existingMovie) {
    throw new AppError("Movie already exists", 400);
  }

  if (
    !normalizedTitle ||
    !normalizedReleaseDate ||
    vote_average === undefined ||
    vote_average === null ||
    runtime === undefined ||
    runtime === null ||
    !normalizedOverview ||
    !normalizedGenres
  ) {
    throw new AppError("Missing required fields", 400);
  }

  const newId = readingData.length
    ? Math.max(...readingData.map((movie) => Number(movie.id) || 0)) + 1
    : 1;

  const newMovie = {
    id: newId,
    title: normalizedTitle,
    release_date: normalizedReleaseDate,
    vote_average,
    runtime,
    overview: normalizedOverview,
    genres: normalizedGenres,
    primaryImage: normalizedPrimaryImage,
  };

  const enrichedMovie = await enrichMovie(newMovie);

  readingData.push(enrichedMovie);
  await writeJsonFile(readingData);

  return enrichedMovie;
};

export const updateMovie = async (
  id,
  {
    title,
    release_date,
    vote_average,
    runtime,
    overview,
    genres,
    primaryImage,
  },
) => {
  const readingData = await readJsonFile();

  const movieIndex = readingData.findIndex(
    (movie) => Number(movie.id) === Number(id),
  );

  if (movieIndex === -1) {
    throw new AppError("Movie not found", 404);
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    throw new AppError("Title must be a non-empty string", 400);
  }

  if (
    release_date !== undefined &&
    (typeof release_date !== "string" || release_date.trim() === "")
  ) {
    throw new AppError("Release date must be a non-empty string", 400);
  }

  if (
    vote_average !== undefined &&
    (typeof vote_average !== "number" || vote_average < 1 || vote_average > 10)
  ) {
    throw new AppError("Rating must be a number between 1 and 10", 400);
  }

  if (runtime !== undefined && (typeof runtime !== "number" || runtime < 1)) {
    throw new AppError("Runtime must be a positive number", 400);
  }

  if (
    overview !== undefined &&
    (typeof overview !== "string" || overview.trim() === "")
  ) {
    throw new AppError("Overview must be a non-empty string", 400);
  }

  if (
    genres !== undefined &&
    (typeof genres !== "string" || genres.trim() === "")
  ) {
    throw new AppError("Genres must be a non-empty string", 400);
  }

  if (primaryImage !== undefined && typeof primaryImage !== "string") {
    throw new AppError("Primary image must be a string", 400);
  }

  const updatedMovie = {
    ...readingData[movieIndex],
    ...(title !== undefined && { title: title.trim() }),
    ...(release_date !== undefined && { release_date: release_date.trim() }),
    ...(vote_average !== undefined && { vote_average }),
    ...(runtime !== undefined && { runtime }),
    ...(overview !== undefined && { overview: overview.trim() }),
    ...(genres !== undefined && { genres: genres.trim() }),
    ...(primaryImage !== undefined && { primaryImage: primaryImage.trim() }),
  };

  const enrichedMovie = await enrichMovie(updatedMovie);

  readingData[movieIndex] = enrichedMovie;
  await writeJsonFile(readingData);

  return enrichedMovie;
};

export const deleteMovie = async (id) => {
  const readingData = await readJsonFile();
  const movieIndex = readingData.findIndex(
    (movie) => Number(movie.id) === Number(id),
  );

  if (movieIndex === -1) {
    throw new AppError("Movie not found", 404);
  }

  const deletedMovie = readingData[movieIndex];
  readingData.splice(movieIndex, 1);
  await writeJsonFile(readingData);

  return deletedMovie;
};

export const searchMoviesByTitle = async (title) => {
  const readingData = await readJsonFile();

  const filteredMovies = readingData.filter((movie) =>
    String(movie.title || "")
      .toLowerCase()
      .includes(
        String(title || "")
          .toLowerCase()
          .trim(),
      ),
  );

  return enrichMovies(filteredMovies);
};

export const limitMovies = async (limit) => {
  const readingData = await readJsonFile();
  const limitedMovies = readingData.slice(0, Number(limit) || 20);
  return enrichMovies(limitedMovies);
};
