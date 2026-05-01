import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prismaClient.js";

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        let { title, description, status, assignedTo, priority, dueDate } = req.body;
        const { projectId } = req.params;
        const userId = req?.user?.id;

        if(!status) status = "TODO"
        if(!priority) priority = "MEDIUM"
        const project = await prisma.project.findFirst({
            where: {
                id: projectId as string,
                ownerId: userId,
            },
        });
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found or you are not the owner",
            });
            return;
        }
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                status,
                projectId: projectId as string,
                assignedToId: assignedTo as string,
                priority,
                dueDate,
                createdById: userId as string,
            },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            task: newTask,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while creating task",
        });
    }
};

export const getAllTasks = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const userId = req?.user?.id
        const project = await prisma.project.findFirst({
            where: {
                id: projectId as string,
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } },
                ],
            },
        });
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found or access denied",
            });
            return;
        }
        const tasks = await prisma.task.findMany({
            where: { projectId: projectId as string },
            include: {  
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                }
            }
        });
        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while retrieving tasks",
        });
    }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
    try {
        const { taskId, projectId } = req.params;
        const userId = req?.user?.id
        const project = await prisma.project.findFirst({
            where: {
                id: projectId as string,
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } },
                ],
            },
        });
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found or access denied",
            });
            return;
        }
        const task = await prisma.task.findFirst({
            where: { 
                id: taskId as string,
                projectId: projectId as string,
                OR: [
                    { assignedToId: userId },
                    { createdById: userId },
                ],
             },
             include: { 
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                }
             }
        });
        res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while retrieving task",
        });
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { taskId, projectId } = req.params;
        const { status } = req.body;
        const userId = req?.user?.id
        const project = await prisma.project.findFirst({
            where: {
                id: projectId as string,
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } },
                ],
            },
        });
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found or access denied",
            });
            return;
        }
        const task = await prisma.task.findFirst({
            where: { 
                id: taskId as string,
                projectId: projectId as string,
                OR: [
                    { assignedToId: userId },
                    { createdById: userId },
                ],
             },
        });
        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found or access denied",
            });
            return;
        }
        await prisma.task.update({
            where: { id: taskId as string },
            data: { status },
        });
        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while updating task status",
        });
    }
}