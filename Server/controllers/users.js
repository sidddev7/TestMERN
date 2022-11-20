import Mongoose from "mongoose";
import User from "../schema/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const getLoggedInUser = async (req, res) => {
  try {
    console.log(req);
  } catch (err) {}
};

export const addNewUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User Already Exist" });
    } else {
      // try to add the user to DB
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, async (err, hash) => {
          if (err) throw err;
          else {
            const newUser = new User({
              email: req.body.email,
              password: hash,
              name: req.body.name,
              role: req.body.role,
            });
            try {
              const result = await newUser.save();
              if (result) {
                return res
                  .status(200)
                  .json({ message: "User Saved successfully" });
              }
            } catch (err) {
              return res.status(400).json({ message: "Something went wrong" });
            }
          }
        });
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    } else {
      // check password with the hash password saved in DB
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // password is correct, create a payload for creating a bearer token
        const payload = {
          email: user.email,
          name: user.name,
          id: user.id,
          role: user.role === "Admin" ? 1 : 0,
        };
        jwt.sign(payload, "TESTMERN", { expiresIn: 36000 }, (err, token) => {
          if (err) {
            return res.status(500).json({ message: "Token Generation Failed" });
          } else {
            res
              .status(200)
              .json({ message: "User Logged in successfully", token });
          }
        });
      } else {
        return res.status(401).json({ message: "Password is incorrect" });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Something Went wrong" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Not a valid Id" });
    } else {
      const updateUser = {
        name: name,
        email: email,
        role: role,
      };
      const result = await User.findByIdAndUpdate(id, updateUser, {
        new: true,
      });
      if (result) {
        res.status(200).json({ message: "User Updated Successfully" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const count = await User.countDocuments();
    const result = await User.find()
      .limit(parseInt(limit))
      .skip(parseInt(limit) * (parseInt(page) - 1))
      .limit(limit)
      .skip((page - 1) * limit)
      .select({ resetToken: 0, password: 0 })
      .exec();
    if (result) {
      res
        .status(200)
        .json({ data: result, total: count, page: parseInt(page) });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "Something went wrong for getting ALL users", err });
  }
};

export const deleteUSer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Not a valid Id" });
    } else {
      const result = await User.findByIdAndDelete(id);
      if (result) {
        res.status(200).json({ message: "User Deleted successfully" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    if (res.locals.id === id) {
      // checks that the user is trying to change his own password
      const user = await User.findById(id);
      if (user) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (isMatch) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPassword, salt, async (err, hash) => {
              if (err) throw err;
              else {
                const updateUser = {
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  password: newPassword,
                };
                const result = await User.findByIdAndUpdate(id, updateUser, {
                  new: true,
                });
                if (result) {
                  return res
                    .status(200)
                    .json({ message: "Password changed successfully" });
                } else {
                  return res
                    .status(400)
                    .json({ message: "Trouble changing your password" });
                }
              }
            });
          });
        } else {
          return res.status(401).json({ message: "Wrong current password" });
        }
      }
    } else {
      res.status(401).json({
        message: "You are not authorized to change someone else password",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
