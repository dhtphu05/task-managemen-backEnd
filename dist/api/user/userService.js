import { z } from 'zod';
import { userRepository } from './userRepository.js';
import {} from './userModel.js';
const CreateUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
});
export const userService = {
    list() {
        return userRepository.list();
    },
    create(input) {
        const data = CreateUserSchema.parse(input);
        return userRepository.create(data);
    },
};
//# sourceMappingURL=userService.js.map