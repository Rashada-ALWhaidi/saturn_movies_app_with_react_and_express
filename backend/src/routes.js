import moviesRouter from "./modules/movies/movies.router.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";


export function init(express, app){

app.use(express.json())

app.use("/movies",moviesRouter)

app.use(globalErrorHandler);

}
