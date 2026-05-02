import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
export declare const getMyTasks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const stats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const overDueTasks: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=dashboard.controller.d.ts.map