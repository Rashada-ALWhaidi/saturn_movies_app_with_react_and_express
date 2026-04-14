import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export const getMoviePoster = async (imdbId) => {
  try {
    if (!imdbId || !TMDB_API_KEY) return "";

    const response = await axios.get(`https://api.themoviedb.org/3/find/${imdbId}`, {
      params: {
        api_key: TMDB_API_KEY,
        external_source: "imdb_id",
      },
    });

    const movie = response.data?.movie_results?.[0];

    if (!movie?.poster_path) return "";

    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  } catch (error) {
    console.error("TMDB ERROR:", error.response?.data || error.message);
    return "";
  }
};
