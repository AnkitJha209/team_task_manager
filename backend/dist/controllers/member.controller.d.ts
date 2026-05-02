import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
export declare const addMember: (req: AuthRequest, res: Response) => Promise<void>;
export declare const removeMember: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listMembers: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=member.controller.d.ts.map