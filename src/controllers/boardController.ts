import { type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { boardService } from '../services/boardService.js';
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

const isProjectNotFoundError = (error: unknown): boolean =>
  error instanceof Error && error.message === 'Project not found';

export const boardController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const projectIdParam = typeof req.query.projectId === 'string' ? req.query.projectId : undefined;
      const boards = await boardService.getBoards({ projectId: projectIdParam });
      res.json(ok(boards));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const board = await boardService.createBoard(req.body);
      res.status(201).json(ok(board));
    } catch (error) {
      if (isProjectNotFoundError(error)) {
        res.status(404).json(fail('Project not found'));
        return;
      }
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const board = await boardService.getBoardById(id);

      if (!board) {
        res.status(404).json(fail('Board not found'));
        return;
      }

      res.json(ok(board));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const board = await boardService.updateBoard(id, req.body);

      if (!board) {
        res.status(404).json(fail('Board not found'));
        return;
      }

      res.json(ok(board));
    } catch (error) {
      if (isProjectNotFoundError(error)) {
        res.status(404).json(fail('Project not found'));
        return;
      }
      res.status(400).json(fail(toMessage(error)));
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await boardService.deleteBoard(id);

      if (!deleted) {
        res.status(404).json(fail('Board not found'));
        return;
      }

      res.json(ok({ message: 'Board deleted successfully' }));
    } catch (error) {
      res.status(400).json(fail(toMessage(error)));
    }
  },
};
