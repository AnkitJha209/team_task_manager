import { prisma } from "../utils/prismaClient.js";
export const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req?.user?.id;
        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                ownerId: userId,
            },
        });
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: newProject,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while creating project",
        });
    }
};
export const getProjects = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const projects = await prisma.project.findMany({
            where: {
                OR: [{ ownerId: userId }, { members: { some: { userId } } }],
            },
        });
        if (projects.length === 0) {
            res.status(404).json({
                success: false,
                message: "No projects found for the user",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Projects retrieved successfully",
            data: projects,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while retrieving projects",
        });
    }
};
export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req?.user?.id;
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                OR: [{ ownerId: userId }, { members: { some: { userId } } }],
            },
        });
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found or access denied",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Project retrieved successfully",
            data: project,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while retrieving project",
        });
    }
};
export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description } = req.body;
        const userId = req?.user?.id;
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                ownerId: userId,
            },
        });
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found or access denied",
            });
            return;
        }
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { name, description },
        });
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while updating project",
        });
    }
};
export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req?.user?.id;
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                ownerId: userId,
            },
        });
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found or access denied",
            });
            return;
        }
        await prisma.project.delete({
            where: { id: projectId }
        });
        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while deleting project",
        });
    }
};
//# sourceMappingURL=project.controller.js.map