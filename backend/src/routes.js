import moviesRouter from "./modules/movies/movies.router.js";


export function init(express, app){

app.use(express.json())

app.use("/movies",moviesRouter)


}

