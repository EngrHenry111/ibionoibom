import express from "express";
import cors from "cors";
// import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean"
import authRoutes from "./routes/auth.routes.js";
import leaderRoutes from "./routes/leader.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import newsRoutes from "./routes/news.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import tenureRoutes from "./routes/tenure.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"
import archiveRoutes from "./routes/archive.routes.js"
// import bursaryRoutes from 
// import studentRoutes

const app = express();
app.use(cors());
app.use(express.json());



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ibionoibomlga.vercel.app"
    ],
    credentials: true
  })
);

app.use(helmet());
app.use(xss());
// const limiter = rateLimit({
//   windowMs: 15 * 1000, // 15 mins
//   max: 100
// })
// app.use(limiter);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));


// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/admin", authRoutes);
app.use("/api/leaders", leaderRoutes);
app.use("/api/tenures", tenureRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/archive", archiveRoutes);

// app.use("/api/bursary", bursaryRoutes);
// app.use("/api/students", studentRoutes);

export default app;
