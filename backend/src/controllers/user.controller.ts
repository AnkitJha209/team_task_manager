import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prismaClient.js";

export const listUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true },
        });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
        });
    }
};
