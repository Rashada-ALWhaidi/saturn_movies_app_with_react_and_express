import * as service from "./movies.service.js";

// get all movies
export const getMovies = async(req, res) => {
  const movies = await service.getAllMovies();
  res.json({
    message: "Movies retrieved successfully",
    data: {
      movies
    }
  });
}