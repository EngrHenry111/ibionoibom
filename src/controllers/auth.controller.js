import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/* ================= REGISTER ================= */
export const registerInitialAdmin = async (req, res) => {
  const adminCount = await Admin.countDocuments();

  if (adminCount > 0) {
    return res.status(403).json({
      message: "Signup disabled. Admin already exists.",
    });
  }

  const hashed = await bcrypt.hash(req.body.password, 10);

  const admin = await Admin.create({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
    role: "super_admin",
  });

  res.status(201).json({ message: "Super admin created" });
};


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
//       message: "Registration successful",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

/* ================= LOGIN ================= */
// export const loginAdmin = async (req, res) => {
//   const admin = await Admin.findOne({ email: req.body.email });
//   if (!admin) return res.status(401).json({ message: "Invalid credentials" });

//   const match = await bcrypt.compare(req.body.password, admin.password);
//   if (!match) return res.status(401).json({ message: "Invalid credentials" });

  
//   const token = jwt.sign(
//     { id: admin._id, role: admin.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   res.json({ token, admin });
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
