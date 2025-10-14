import { Router, type IRouter } from 'express';
import { workspaceController } from '../controllers/workspaceController.js';

export const workspaceRoutes: IRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Workspace:
 *       type: object
 *       required: [id, name, createdAt, updatedAt]
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "e7d4c3fa-0dc6-4d7a-a003-0e22b6f06e4d"
 *         name:
 *           type: string
 *           example: "Marketing Workspace"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "All marketing projects live here"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     WorkspaceListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Workspace'
 *     WorkspaceResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Workspace'
 *     WorkspaceCreateRequest:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           example: "Design Team"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Workspace description"
 *     WorkspaceUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Design Team - Updated"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Updated description"
 */

/**
 * @openapi
 * /workspaces:
 *   get:
 *     tags: [Workspaces]
 *     summary: List all workspaces
 *     responses:
 *       200:
 *         description: List of workspaces
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceListResponse'
 */
workspaceRoutes.get('/', workspaceController.list);

/**
 * @openapi
 * /workspaces:
 *   post:
 *     tags: [Workspaces]
 *     summary: Create workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkspaceCreateRequest'
 *     responses:
 *       201:
 *         description: Workspace created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceResponse'
 *       400:
 *         description: Validation error
 */
workspaceRoutes.post('/', workspaceController.create);

/**
 * @openapi
 * /workspaces/{id}:
 *   get:
 *     tags: [Workspaces]
 *     summary: Get workspace by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Workspace detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceResponse'
 *       404:
 *         description: Workspace not found
 */
workspaceRoutes.get('/:id', workspaceController.getById);

/**
 * @openapi
 * /workspaces/{id}:
 *   put:
 *     tags: [Workspaces]
 *     summary: Update workspace
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkspaceUpdateRequest'
 *     responses:
 *       200:
 *         description: Workspace updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceResponse'
 *       404:
 *         description: Workspace not found
 */
workspaceRoutes.put('/:id', workspaceController.update);

/**
 * @openapi
 * /workspaces/{id}:
 *   delete:
 *     tags: [Workspaces]
 *     summary: Delete workspace
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Workspace deleted
 *       404:
 *         description: Workspace not found
 */
workspaceRoutes.delete('/:id', workspaceController.remove);
