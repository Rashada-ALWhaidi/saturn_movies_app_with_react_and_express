const API_BASE_URL = "http://localhost:3001/movies";

const normalizeMovie = (movie) => ({
  id: Number(movie.id),
  primaryTitle:
    movie.primaryTitle?.trim() || movie.title?.trim() || "Untitled Movie",
  startYear:
    Number(movie.startYear) ||
    Number(
      String(movie.release_date || "")
        .split("/")
        .pop(),
    ) ||
    Number(String(movie.release_date || "").slice(0, 4)) ||
    "----",
  runtimeMinutes: Number(movie.runtimeMinutes) || Number(movie.runtime) || 0,
  genres: Array.isArray(movie.genres)
    ? movie.genres.filter(Boolean)
    : String(movie.genres || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
  averageRating: Number(
    (Number(movie.averageRating) || Number(movie.vote_average) || 0).toFixed(1),
  ),
  plot:
    movie.plot?.trim() ||
    movie.overview?.trim() ||
    "No description available for this movie yet.",
  primaryImage:
    movie.primaryImage?.trim() ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : ""),
});

async function handleResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("API Error Response:", data);
    throw new Error(
      data?.message ||
        data?.error ||
        data?.errors?.[0]?.message ||
        "Request failed",
    );
  }

  return data;
}

export async function getMovies({ search = "", limit } = {}) {
  let url = API_BASE_URL;

  if (search) {
    url = `${API_BASE_URL}/search?title=${encodeURIComponent(search)}`;
  } else if (limit) {
    url = `${API_BASE_URL}/limit?limit=${encodeURIComponent(limit)}`;
  }

  const response = await fetch(url);
  const result = await handleResponse(response);

  const movies =
    result?.data?.movies || result?.movies || result?.data || result || [];

  return Array.isArray(movies) ? movies.map(normalizeMovie) : [];
}

export async function getMovieById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const result = await handleResponse(response);

  const movie = result?.data?.movie || result?.data || result;

  return normalizeMovie(movie);
}

export async function addMovie(movieData) {
  const payload = {
    title: String(movieData.primaryTitle || "").trim() || "Untitled Movie",
    runtime: Number(movieData.runtimeMinutes) || 0,
    vote_average: Number(movieData.averageRating) || 0,
    overview: String(movieData.plot || "").trim(),
    genres: Array.isArray(movieData.genres)
      ? movieData.genres.join(", ")
      : String(movieData.genres || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .join(", "),
    release_date: movieData.startYear
      ? `01/01/${movieData.startYear}`
      : "01/01/2024",
    primaryImage: String(movieData.primaryImage || "").trim(),
  };
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await handleResponse(response);
  const movie = result?.data?.movie || result?.data || result;

  return normalizeMovie(movie);
}

export async function updateMovie(id, movieData) {
  const genresValue = Array.isArray(movieData.genres)
    ? movieData.genres.join(", ")
    : String(movieData.genres || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(", ");

  const payload = {
    title: String(movieData.primaryTitle || "").trim() || "Untitled Movie",
    release_date: movieData.startYear
      ? `01/01/${movieData.startYear}`
      : "01/01/2024",
    runtime: Number(movieData.runtimeMinutes) || 0,
    vote_average: Number(movieData.averageRating) || 0,
    overview: String(movieData.plot || "").trim() || "No overview",
    genres: genresValue || "Unknown",
    primaryImage: String(movieData.primaryImage || "").trim(),
  };

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await handleResponse(response);
  const movie = result?.data?.movie || result?.data || result;

  return normalizeMovie(movie);
}
export async function deleteMovie(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}
