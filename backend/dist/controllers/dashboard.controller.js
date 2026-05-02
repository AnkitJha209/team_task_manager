import { prisma } from "../utils/prismaClient.js";
export const getMyTasks = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const tasks = await prisma.task.findMany({
            where: {
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
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            tasks,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve tasks",
        });
    }
};
export const stats = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const totalTasks = await prisma.task.count({
            where: {
                OR: [
                    { assignedToId: userId },
                    { createdById: userId },
                ],
            },
        });
        const totalProjects = await prisma.projectMember.count({
            where: {
                userId,
            },
        });
        const byStatus = await prisma.task.groupBy({
            by: ['status'],
            where: {
                OR: [
                    { assignedToId: userId },
                    { createdById: userId },
                ],
            },
        });
        const overDueTasks = await prisma.task.count({
            where: {
                dueDate: {
                    lt: new Date(),
                },
                OR: [
                    { assignedToId: userId },
                    { createdById: userId },
                ],
            },
        });
        const assignedTasks = await prisma.task.count({
            where: {
                assignedToId: userId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Stats retrieved successfully",
            totalTasks,
            totalProjects,
            byStatus,
            overDueTasks,
            assignedTasks,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve stats",
        });
    }
};
export const overDueTasks = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const tasks = await prisma.task.findMany({
            where: {
                dueDate: {
                    lt: new Date(),
                },
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
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Overdue tasks retrieved successfully",
            tasks,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve overdue tasks",
        });
    }
};
//# sourceMappingURL=dashboard.controller.js.map