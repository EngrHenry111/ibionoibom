import { Router } from "express";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import leaderRoutes from "./modules/leaders/leader.routes.js";
import officeRoutes from "./modules/offices/office.routes.js";
import departmentRoutes from "./modules/departments/department.routes.js";
import newsRoutes from "./modules/news/news.routes.js";
import mediaRoutes from "./modules/media/media.routes.js";
import auditRoutes from "./modules/audit/audit.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/leaders", leaderRoutes);
router.use("/offices", officeRoutes);
router.use("/departments", departmentRoutes);
router.use("/news", newsRoutes);
router.use("/media", mediaRoutes);
router.use("/audit", auditRoutes);

export default router;
