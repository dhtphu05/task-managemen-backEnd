import { z } from 'zod';
import { AppDataSource } from '../db/dataSource.js';
import { Project } from '../entities/Project.js';
import { Workspace } from '../entities/Workspace.js';

const projectRepository = () => AppDataSource.getRepository(Project);
const workspaceRepository = () => AppDataSource.getRepository(Workspace);

const CreateProjectSchema = z.object({
  workspaceId: z.string().uuid('Workspace id must be a valid UUID'),
  name: z.string().trim().min(1, 'Project name is required'),
  description: z.string().trim().max(1000).nullish(),
});

const UpdateProjectSchema = z.object({
  workspaceId: z.string().uuid('Workspace id must be a valid UUID').optional(),
  name: z.string().trim().min(1, 'Project name is required').optional(),
  description: z.string().trim().max(1000).nullish(),
});

export const projectService = {
  async createProject(input: unknown): Promise<Project> {
    const data = CreateProjectSchema.parse(input);

    const workspaceExists = await workspaceRepository().exist({ where: { id: data.workspaceId } });
    if (!workspaceExists) {
      throw new Error('Workspace not found');
    }

    const project = projectRepository().create({
      workspaceId: data.workspaceId,
      name: data.name,
      description: data.description ?? null,
    });

    return await projectRepository().save(project);
  },

  async getProjects(filter: { workspaceId?: string } = {}): Promise<Project[]> {
    const { workspaceId } = filter;

    if (workspaceId !== undefined && !z.string().uuid().safeParse(workspaceId).success) {
      throw new Error('Invalid workspace id');
    }

    return await projectRepository().find({
      where: workspaceId ? { workspaceId } : undefined,
      order: { createdAt: 'DESC' },
    });
  },

  async getProjectById(id: string): Promise<Project | null> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid project id');
    }

    const project = await projectRepository().findOne({
      where: { id },
      relations: {
        boards: true,
        workspace: true,
      },
    });

    return project ?? null;
  },

  async updateProject(id: string, input: unknown): Promise<Project | null> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid project id');
    }

    const data = UpdateProjectSchema.parse(input);
    const repo = projectRepository();
    const project = await repo.findOneBy({ id });

    if (!project) {
      return null;
    }

    if (data.workspaceId !== undefined && data.workspaceId !== project.workspaceId) {
      const workspaceExists = await workspaceRepository().exist({ where: { id: data.workspaceId } });
      if (!workspaceExists) {
        throw new Error('Workspace not found');
      }
      project.workspaceId = data.workspaceId;
    }

    if (data.name !== undefined) {
      project.name = data.name;
    }
    if (data.description !== undefined) {
      project.description = data.description ?? null;
    }

    return await repo.save(project);
  },

  async deleteProject(id: string): Promise<boolean> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid project id');
    }

    const result = await projectRepository().delete(id);
    return (result.affected ?? 0) > 0;
  },
};
