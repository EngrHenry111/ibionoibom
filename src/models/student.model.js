import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^\S+@\S+\.\S+$/,
      "Please use a valid email"
    ]
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  resetToken: String,
  resetTokenExpire: Date

}, { timestamps: true });

/* HASH PASSWORD */

studentSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next(); // ✅ must be called properly
  } catch (error) {
    next(error); // ✅ VERY IMPORTANT FIX
  }
});

// studentSchema.pre("save", async function(next){

//   if(!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password,10);

//   next();

// });

/* MATCH PASSWORD */
studentSchema.methods.matchPassword = async function(password){
  return await bcrypt.compare(password,this.password);
};

export default mongoose.model("Student", studentSchema);