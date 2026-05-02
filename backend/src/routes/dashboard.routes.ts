import { Router } from "express";
import {
    getMyTasks,
    stats,
    overDueTasks,
} from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/dashboard/tasks", getMyTasks);
router.get("/dashboard/stats", stats);
router.get("/dashboard/overdue", overDueTasks);

export default router;
