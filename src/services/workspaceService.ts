import { z } from 'zod';
import { AppDataSource } from '../db/dataSource.js';
import { Workspace } from '../entities/Workspace.js';

const workspaceRepository = () => AppDataSource.getRepository(Workspace);

const CreateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, 'Workspace name is required'),
  description: z.string().trim().max(1000).nullish(),
});

const UpdateWorkspaceSchema = CreateWorkspaceSchema.partial();

export const workspaceService = {
  async createWorkspace(input: unknown): Promise<Workspace> {
    const data = CreateWorkspaceSchema.parse(input);
    const workspace = workspaceRepository().create({
      name: data.name,
      description: data.description ?? null,
    });
    return await workspaceRepository().save(workspace);
  },

  async getAllWorkspaces(): Promise<Workspace[]> {
    return await workspaceRepository().find({
      order: { createdAt: 'DESC' },
    });
  },

  async getWorkspaceById(id: string): Promise<Workspace | null> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid workspace id');
    }

    const workspace = await workspaceRepository().findOne({
      where: { id },
      relations: {
        projects: {
          boards: true,
        },
      },
    });

    return workspace ?? null;
  },

  async updateWorkspace(id: string, input: unknown): Promise<Workspace | null> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid workspace id');
    }

    const data = UpdateWorkspaceSchema.parse(input);
    const repo = workspaceRepository();
    const workspace = await repo.findOneBy({ id });
    if (!workspace) {
      return null;
    }

    if (data.name !== undefined) {
      workspace.name = data.name;
    }

    if (data.description !== undefined) {
      workspace.description = data.description ?? null;
    }

    return await repo.save(workspace);
  },

  async deleteWorkspace(id: string): Promise<boolean> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid workspace id');
    }

    const result = await workspaceRepository().delete(id);
    return (result.affected ?? 0) > 0;
  },
};
