import { type Request, type Response } from 'express';
import { userService } from '../services/userService.js';
import { ok, fail } from '../utils/http.js';

export const userController = {
  async getUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json(ok(users));
    } catch (error) {
      res.status(500).json(fail('Internal server error'));
    }
  },

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(ok(user));
    } catch (error: any) {
      res.status(400).json(fail(error.message || 'Validation error'));
    }
  },

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(fail('User ID is required'));
        return;
      }
      
      const user = await userService.getUserById(id);
      
      if (!user) {
        res.status(404).json(fail('User not found'));
        return;
      }
      
      res.json(ok(user));
    } catch (error) {
      res.status(500).json(fail('Internal server error'));
    }
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(fail('User ID is required'));
        return;
      }
      
      const user = await userService.updateUser(id, req.body);
      
      if (!user) {
        res.status(404).json(fail('User not found'));
        return;
      }
      
      res.json(ok(user));
    } catch (error: any) {
      res.status(400).json(fail(error.message || 'Validation error'));
    }
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(fail('User ID is required'));
        return;
      }
      
      const deleted = await userService.deleteUser(id);
      
      if (!deleted) {
        res.status(404).json(fail('User not found'));
        return;
      }
      
      res.json(ok({ message: 'User deleted successfully' }));
    } catch (error) {
      res.status(500).json(fail('Internal server error'));
    }
  }
};
