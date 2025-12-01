/**
 * @openapi
 *
 * /v1/users:
 *   get:
 *     summary: List users
 *     description: Returns users in JSON:API format.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page[number]
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: page[size]
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A list of JSON:API User resources
 *         content:
 *           application/vnd.api+json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *
 * components:
 *   schemas:
 *
 *     # =============== BASIC JSON:API SCHEMAS ===============
 *
 *     ResourceIdentifier:
 *       type: object
 *       required:
 *         - type
 *         - id
 *       properties:
 *         type:
 *           type: string
 *         id:
 *           type: string
 *
 *     Relationship:
 *       type: object
 *       properties:
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/ResourceIdentifier'
 *             - type: array
 *               items:
 *                 $ref: '#/components/schemas/ResourceIdentifier'
 *
 *
 *     # =============== DOMAIN SCHEMAS ===============
 *
 *     Attributes:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     Resource:
 *       type: object
 *       required:
 *         - type
 *         - id
 *         - attributes
 *       properties:
 *         type:
 *           type: string
 *           example: users
 *         id:
 *           type: string
 *         attributes:
 *           $ref: '#/components/schemas/Attributes'
 *         relationships:
 *           type: object
 *           properties:
 *             accounts:
 *               $ref: '#/components/schemas/Relationship'
 *             transactions:
 *               $ref: '#/components/schemas/Relationship'
 *
 *
 *     # =============== LIST RESPONSE ===============
 *
 *     Response:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Resource'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             size:
 *               type: integer
 *         links:
 *           type: object
 *           properties:
 *             self:
 *               type: string
 *             next:
 *               type: string
 *               nullable: true
 *             prev:
 *               type: string
 *               nullable: true
 */

/**
 * @openapi
 *
 * /v1/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     description: Returns a single JSON:API user resource by its ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: A single JSON:API User resource
 *         content:
 *           application/vnd.api+json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *
 * components:
 *   schemas:
 *
 *     # =============== BASIC JSON:API SCHEMAS ===============
 *
 *     ResourceIdentifier:
 *       type: object
 *       required:
 *         - type
 *         - id
 *       properties:
 *         type:
 *           type: string
 *         id:
 *           type: string
 *
 *     Relationship:
 *       type: object
 *       properties:
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/ResourceIdentifier'
 *             - type: array
 *               items:
 *                 $ref: '#/components/schemas/ResourceIdentifier'
 *
 *     # =============== DOMAIN SCHEMAS ===============
 *
 *     Attributes:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     Resource:
 *       type: object
 *       required:
 *         - type
 *         - id
 *         - attributes
 *       properties:
 *         type:
 *           type: string
 *           example: users
 *         id:
 *           type: string
 *         attributes:
 *           $ref: '#/components/schemas/Attributes'
 *         relationships:
 *           type: object
 *           properties:
 *             accounts:
 *               $ref: '#/components/schemas/Relationship'
 *             transactions:
 *               $ref: '#/components/schemas/Relationship'
 *
 *     # =============== RESPONSE SCHEMA ===============
 *
 *     Response:
 *       type: object
 *       properties:
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/Resource'
 *             - type: array
 *               items:
 *                 $ref: '#/components/schemas/Resource'
 *         meta:
 *           type: object
 *           nullable: true
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             size:
 *               type: integer
 *         links:
 *           type: object
 *           nullable: true
 *           properties:
 *             self:
 *               type: string
 *             next:
 *               type: string
 *               nullable: true
 *             prev:
 *               type: string
 *               nullable: true
 */

/**
 * @openapi
 *
 * /v1/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user and returns the created resource.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/vnd.api+json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 */

/**
 * @openapi
 *
 * /v1/users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     description: Updates an existing user and returns the updated resource.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/vnd.api+json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */

/**
 * @openapi
 *
 * /v1/users/{id}:
 *   delete:
 *     summary: Soft delete a user by ID
 *     description: Marks a user as deleted (soft delete) and returns the updated resource.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User soft deleted successfully
 *         content:
 *           application/vnd.api+json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
