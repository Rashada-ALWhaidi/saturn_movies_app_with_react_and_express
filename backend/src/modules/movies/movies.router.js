import {Router} from "express";
import * as controller from "./movies.controller.js"

const router = Router();

// GET /movies
router.get("/", controller.getMovies);


export default router;