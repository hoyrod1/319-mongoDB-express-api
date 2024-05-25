import express, { response } from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

// connect to DB
// import "./db/conn.mjs";

import grades from "./routes/grades.mjs";
import { request } from "http";

// JSON middleware
app.use(express.json());

app.get("/", (request, response) => {
  response.send(`Welcom to the grade API`);
});

app.use("/grades", grades);

// app.use("/grades", (request, response) => {
//   response.send(`You are on the grades route`);
// });

app.use((error, request, response, next) => {
  response.status(500).send(`Seems like we messed up somewhere...`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
