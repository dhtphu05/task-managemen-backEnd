import { type User } from '../types/User.js';

const users = new Map<string, User>();

// Seed nhẹ cho tiện xem demo
(() => {
  const u1: User = { id: 'u_1', name: 'Alice', email: 'alice@example.com', createdAt: new Date() };
  const u2: User = { id: 'u_2', name: 'Bob',   email: 'bob@example.com',   createdAt: new Date() };
  users.set(u1.id, u1);
  users.set(u2.id, u2);
})();

export const userModel = {
  findAll(): User[] {
    return Array.from(users.values());
  },
  
  create(data: { name: string; email: string }): User {
    const id = Math.random().toString(36).slice(2);
    const user: User = { id, name: data.name, email: data.email, createdAt: new Date() };
    users.set(id, user);
    return user;
  },
  
  findById(id: string): User | undefined {
    return users.get(id);
  },
  
  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
    const user = users.get(id);
    if (!user) return null;
    
    const updatedUser = { ...user, ...data };
    users.set(id, updatedUser);
    return updatedUser;
  },
  
  delete(id: string): boolean {
    return users.delete(id);
  }
};
