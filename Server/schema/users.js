import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email should be unique"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    required: [true, "User role is required"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  resetToken: String,
  expireToken: Date,
});
const User = mongoose.model("users", UserSchema);
export default User;
