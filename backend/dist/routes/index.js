import { Router } from "express";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import memberRoutes from "./member.routes.js";
import taskRoutes from "./task.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import userRoutes from "./user.routes.js";
const router = Router();
router.use("/auth", authRoutes);
router.use("/", projectRoutes);
router.use("/", memberRoutes);
router.use("/", taskRoutes);
router.use("/", dashboardRoutes);
router.use("/users", userRoutes);
export default router;
//# sourceMappingURL=index.js.map