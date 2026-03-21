import jwt from "jsonwebtoken";
import Student from "../models/student.model.js";

export const protectStudent = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Student.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next(); // ✅ SAFE HERE

  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Not authorized",
    });
  }
};