import { Router } from "express";
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} from "../controllers/project.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/projects", isAdmin, createProject);
router.get("/projects", getProjects);
router.get("/projects/:projectId", getProjectById);
router.put("/projects/:projectId", isAdmin, updateProject);
router.delete("/projects/:projectId", isAdmin, deleteProject);

export default router;
