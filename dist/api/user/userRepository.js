import {} from './userModel.js';
const users = new Map();
// Seed nhẹ cho tiện xem demo
(() => {
    const u1 = { id: 'u_1', name: 'Alice', email: 'alice@example.com', createdAt: new Date() };
    const u2 = { id: 'u_2', name: 'Bob', email: 'bob@example.com', createdAt: new Date() };
    users.set(u1.id, u1);
    users.set(u2.id, u2);
})();
export const userRepository = {
    list() {
        return Array.from(users.values());
    },
    create(data) {
        const id = Math.random().toString(36).slice(2);
        const user = { id, name: data.name, email: data.email, createdAt: new Date() };
        users.set(id, user);
        return user;
    },
};
//# sourceMappingURL=userRepository.js.map