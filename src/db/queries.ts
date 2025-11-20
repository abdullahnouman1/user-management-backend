import prisma from "./client";

export async function createUser(email: string, passwordHash: string, role: string = 'user') {
    try {
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role
            }
        });
        return user;
    } catch (err: any) {
        if (err.code === "P2002") {
            throw new Error("User with this email already exists");
        }
        throw err;
    }
}

export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return user;
    } catch (err: any) {
        throw err;
    }
}

export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        return user;
    } catch (err: any) {
        throw err;
    }
}

export async function updateUser(id: string, data: { email?: string; passwordHash?: string; role?: string }) {
    try {
        const user = await prisma.user.update({
            where: { id },
            data
        });
        return user;
    } catch (err: any) {
        if (err.code === "P2002") {
            throw new Error("User with this email already exists");
        }
        throw err;
    }
}

export async function deleteUser(id: string) {
    try {
        const user = await prisma.user.delete({
            where: { id }
        });
        return user;
    } catch (err: any) {
        throw err;
    }
}

export async function createProject(userId: string, name: string, description: string) {
    try {
        const project = await prisma.project.create({
            data: {
                userId,
                name,
                description,
            }
        });
        return project;
    } catch (err: any) {
        throw err;
    }
}

export async function getProjectById(id:string) {
    try {
        const project = await prisma.project.findUnique({
            where: { id }
        });
        return project;
    } catch (err:any) {
        throw err;
    }
}

export async function getProjectsByUserId(userId: string) {
    try {
        const projects = await prisma.project.findMany({
            where: { userId }
        });
        return projects;
    } catch (err: any) {
        throw err;
    }
}

export async function updateProject(id: string, data: { name?: string; description?: string }) {
    try {
        const project = await prisma.project.update({
            where: { id },
            data
        });
        return project;
    } catch (err: any) {
        throw err;
    }
}

export async function deleteProject(id: string) {
    try {
        const project = await prisma.project.delete({
            where: { id }
        });
        return project;
    } catch (err: any) {
        throw err;
    }
}