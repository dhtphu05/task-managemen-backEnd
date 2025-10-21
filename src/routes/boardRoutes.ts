import { Router, type IRouter } from 'express';
import { boardController } from '../controllers/boardController.js';

export const boardRoutes: IRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Board:
 *       type: object
 *       required: [id, projectId, name, position, createdAt, updatedAt]
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         projectId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "Todo"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Tasks to start soon"
 *         position:
 *           type: integer
 *           example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BoardListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Board'
 *     BoardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Board'
 *     BoardCreateRequest:
 *       type: object
 *       required: [projectId, name]
 *       properties:
 *         projectId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         position:
 *           type: integer
 *           example: 1
 *     BoardUpdateRequest:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         position:
 *           type: integer
 */

/**
 * @openapi
 * /boards:
 *   get:
 *     tags: [Boards]
 *     summary: List boards
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter boards by project id
 *     responses:
 *       200:
 *         description: List of boards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardListResponse'
 *       400:
 *         description: Invalid project id
 */
boardRoutes.get('/', boardController.list);

/**
 * @openapi
 * /boards:
 *   post:
 *     tags: [Boards]
 *     summary: Create board
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoardCreateRequest'
 *     responses:
 *       201:
 *         description: Board created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Project not found
 */
boardRoutes.post('/', boardController.create);

/**
 * @openapi
 * /boards/{id}:
 *   get:
 *     tags: [Boards]
 *     summary: Get board by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Board detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardResponse'
 *       404:
 *         description: Board not found
 */
boardRoutes.get('/:id', boardController.getById);

/**
 * @openapi
 * /boards/{id}:
 *   put:
 *     tags: [Boards]
 *     summary: Update board
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
 *             $ref: '#/components/schemas/BoardUpdateRequest'
 *     responses:
 *       200:
 *         description: Board updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardResponse'
 *       404:
 *         description: Board or project not found
 */
boardRoutes.put('/:id', boardController.update);

/**
 * @openapi
 * /boards/{id}:
 *   delete:
 *     tags: [Boards]
 *     summary: Delete board
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Board deleted
 *       404:
 *         description: Board not found
 */
boardRoutes.delete('/:id', boardController.remove);
