import "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";

connectDB();
// in src/server.js
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Ibiono Ibom LGA API",
    uptime: process.uptime()
  });
});

// app.get("/test-db", async (req, res) => {
//   try {
//     const collections = await mongoose.connection.db.listCollections().toArray();
//     res.json({ connected: true, collections });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
