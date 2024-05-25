import express from "express";
// connect to DB
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { send } from "process";

const router = express.Router();

router.get("/:id", async (request, response) => {
  let id;
  try {
    id = new ObjectId(request.params.id);
  } catch (error) {
    response.status(404).send(`Id not found`);
  }

  let collection = await db.collection("grades");
  let query = { _id: id };
  let result = await collection.findOne(query);

  if (!result) {
    response.send(`File not found`).status(400);
  } else {
    console.log("Connected");
    response.send(result).status(200);
  }
});

export default router;
