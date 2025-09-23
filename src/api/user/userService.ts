import { z } from 'zod';
import { userRepository } from './userRepository.js';
import { type User } from './userModel.js';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const userService = {
  list(): User[] {
    return userRepository.list();
  },
  create(input: unknown): User {
    const data = CreateUserSchema.parse(input);
    return userRepository.create(data);
  },
};
