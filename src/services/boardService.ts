import { z } from 'zod';
import { AppDataSource } from '../db/dataSource.js';
import { Board } from '../entities/Board.js';
import { Project } from '../entities/Project.js';

const boardRepository = () => AppDataSource.getRepository(Board);
const projectRepository = () => AppDataSource.getRepository(Project);

const positionSchema = z.number().int().min(0, 'Position must be zero or positive');

const CreateBoardSchema = z.object({
  projectId: z.string().uuid('Project id must be a valid UUID'),
  name: z.string().trim().min(1, 'Board name is required'),
  description: z.string().trim().max(1000).nullish(),
  position: positionSchema.optional(),
});

const UpdateBoardSchema = z.object({
  projectId: z.string().uuid('Project id must be a valid UUID').optional(),
  name: z.string().trim().min(1, 'Board name is required').optional(),
  description: z.string().trim().max(1000).nullish(),
  position: positionSchema.optional(),
});

export const boardService = {
  async createBoard(input: unknown): Promise<Board> {
    const data = CreateBoardSchema.parse(input);

    const projectExists = await projectRepository().exist({ where: { id: data.projectId } });
    if (!projectExists) {
      throw new Error('Project not found');
    }

    const board = boardRepository().create({
      projectId: data.projectId,
      name: data.name,
      description: data.description ?? null,
      position: data.position ?? 0,
    });

    return await boardRepository().save(board);
  },

  async getBoards(filter: { projectId?: string } = {}): Promise<Board[]> {
    const { projectId } = filter;

    if (projectId !== undefined && !z.string().uuid().safeParse(projectId).success) {
      throw new Error('Invalid project id');
    }

    return await boardRepository().find({
      where: projectId ? { projectId } : undefined,
      order: { position: 'ASC', createdAt: 'DESC' },
    });
  },

  async getBoardById(id: string): Promise<Board | null> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid board id');
    }

    const board = await boardRepository().findOne({
      where: { id },
      relations: {
        project: true,
      },
    });

    return board ?? null;
  },

  async updateBoard(id: string, input: unknown): Promise<Board | null> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid board id');
    }

    const data = UpdateBoardSchema.parse(input);
    const repo = boardRepository();
    const board = await repo.findOneBy({ id });

    if (!board) {
      return null;
    }

    if (data.projectId !== undefined && data.projectId !== board.projectId) {
      const projectExists = await projectRepository().exist({ where: { id: data.projectId } });
      if (!projectExists) {
        throw new Error('Project not found');
      }
      board.projectId = data.projectId;
    }

    if (data.name !== undefined) {
      board.name = data.name;
    }
    if (data.description !== undefined) {
      board.description = data.description ?? null;
    }
    if (data.position !== undefined) {
      board.position = data.position;
    }

    return await repo.save(board);
  },

  async deleteBoard(id: string): Promise<boolean> {
    if (!z.string().uuid().safeParse(id).success) {
      throw new Error('Invalid board id');
    }

    const result = await boardRepository().delete(id);
    return (result.affected ?? 0) > 0;
  },
};
