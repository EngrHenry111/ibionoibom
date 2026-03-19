import "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Backend is running");
});
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
