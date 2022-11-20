import express from "express";
import {
  addNewUser,
  deleteUSer,
  getAllUsers,
  loginUser,
  updatePassword,
  updateUser,
} from "../controllers/users.js";
import {
  AuthVerifyGetLoggedInUser,
  AuthVerifyAdminUser,
  isUserSame,
} from "../middleware/auth.js";
const users = express.Router();

users.get("/me", AuthVerifyGetLoggedInUser);
users.post("/", AuthVerifyAdminUser, addNewUser);
users.post("/login", loginUser);
users.get("/", AuthVerifyAdminUser, getAllUsers);
users.put("/:id", AuthVerifyAdminUser, updateUser);
users.delete("/:id", AuthVerifyAdminUser, deleteUSer);
users.put("/change-password/:id", isUserSame, updatePassword);
export default users;
