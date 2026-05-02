import { Router } from "express";
import { listUsers } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/", verifyToken, isAdmin, listUsers);
export default router;
//# sourceMappingURL=user.routes.js.map