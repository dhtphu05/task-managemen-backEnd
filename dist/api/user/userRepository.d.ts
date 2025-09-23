import { type User } from './userModel.js';
export declare const userRepository: {
    list(): User[];
    create(data: {
        name: string;
        email: string;
    }): User;
};
//# sourceMappingURL=userRepository.d.ts.map