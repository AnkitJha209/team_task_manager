import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
export declare const createProject: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProjects: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProjectById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProject: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProject: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=project.controller.d.ts.map