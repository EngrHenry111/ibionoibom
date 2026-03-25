import express from "express";
import cors from "cors";
// import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import leaderRoutes from "./routes/leader.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import newsRoutes from "./routes/news.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import tenureRoutes from "./routes/tenure.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"
import archiveRoutes from "./routes/archive.routes.js"
import bursaryRoutes from "./routes/bursary.routes.js";
import studentRoutes from "./routes/student.routes.js"

import schoolRoutes from "./routes/school.routes.js"

import healthRoutes from "./routes/health.routes.js"

import securityRoutes from "./routes/security.routes.js"

import agricultureRoutes from "./routes/agriculture.Routes.js"

import tourismRoutes from "./routes/tourism.routes.js"

import economicRoutes from "./routes/ecnomic.routes.js"

import cultureRoutes from "./routes/culture.routes.js"

import historyRoutes from "./routes/history.routes.js"

import diasporaRoutes from "./routes/diaspora.routes.js"

import bmtRoutes from "./routes/bmt.routes.js"

import sitemapRoutes from "./routes/sitemap.routes.js"

const app = express();
app.use(cors());
app.use(express.json());



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ibionoibomlga.com"
    ],
    credentials: true
  })
);

app.use(helmet());
// const limiter = rateLimit({
//   windowMs: 15 * 1000, // 15 mins
//   max: 100
// })
// app.use(limiter);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));



app.use("/api/admin", authRoutes);
app.use("/api/leaders", leaderRoutes);
app.use("/api/tenures", tenureRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/archive", archiveRoutes);

app.use("/api/bursary", bursaryRoutes);
app.use("/api/students", studentRoutes);

app.use("/api/schools",  schoolRoutes);

app.use("/api/health", healthRoutes);

app.use("/api/security", securityRoutes);

app.use("/api/agriculture", agricultureRoutes)

app.use("/api/tourism", tourismRoutes);

app.use("/api/economic", economicRoutes);

app.use("/api/culture", cultureRoutes);

app.use("/api/history", historyRoutes);

app.use("/api/diaspora", diasporaRoutes);

app.use("/api/bmt", bmtRoutes);

app.use("/", sitemapRoutes);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE:", err);
});

// 🔥 GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);

  // Multer errors
  if (err.message.includes("File")) {
    return res.status(400).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Server error",
  });
});

export default app;
