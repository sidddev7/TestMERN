import mongoose from "mongoose";
import Schema from "mongoose";
const TodoSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User is Required"],
  },
  status: {
    type: String,
    required: [true, "Status is required"],
  },
});
const Todo = mongoose.model("todos", TodoSchema);
export default Todo;
