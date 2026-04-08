import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { AppError } from '../../utils/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, "../../data/movies-db.json");

// function to read the movies data from the JSON file
async function readJsonFile() {
    const data = await fs.readFile(filePath, "utf-8");
    const movies = JSON.parse(data);
    return movies;
}

// get all movies
export const getAllMovies = async() => {
     const readingData = await readJsonFile();
    return readingData;
}

// get a single movie by id
export const getMovieById = async(id) => {
    const readingData = await readJsonFile();
    const movie = readingData.find(movie => movie.id === parseInt(id));
    return movie;
    
}

// create a new movie
export const createMovie = async({ title, director, releaseYear }) => {
    const readingData = await readJsonFile();
 
    // validate if the movie already exists
    const existingMovie = readingData.find(movie => movie.title === title);
    if (existingMovie) {
        throw new AppError("Movie already exists", 400);
    }

    // validate the input data
    if (!title || !director || !releaseYear) {
        throw new AppError("Missing required fields", 400);
    }

    // create a new movie object
    const newMovie = {
        id: readingData.length + 1,
        title,
        director,
        releaseYear 
    };
  
    // add the new movie to the existing data
    readingData.push(newMovie);

    // write the updated data back to the JSON file
    await fs.writeFile(filePath, JSON.stringify(readingData, null, 2));
    return newMovie;


}