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
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
