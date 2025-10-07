import { z } from 'zod';
import { userModel } from '../models/userModel.js';
import { type User, type CreateUserInput } from '../types/User.js';

const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export const userService = {
  async getAllUsers(): Promise<User[]> {
    return await userModel.findAll();
  },

  async createUser(input: unknown): Promise<User> {
    const validatedData = CreateUserSchema.parse(input);
    return await userModel.create(validatedData);
  },

  async getUserById(id: string): Promise<User | null> {
    const user = await userModel.findById(id);
    return user || null;
  },

  async updateUser(id: string, input: unknown): Promise<User | null> {
    const validatedData = UpdateUserSchema.parse(input);
    // Filter out undefined values
    const updateData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    ) as Partial<Omit<User, 'id' | 'createdAt'>>;
    return await userModel.update(id, updateData);
  },

  async deleteUser(id: string): Promise<boolean> {
    return await userModel.delete(id);
  }
};
