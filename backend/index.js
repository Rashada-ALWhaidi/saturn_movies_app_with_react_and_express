import express from 'express';
import {init} from "./src/routes.js"


const app = express();
const PORT = 3001;


init(express,app)

app.listen(PORT, () => {
  console.log(`Server runs successfully `);
});


