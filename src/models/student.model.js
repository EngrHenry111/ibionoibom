import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({

  fullName: String,

  email: {
    type: String,
    unique: true
  },

  password: String

}, { timestamps: true });

/* HASH PASSWORD */
studentSchema.pre("save", async function(next){

  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password,10);

  next();

});

/* COMPARE PASSWORD */
studentSchema.methods.matchPassword = async function(password){
  return await bcrypt.compare(password,this.password);
};

export default mongoose.model("Student", studentSchema);