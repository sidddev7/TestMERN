import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import dbconfig from "./config/dbConfig.js";
import users from "./routes/users.js";
import todo from "./routes/todo.js";
import { AuthVerifyAdminUser } from "./middleware/auth.js";
const app = express();
// const routes=require('./routes/posts');
app.use(bodyParser.json());

//DB config
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

const PORT = process.env.PORT || 5000;
//connnect to mongo

let db = dbconfig.mongoUrlLocal;
mongoose
  .connect(db)
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
app.disable("x-powered-by");
app.use("/users", users);
app.use("/todo", AuthVerifyAdminUser, todo);
