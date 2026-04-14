import "dotenv/config";
import express from "express";
import cors from "cors";
import { init } from "./src/routes.js";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

init(express, app);

app.listen(PORT, () => {
  console.log(`Server runs successfully on http://localhost:${PORT}`);
});
