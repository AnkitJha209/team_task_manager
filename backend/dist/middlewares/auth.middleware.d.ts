import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
export interface AuthRequest extends Request {
    user?: jwt.JwtPayload;
}
export declare const verifyToken: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const isAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const isMember: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map