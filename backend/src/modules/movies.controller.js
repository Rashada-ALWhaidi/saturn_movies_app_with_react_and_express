import * as movieService from "./movies.service.js";

// get all movies
export const getMovies = async (req, res, next) => {
  try {
    const movies = await movieService.getAllMovies();

    res.status(200).json({
      message: "Movies retrieved successfully",
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};

// get a single movie by id
export const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await movieService.getMovieById(id);

    res.json({
      message: "Movie retrieved successfully",
      data: { movie },
    });
  } catch (error) {
    next(error);
  }
};

// create movie
export const createMovie = async (req, res, next) => {
  try {
    const movie = await movieService.createMovie(req.body);

    res.status(201).json({
      message: "Movie created successfully",
      data: { movie },
    });
  } catch (error) {
    next(error);
  }
};

// update movie
export const updateMovie = async (req, res, next) => {
  try {
    const movie = await movieService.updateMovie(req.params.id, req.body);

    res.status(200).json({
      message: "Movie updated successfully",
      data: { movie },
    });
  } catch (error) {
    next(error);
  }
};

// delete movie
export const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMovie = await movieService.deleteMovie(id);

    res.json({
      message: "Movie deleted successfully",
      data: { movie: deletedMovie },
    });
  } catch (error) {
    next(error);
  }
};

// search movies by title
export const searchMoviesByTitle = async (req, res, next) => {
  try {
    const { title } = req.query;
    const movies = await movieService.searchMoviesByTitle(title);

    res.json({
      message: "Movies retrieved successfully",
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};

// limit the number of movies returned
export const limitMovies = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const movies = await movieService.limitMovies(parseInt(limit));

    res.json({
      message: "Movies retrieved successfully",
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};
