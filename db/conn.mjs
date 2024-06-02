//============== Importing MongoClient ==============//
import { MongoClient } from "mongodb";
//===================================================//

//============= Importing the .env file =============//
// containing the connection string and the PORT number
import dotenv from "dotenv";
dotenv.config();
//===================================================//

//===================================================//
// Cashing the connection string from the .env file
// to connectionString
const connectionString = process.env.ATLAS_URI || "";
//===================================================//
// Connect to database using MongoDB drivers
const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log(`Succesfully connected`);
} catch (e) {
  console.error(e);
}

let db = conn.db("sample_training");

export default db;
//===================================================//
