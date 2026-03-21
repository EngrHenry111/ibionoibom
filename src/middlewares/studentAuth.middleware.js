export const protectStudent = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

8      req.user = await Student.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  }

  // ❌ DO NOT BLOCK HERE
  return res.status(401).json({
    message: "Not authorized, no token",
  });
};



// import jwt from "jsonwebtoken";
// import Student from "../models/student.model.js";

// export const protectStudent = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization?.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await Student.findById(decoded.id).select("-password");

//       next();
//     } catch (error) {
//       return res.status(401).json({
//         message: "Not authorized",
//       });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({
//       message: "No token",
//     });
//   }
// };