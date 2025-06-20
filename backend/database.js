import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.URI;

const database = mysql.createPool(uri);

export default database;
