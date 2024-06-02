import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongoose";

const router = express.Router();
/**
 * It is not best practice to seperate these routes
 * like we have done here. This file was created
 * specifically for educational purposes, to contain
 * all aggregation routes in one place.
 */

/**
 * Grading Weights by Score Type:
 * - Exams: 50%
 * - Quizes: 30%
 * - Homework: 20%
 */

// Get the weighted average of a specified learner's grades, per class
router.get("/learner/:id/avg-class", async (req, res) => {
  let collection = await db.collection("grades");

  let result = await collection
    .aggregate([
      {
        $match: { learner_id: Number(req.params.id) },
      },
      {
        $unwind: { path: "$scores" },
      },
      {
        $group: {
          _id: "$class_id",
          quiz: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "quiz"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          exam: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "exam"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          homework: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "homework"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          class_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
    ])
    .toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});
//========================================================================//

//========================================================================//
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
//--------------------------------------------------------------------//
//====================================================================//
// Aggregate grades
// router.get("/aggregate", async (request, response) => {
//   try {
//     const grades = await db.collection("grades");
//     let result = await grades
//       .aggregate([
//         {
//           $set: {
//             avg: {
//               $avg: "$scores.score",
//             },
//           },
//         },
//         {
//           $sample: { size: 5 },
//         },
//       ])
//       .toArray();

//     response.send(result);
//---------------------------------------------------------------------//
//     let result = await grades
//     .aggregate([
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
//       {
//         $sort: { avg: -1 },
//       },
//       {
//         $limit: 5,
//       },
//     {
//       $skip: 1,
//     },
//     {
//       $match: { class_id: 4 },
//     },
//     {
//       $count: "numberOfEntries",
//     },
//     ])
//       .toArray();
//     response.json(result);
//     //-----------------------------------------------------//
//     const query = { _id: new ObjectId(request.params.id) };
//     const result = await grades.updateOne(query, {
//       $push: { scores: req.body },
//     });

//     if (!result) {
//       const error = new Error("Result not found!");
//       error.status = 404;
//       throw error;
//     } else {
//       // console.log("Connected");
//       response.json(result).status(200);
//     }
//     //-----------------------------------------------------//
//   } catch (error) {
//     response.send(error.message).status(error.status ? error : 400);
//   }
// });
//========================================================================//

export default router;
