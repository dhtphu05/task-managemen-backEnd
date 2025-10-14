import { type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { workspaceService } from '../services/workspaceService.js';
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

export const workspaceController = {
  async list(_req: Request, res: Response): Promise<void> {
    try {
      const workspaces = await workspaceService.getAllWorkspaces();
      res.json(ok(workspaces));
    } catch (error) {
      res.status(500).json(fail('Failed to fetch workspaces'));
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const workspace = await workspaceService.createWorkspace(req.body);
      res.status(201).json(ok(workspace));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const workspace = await workspaceService.getWorkspaceById(id);

      if (!workspace) {
        res.status(404).json(fail('Workspace not found'));
        return;
      }

      res.json(ok(workspace));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const workspace = await workspaceService.updateWorkspace(id, req.body);

      if (!workspace) {
        res.status(404).json(fail('Workspace not found'));
        return;
      }

      res.json(ok(workspace));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await workspaceService.deleteWorkspace(id);

      if (!deleted) {
        res.status(404).json(fail('Workspace not found'));
        return;
      }

      res.json(ok({ message: 'Workspace deleted successfully' }));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },
};
