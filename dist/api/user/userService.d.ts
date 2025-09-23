import { z } from 'zod';
import { type User } from './userModel.js';
declare const CreateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
}, z.core.$strip>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export declare const userService: {
    list(): User[];
    create(input: unknown): User;
};
export {};
//# sourceMappingURL=userService.d.ts.map