import jwt from "jsonwebtoken";
import User from "../schema/users.js";
export const AuthVerifyGetLoggedInUser = (req, res) => {
  try {
    if (req?.headers?.authorization) {
      const id = req.headers.authorization.slice(7);
      jwt.verify(id, "TESTMERN", (err, decode) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Token is Expired, Login again" });
        } else {
          res.status(200).json(decode);
        }
      });
    } else {
      return res
        .status(401)
        .json({ message: "Authentication Token is Invalid" });
    }
  } catch (err) {}
};

export const AuthVerifyAdminUser = (req, res, next, adminCheck = false) => {
  try {
    if (req?.headers?.authorization) {
      const id = req.headers.authorization.slice(7);
      jwt.verify(id, "TESTMERN", async (err, decode) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Token is Expired, Login again" });
        } else {
          if (adminCheck) {
            const user = await User.findById(decode.id);
            if (user.role === "Admin") {
              next();
            } else {
              return res
                .status(401)
                .json({ message: "You are not authorized for this operation" });
            }
          } else {
            res.locals = decode;
            next();
          }
        }
      });
    } else {
      return res
        .status(401)
        .json({ message: "Authentication Token is Invalid" });
    }
  } catch (err) {}
};
export const isUserSame = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req?.headers?.authorization) {
      const token = req.headers.authorization.slice(7);
      jwt.verify(token, "TESTMERN", async (err, decode) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Token is Expired, Login again" });
        } else {
          if (id === decode.id) {
            res.locals = decode;
            next();
          } else {
            return res
              .status(401)
              .json({ message: "You cannot access other users data" });
          }
        }
      });
    }
  } catch (err) {}
};
