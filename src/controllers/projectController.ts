import { type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { projectService } from '../services/projectService.js';
import { ok, fail } from '../utils/http.js';

const toMessage = (error: unknown): string => {
  if (error instanceof ZodError) {
    return error.errors.map(issue => issue.message).join(', ');
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error';
};

const isWorkspaceNotFoundError = (error: unknown): boolean =>
  error instanceof Error && error.message === 'Workspace not found';

export const projectController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const workspaceIdParam = typeof req.query.workspaceId === 'string' ? req.query.workspaceId : undefined;
      const projects = await projectService.getProjects({ workspaceId: workspaceIdParam });
      res.json(ok(projects));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const project = await projectService.createProject(req.body);
      res.status(201).json(ok(project));
    } catch (error) {
      if (isWorkspaceNotFoundError(error)) {
        res.status(404).json(fail('Workspace not found'));
        return;
      }
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);

      if (!project) {
        res.status(404).json(fail('Project not found'));
        return;
      }

      res.json(ok(project));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await projectService.updateProject(id, req.body);

      if (!project) {
        res.status(404).json(fail('Project not found'));
        return;
      }

      res.json(ok(project));
    } catch (error) {
      if (isWorkspaceNotFoundError(error)) {
        res.status(404).json(fail('Workspace not found'));
        return;
      }
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await projectService.deleteProject(id);

      if (!deleted) {
        res.status(404).json(fail('Project not found'));
        return;
      }

      res.json(ok({ message: 'Project deleted successfully' }));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },
};
