import { createProject, getProjectById, getProjectsByUserId, updateProject, deleteProject } from '../db/queries';
import { Response } from 'express';
import { AuthRequest } from '../types';
import z from 'zod';

const validateProject = z.object({
       name: z.string().max(20, "Maximum length for project name"),
       description: z.string().max(100, "Maximum description length"),
});

export const createProj = async (req: AuthRequest, res: Response) => {
    try { 
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const result = validateProject.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }

        const project = await createProject(userId, result.data.name, result.data.description);
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: "Failed to create project" });
    }
}

export const getProj = async (req: AuthRequest, res: Response) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectById(projectId);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: "Failed to get project" });
    }
}

export const getMultipleProj = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const projects = await getProjectsByUserId(userId);
        res.status(201).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Failed to get multiple projects" });
    }
}

export const updateProj = async (req: AuthRequest, res: Response) => {
    try {
        const projectId = req.params.id;
        
        const result = validateProject.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }

        const project = await updateProject(projectId, result.data);
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: "Failed to update project" });
    }
}

export const deleteProj = async (req: AuthRequest, res: Response) => {
    try {
        const projectId = req.params.id;

        const project = await deleteProject(projectId);
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete project" });
    }
}