import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/* ================= REGISTER ================= */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */


// export const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = generateToken(admin);

//     res.status(200).json({
//       token,
//       admin: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         role: admin.role,
//       },
//     });
//   } catch (error) {
//     console.error("LOGIN ERROR:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("PASSWORD MATCH:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin);

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const loginAdmin = async (req, res) => {
//   console.log("LOGIN BODY:", req.body); // 👈 ADD THIS

//   try {
//     const { email, password } = req.body;

//     const admin = await Admin.findOne({ email });
//     console.log("ADMIN FOUND:", admin); // 👈 ADD THIS

//     if (!admin) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     console.log("PASSWORD MATCH:", isMatch); // 👈 ADD THIS

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     res.json({
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       token: generateToken(admin._id),
//     });
//   } catch (error) {
//     console.error("LOGIN CRASHED:", error); // 👈 THIS IS THE KEY
//     res.status(500).json({ message: error.message });
//   }
// };





// import bcrypt from "bcryptjs";
// import Admin from "../models/Admin.js";
// import generateToken from "../utils/generateToken.js";


// // src/controllers/auth.controller.js
// export const registerAdmin = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const exists = await Admin.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = await Admin.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       token: generateToken(admin._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// export const loginAdmin = async (req, res) => {
//   const { email, password } = req.body;
//   const admin = await Admin.findOne({ email });
//   if (!admin) return res.status(401).json({ message: "Invalid credentials" });

//   const match = await bcrypt.compare(password, admin.passwordHash);
//   if (!match) return res.status(401).json({ message: "Invalid credentials" });

//   res.json({ token: generateToken(admin._id), role: admin.role });
// };
