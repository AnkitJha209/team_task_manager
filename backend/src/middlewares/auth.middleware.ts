import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'


export interface AuthRequest extends Request{
    user ?: jwt.JwtPayload
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if(!token){
            res.status(401).json({
                success: false,
                message: "Token missing"
            })
            return
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET as string || "SecretKey") as jwt.JwtPayload

        if(!decode){
            res.status(401).json({
                success: false,
                message: "Invalid Token"
            })
            return
        }

        req.user = {
            id: decode.id,
            role: decode.role
        }

        next();
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const role = req.user?.role

        if(role !== "ADMIN"){
            res.status(403).json({
                success: false,
                message: "Not authorized to access admin content"
            })
            return
        }
        next();
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const isMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const role = req.user?.role
        if(role !== "MEMBER"){
            res.status(403).json({
                success: false,
                message: "Not authorized to access member content"
            })
            return
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}