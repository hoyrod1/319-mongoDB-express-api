import express, { response } from "express";
// connect to DB
// import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { send } from "process";
import { request } from "http";

const router = express.Router();
//========================================================================//

//========================================================================//
// Create a single grade resource
router.post("/", async (request, response) => {
  try {
    const grades = await db.collection("grades");
    const newDocument = request.body;

    // Rename fieilds for backward compatibility
    if (newDocument.student_id) {
      newDocument.student_id = newDocument.student_id;

      delete newDocument.student_id;
    }

    const result = await grades.insertOne(newDocument);
    response.json(result).status(204);
  } catch (error) {
    response.send(error.message).status(error.status ? error : 400);
  }
});
//========================================================================//

//========================================================================//
// Get a single grade resource using the route - /api/grades/:id
router.get("/:id", async (request, response) => {
  let id;
  try {
    id = new ObjectId(request.params.id);
  } catch (error) {
    response.status(404).send(`Id not found`);
  }

  const collection = await db.collection("grades");
  const query = { _id: id };
  const result = await collection.findOne(query);

  if (!result) {
    response.send(`File not found`).status(400);
  } else {
    response.json(result).status(200);
  }
});
//-------------------------------------------------------------------------//
// Add a score to a grade entry using the route - /api/grades/:id
router.patch("/:id/add", async (request, response) => {
  try {
    const grades = await db.collection("grades");
    const query = { _id: new ObjectId(request.params.id) };
    const result = await grades.updateOne(query, {
      $push: { scores: req.body },
    });

    if (!result) {
      const error = new Error("Result not found!");
      error.status = 404;
      throw error;
    } else {
      // console.log("Connected");
      response.json(result).status(200);
    }
  } catch (error) {
    response.send(error.message).status(error.status ? error : 400);
  }
});
//-------------------------------------------------------------------------//
// Remove a score to a grade entry using the route - /api/grades/:id
router.patch("/:id/remove", async (request, response) => {
  try {
    const grades = await db.collection("grades");
    const query = { _id: new ObjectId(request.params.id) };
    const result = await grades.updateOne(query, {
      $pull: { scores: req.body },
    });

    if (!result) {
      const error = new Error("Result not found!");
      error.status = 404;
      throw error;
    } else {
      // console.log("Connected");
      response.json(result).status(200);
    }
  } catch (error) {
    response.send(error.message).status(error.status ? error : 400);
  }
});
//-------------------------------------------------------------------------//
// Delete a single grade resource using the route - /api/grades/:id
router.delete("/:id", async (request, response) => {
  let id;
  try {
    id = new ObjectId(request.params.id);
  } catch (error) {
    response.status(404).send(`Students data was not found`);
  }

  const grades = await db.collection("grades");
  const query = { _id: id };
  const result = await grades.deleteOne(query);

  if (!result) response.send(`Resource was not deleted`).status(400);
  else response.json(result).status(200);
});
//=========================================================================//

//=========================================================================//
// Get a student's resources backwards compatibility
// using the route - /api/grades/student/:id
router.get("/student/:id", async (request, response) => {
  response.redirect(`/api/grades/learner/${request.params.id}`);
});
//-------------------------------------------------------------------------//
// Get a student's grade resource using the route - /api/grades/learner/:id
router.get("/learner/:id", async (request, response) => {
  try {
    const grades = await db.collection("grades");
    const query = { learner_id: Number(request.params.id) };

    if (request.query.class) {
      query.class_id = Number(request.query.class);
    }

    const result = await grades.find(query).toArray();

    if (!result.length) {
      const error = new Error("Result not found!");
      error.status = 404;
      throw error;
    } else {
      // console.log("Connected");
      response.json(result).status(200);
    }
  } catch (error) {
    response.send(error.message).status(error.status ? error : 400);
  }
});
//-------------------------------------------------------------------------//
// Delete a student's grade resource
router.delete("/learner/:id", async (request, response) => {
  const grades = await db.collection("grades");
  const query = { learner_id: Number(request.params.id) };

  const result = await grades.deleteOne(query);

  if (!result) response.send(`Resource not found`).status(400);
  else response.json(result).status(200);
});
//=========================================================================//

//=========================================================================//
//----------------------- Get a class's grades data -----------------------//
router.get("/class/:id", async (request, response) => {
  let id;
  try {
    id = Number(request.params.id);
  } catch (error) {
    response.status(404).send(`The class id was not found`);
  }

  const classCollection = await db.collection("grades");
  const query = { class_id: id };

  // check for learner_id parameter
  if (request.query.learner) query.learner_id = Number(request.query.learner);

  const result = await classCollection.find(query).toArray();

  if (!result) response.send(`Resource not found`).status(400);
  else response.json(result).status(200);
});
//---------------------- Update a class's grade data ----------------------//
router.patch("/class/:id", async (request, response) => {
  const classCollection = await db.collection("grades");
  const query = { class_id: Number(request.params.id) };

  const result = await classCollection.updateMany(query, {
    $set: { class_id: request.body.class_id },
  });

  if (!result) response.send(`Resource not found`).status(400);
  else response.json(result).status(200);
}); //-------------------- Delete a class's grade data --------------------//
router.delete("/class/:id", async (request, response) => {
  const classCollection = await db.collection("grades");
  const query = { class_id: Number(request.params.id) };

  const result = await classCollection.deleteMany(query);

  if (!result) response.send(`Resource not found`).status(400);
  else response.json(result).status(200);
});
//=========================================================================//

//=========================================================================//
export default router;
