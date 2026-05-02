import { Router } from "express";
import { addMember, removeMember, listMembers, } from "../controllers/member.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyToken);
router.post("/projects/:projectId/members", isAdmin, addMember);
router.delete("/projects/:projectId/members/:memberId", isAdmin, removeMember);
router.get("/projects/:projectId/members", listMembers);
export default router;
//# sourceMappingURL=member.routes.js.map