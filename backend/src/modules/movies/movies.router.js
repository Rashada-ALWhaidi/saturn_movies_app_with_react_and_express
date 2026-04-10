import {Router} from "express";
import * as controller from "./movies.controller.js"
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// GET /movies
router.get("/", asyncHandler(controller.getMovies));

// limit the number of movies returned
router.get("/limit", asyncHandler(controller.limitMovies));

// Search movies by title
router.get("/search", asyncHandler(controller.searchMoviesByTitle));

// GET /movies/:id
router.get("/:id", asyncHandler(controller.getMovieById));

// post /movies
router.post("/", asyncHandler(controller.createMovie));

// update movie
router.patch("/:id", asyncHandler(controller.updateMovie));

// delete movie
router.delete("/:id", asyncHandler(controller.deleteMovie));





export default router;