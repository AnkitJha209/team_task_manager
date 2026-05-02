import { prisma } from "../utils/prismaClient.js";
export const addMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body;
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
                message: "Project not found or you are not the owner",
            });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const existingMember = await prisma.projectMember.findFirst({
            where: {
                userId: user.id,
                projectId: projectId,
            },
        });
        if (existingMember) {
            res.status(409).json({
                success: false,
                message: "User is already a member of the project",
            });
            return;
        }
        await prisma.projectMember.create({
            data: {
                userId: user.id,
                projectId: projectId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Member added to the project successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while adding member to the project",
        });
    }
};
export const removeMember = async (req, res) => {
    try {
        const { projectId, memberId } = req.params;
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
                message: "Project not found or you are not the owner",
            });
            return;
        }
        const member = await prisma.projectMember.findFirst({
            where: {
                userId: memberId,
                projectId: projectId,
            },
        });
        if (!member) {
            res.status(404).json({
                success: false,
                message: "Member not found in the project",
            });
            return;
        }
        await prisma.projectMember.delete({
            where: { id: member.id },
        });
        res.status(200).json({
            success: true,
            message: "Member removed from the project successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while removing member from the project",
        });
    }
};
export const listMembers = async (req, res) => {
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
        const members = await prisma.projectMember.findMany({
            where: { projectId: projectId },
            include: { user: true },
        });
        const memberList = members.map((member) => ({
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
        }));
        res.status(200).json({
            success: true,
            members: memberList,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while fetching project members",
        });
    }
};
//# sourceMappingURL=member.controller.js.map