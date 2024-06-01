import express from "express";
// connect to DB
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { send } from "process";

const router = express.Router();
//==============================================================//

//==============================================================//
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
//====================================================================//
//====================================================================//
// Aggregate grades
router.get("/aggregate", async (request, response) => {
  try {
    const grades = await db.collection("grades");
    let result = await grades
      .aggregate([
        {
          $set: {
            avg: {
              $avg: "$scores.score",
            },
          },
        },
        {
          $sample: { size: 5 },
        },
      ])
      .toArray();

    response.send(result);
    //-----------------------------------------------------//
    // let result = await grades
    // .aggregate([
    //   {
    //     $project: {
    //       _id: 0,
    //       learner_id: 1,
    //       class_id: 1,
    //       avg: {
    //         $avg: "$scores.score",
    //       },
    //     },
    //   },
    //   {
    //     $sort: { avg: -1 },
    //   },
    //   {
    //     $limit: 5,
    //   },
    // {
    //   $skip: 1,
    // },
    // {
    //   $match: { class_id: 4 },
    // },
    // {
    //   $count: "numberOfEntries",
    // },
    // ])
    //   .toArray();
    // response.json(result);
    //-----------------------------------------------------//
    // const query = { _id: new ObjectId(request.params.id) };
    // const result = await grades.updateOne(query, {
    //   $push: { scores: req.body },
    // });

    // if (!result) {
    //   const error = new Error("Result not found!");
    //   error.status = 404;
    //   throw error;
    // } else {
    //   // console.log("Connected");
    //   response.json(result).status(200);
    // }
    //-----------------------------------------------------//
  } catch (error) {
    response.send(error.message).status(error.status ? error : 400);
  }
});
//====================================================================//
//====================================================================//
// Get a single Grade resource
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
    console.log("Connected");
    response.send(result).status(200);
  }
});
//------------------------------------------------------------------//
// Delete a single resource
router.delete("/:id", async (request, response) => {});
//------------------------------------------------------------------//
// Get a student's grade resources
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
// Get a student's resources backwards compatibility
router.get("/student/:id", async (request, response) => {
  response.redirect(`../learner/${request.params.id}`);
});
//------------------------------------------------------------------//
// Get all the classes resources
router.get("/class/:id", async (request, response) => {
  try {
    const grades = await db.collection("grades");
    const query = { class_id: Number(request.params.id) };
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
//====================================================================//
//====================================================================//
// Update classes resources
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
// Get a average weighted Grade resource
// router.get("/learner/:id/avg", async (request, response) => {
//   let grades = await db.collection("grades");

//   let result = await grades
//     .aggregate([
//       {
//         $match: { learner_id: Number(request.params.id) },
//       },
//       {
//         $project: {
//           _id: 0,
//           learner_id: 1,
//           class_id: 1,
//           avg: {
//             $avg: "$scores.score",
//           },
//         },
//       },
//       // {
//       //   $group: {
//       //     _id: null,
//       //     avg: {
//       //       $avg: "$scores.score",
//       //     },
//       //   },
//       // },
//     ])
//     .toArray();

//   if (!result) response.send("Not found").status(404);
//   else response.send(result).status(200);
// });
//------------------------------------------------------------------//
//====================================================================//
//====================================================================//
export default router;
