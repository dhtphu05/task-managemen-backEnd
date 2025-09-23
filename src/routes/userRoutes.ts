import { Router, type IRouter } from 'express';
import { userController } from '../controllers/userController.js';

export const userRoutes: IRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: [id, name, email, createdAt]
 *       properties:
 *         id:
 *           type: string
 *           example: "u_3k4j2l"
 *         name:
 *           type: string
 *           example: "Alice"
 *         email:
 *           type: string
 *           format: email
 *           example: "alice@example.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-21T12:34:56.000Z"
 *     ApiSuccessUsers:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *     ApiSuccessUser:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/User'
 *     CreateUserRequest:
 *       type: object
 *       required: [name, email]
 *       properties:
 *         name:
 *           type: string
 *           example: "Alice"
 *         email:
 *           type: string
 *           format: email
 *           example: "alice@example.com"
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Alice Updated"
 *         email:
 *           type: string
 *           format: email
 *           example: "alice.updated@example.com"
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Returns the list of all users.
 *     responses:
 *       200:
 *         description: List of users wrapped in ApiSuccess
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessUsers'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "u_1"
 *                       name: "Alice"
 *                       email: "alice@example.com"
 *                       createdAt: "2025-09-21T12:00:00.000Z"
 *                     - id: "u_2"
 *                       name: "Bob"
 *                       email: "bob@example.com"
 *                       createdAt: "2025-09-21T13:00:00.000Z"
 */
userRoutes.get('/', userController.getUsers);

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Create a new user with name and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessUser'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 */
userRoutes.post('/', userController.createUser);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Returns a specific user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "u_1"
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessUser'
 *       404:
 *         description: User not found
 */
userRoutes.get('/:id', userController.getUserById);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user by ID
 *     description: Update a user's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "u_1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessUser'
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error
 */
userRoutes.put('/:id', userController.updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user by ID
 *     description: Delete a user from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "u_1"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "User deleted successfully"
 *       404:
 *         description: User not found
 */
userRoutes.delete('/:id', userController.deleteUser);
