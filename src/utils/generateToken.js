import jwt from "jsonwebtoken";

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export default generateToken;




// import jwt from "jsonwebtoken";

// const generateToken = (adminId) => {
//   return jwt.sign(
//     { id: adminId },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );
// };

// export default generateToken;
