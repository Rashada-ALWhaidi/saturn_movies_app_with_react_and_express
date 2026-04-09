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

// get a single movie by id
export const getMovieById = async(req, res) => {
  const { id } = req.params;
  const movie = await service.getMovieById(id);
  res.json({
    message: "success",
    data: {
      movie
    }
  });
}


// create movie
export const createMovie = async(req,res)=>{
  const { title, director, releaseYear } = req.body;
  const newMovie = await service.createMovie({ title, director, releaseYear });
  if (!newMovie) {
    return res.status(400).json({
      message: "Failed to create movie"

    });
  }
  res.json({
    message: "Movie created successfully",
    data: {
      movie: newMovie
    }
  });
}

// update movie
export const updateMovie = async(req,res)=>{
  const { id } = req.params;
  const { title, director, releaseYear } = req.body;

  const updatedMovie = await service.updateMovie(id, { title, director, releaseYear });
   
  if (!updatedMovie) {
    return res.status(400).json({
      message: "Failed to update movie"
    });
  }
  res.json({
    message: "Movie updated successfully",
    data: {
      movie: updatedMovie
    }
  });
}


// delete movie
export const deleteMovie = async(req,res)=>{
  const { id } = req.params;
  const deletedMovie = await service.deleteMovie(id);
  if (!deletedMovie) {
    return res.status(400).json({
      message: "Failed to delete movie"
    });
  }
  res.json({
    message: "Movie deleted successfully",
    data: {
      movie: deletedMovie
    }
  });

}


// search movies by title
export const searchMoviesByTitle = async(req,res)=>{
  const { title } = req.query;
  const movies = await service.searchMoviesByTitle(title);

  res.json({
    message: "Movies retrieved successfully",
    data: {
      movies
    }
  });



}
