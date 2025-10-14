import { Router, type IRouter } from 'express';
import { projectController } from '../controllers/projectController.js';

export const projectRoutes: IRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required: [id, workspaceId, name, createdAt, updatedAt]
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         workspaceId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "Website Redesign"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Project focused on redesigning the landing page"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProjectListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *     ProjectResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Project'
 *     ProjectCreateRequest:
 *       type: object
 *       required: [workspaceId, name]
 *       properties:
 *         workspaceId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *     ProjectUpdateRequest:
 *       type: object
 *       properties:
 *         workspaceId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 */

/**
 * @openapi
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: List all projects
 *     parameters:
 *       - in: query
 *         name: workspaceId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter projects by workspace id
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectListResponse'
 *       400:
 *         description: Invalid workspace id
 */
projectRoutes.get('/', projectController.list);

/**
 * @openapi
 * /projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreateRequest'
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Workspace not found
 */
projectRoutes.post('/', projectController.create);

/**
 * @openapi
 * /projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       404:
 *         description: Project not found
 */
projectRoutes.get('/:id', projectController.getById);

/**
 * @openapi
 * /projects/{id}:
 *   put:
 *     tags: [Projects]
 *     summary: Update project
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
 *             $ref: '#/components/schemas/ProjectUpdateRequest'
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       404:
 *         description: Project or workspace not found
 */
projectRoutes.put('/:id', projectController.update);

/**
 * @openapi
 * /projects/{id}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 */
projectRoutes.delete('/:id', projectController.remove);
