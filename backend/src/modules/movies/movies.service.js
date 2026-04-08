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

// find the movie with the matching id
    const movie = readingData.find(movie => movie.id === parseInt(id));

// validate if the movie exists
    const movieExists = readingData.some(movie => movie.id === parseInt(id));
    if (!movieExists) {
        throw new Error("Movie not found");
    }
    
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


// update a movie
export const updateMovie = async(id, { title, director, releaseYear }) => {
    const readingData = await readJsonFile();

    // find the index of the movie to be updated
    const movieIndex = readingData.findIndex(movie => movie.id === parseInt(id));
    if (movieIndex === -1) {
        throw new AppError("Movie not found", 404);
    }

    // validate input data
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        throw new AppError("Title must be a non-empty string", 400);
    }
    if (director !== undefined && (typeof director !== 'string' || director.trim() === '')) {
        throw new AppError("Director must be a non-empty string", 400);
    }
    if (releaseYear !== undefined && (typeof releaseYear !== 'number' || releaseYear <= 0)) {
        throw new AppError("Release year must be a positive number", 400);
    }

    // update only provided fields
    const updatedMovie = {
        ...readingData[movieIndex],
        ...(title && { title: title.trim() }),
        ...(director && { director: director.trim() }),
        ...(releaseYear && { releaseYear })
    };

    readingData[movieIndex] = updatedMovie;

    // save the updated data to the JSON file
    await fs.writeFile(filePath, JSON.stringify(readingData, null, 2));
    return updatedMovie;
}