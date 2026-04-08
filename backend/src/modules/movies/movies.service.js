import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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