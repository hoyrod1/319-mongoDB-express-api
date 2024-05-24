import express, { response } from "express";
import dotenv from "dotenv";
import { request } from "http";
import { error } from "console";
dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

// JSON middleware
app.use(express.json());

app.get("/", (request, response) => {
  response.send(`Welcom to the grade API`);
});

app.use((error, request, response, next) => {
  response.status(500).send(`Seems like we messed up somewhere...`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
