import { Router } from "express";
import { createTask, getAllTasks, getTaskById, updateTaskStatus, } from "../controllers/task.controller.js";
import { isAdmin, isMember, verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyToken);
router.post("/projects/:projectId/tasks", isAdmin, createTask);
router.get("/projects/:projectId/tasks", getAllTasks);
router.get("/projects/:projectId/tasks/:taskId", getTaskById);
router.patch("/projects/:projectId/tasks/:taskId/status", isMember, updateTaskStatus);
export default router;
//# sourceMappingURL=task.routes.js.map