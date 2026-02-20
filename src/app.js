import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import leaderRoutes from "./routes/leader.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import newsRoutes from "./routes/news.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import tenureRoutes from "./routes/tenure.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"



const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// app.use("/uploads", express.static(path.resolve("uploads")));


app.use("/api/admin", authRoutes);
app.use("/api/leaders", leaderRoutes);
app.use("/api/tenures", tenureRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
