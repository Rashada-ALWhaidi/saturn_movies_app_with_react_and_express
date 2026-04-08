import {Router} from "express";
import * as controller from "./movies.controller.js"

const router = Router();

// GET /movies
router.get("/", controller.getMovies);

// GET /movies/:id
router.get("/:id", controller.getMovieById);

export default router;