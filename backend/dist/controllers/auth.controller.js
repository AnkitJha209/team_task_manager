import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../utils/prismaClient.js";
dotenv.config();
export const signUp = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;
        if (!role)
            role = "MEMBER";
        const userExist = await prisma.user.findUnique({
            where: { email },
        });
        if (userExist) {
            return res.status(409).json({
                success: false,
                message: "Email already in use.",
            });
        }
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPass,
                role,
            },
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            metadata: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while signing up",
        });
    }
};
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await prisma.user.findUnique({
            where: { email },
        });
        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }
        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password is wrong",
            });
        }
        const payload = {
            id: userExist.id,
            role: userExist.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "SecretKey", {
            expiresIn: "2d",
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: token,
            user: {
                id: userExist.id,
                name: userExist.name,
                email: userExist.email,
                role: userExist.role,
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while signing in",
        });
    }
};
//# sourceMappingURL=auth.controller.js.map