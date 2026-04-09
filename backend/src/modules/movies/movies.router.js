import {Router} from "express";
import * as controller from "./movies.controller.js"
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// GET /movies
router.get("/", asyncHandler(controller.getMovies));

// GET /movies/:id
router.get("/:id", asyncHandler(controller.getMovieById));

// post /movies
router.post("/", asyncHandler(controller.createMovie));

// update movie
router.patch("/:id", asyncHandler(controller.updateMovie));

// delete movie
router.delete("/:id", asyncHandler(controller.deleteMovie));

// Search movies by title
router.get("/search", asyncHandler(controller.searchMoviesByTitle));




export default router;