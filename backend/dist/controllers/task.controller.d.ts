import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
export declare const createTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllTasks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTaskById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTaskStatus: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=task.controller.d.ts.map