import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Users, UsersInput } from "../../database/dbSchema";
import { createErrorDocument } from "../utils/jsonapi/error";
import logger from "../utils/logger/logger";
import * as userController from "./controller";
import { mapToUserResource } from "./mapper";
import userService from "./service";
import { createUserSchema, updateUserSchema } from "./validation";

vi.mock("./service");
vi.mock("./mapper");
vi.mock("../utils/logger/logger");
vi.mock("../utils/jsonapi/error");

describe("User Controller", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  // -------------------- getAllUsers --------------------
  describe("getAllUsers", () => {
    it("should return all users successfully", async () => {
      const mockUsers: Users[] = [{ id: 1, name: "Alice" } as Users];
      (userService.getAllUsers as unknown as vi.Mock).mockResolvedValue(mockUsers);
      (mapToUserResource as unknown as vi.Mock).mockImplementation((u: Users) => u);

      const req = {} as Partial<Request>;
      await userController.getAllUsers(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should handle service errors", async () => {
      const error = new Error("DB failure");
      (userService.getAllUsers as unknown as vi.Mock).mockRejectedValue(error);
      (createErrorDocument as unknown as vi.Mock).mockImplementation((errs: unknown) => errs);

      const req = {} as Partial<Request>;
      await userController.getAllUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  // -------------------- getUserById --------------------
  describe("getUserById", () => {
    it("should return a user when found", async () => {
      const mockUser: Users = { id: 1, name: "Alice" } as Users;
      (userService.getUserById as unknown as vi.Mock).mockResolvedValue(mockUser);
      (mapToUserResource as unknown as vi.Mock).mockImplementation((u: Users) => u);

      const req = { params: { id: "1" } } as Partial<Request<{ id: string }>>;
      await userController.getUserById(req as Request<{ id: string }>, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      (userService.getUserById as unknown as vi.Mock).mockResolvedValue(null);
      (createErrorDocument as unknown as vi.Mock).mockImplementation((errs: unknown) => errs);

      const req = { params: { id: "1" } } as Partial<Request<{ id: string }>>;
      await userController.getUserById(req as Request<{ id: string }>, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it("should handle service errors", async () => {
      const error = new Error("DB failure");
      (userService.getUserById as unknown as vi.Mock).mockRejectedValue(error);
      (createErrorDocument as unknown as vi.Mock).mockImplementation((errs: unknown) => errs);

      const req = { params: { id: "1" } } as Partial<Request<{ id: string }>>;
      await userController.getUserById(req as Request<{ id: string }>, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  // -------------------- createUser --------------------
  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const mockInput: UsersInput = { name: "Alice" } as UsersInput;
      const mockUser: Users = { id: 1, ...mockInput } as Users;

      (userService.createUser as unknown as vi.Mock).mockResolvedValue(mockUser);
      (mapToUserResource as unknown as vi.Mock).mockImplementation((u: Users) => u);
      vi.spyOn(createUserSchema, "validate").mockReturnValue({ value: mockInput });

      const req = { body: mockInput } as Partial<Request<{}, {}, UsersInput>>;
      await userController.createUser(req as Request<{}, {}, UsersInput>, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({ message: "User created", user: mockUser });
    });

    it("should return 400 on validation error", async () => {
      const validationError = { error: { details: [{ message: "Invalid" }] } };
      vi.spyOn(createUserSchema, "validate").mockReturnValue(validationError as any);

      const req = { body: { invalid: "data" } } as Partial<Request<{}, {}, UsersInput>>;
      await userController.createUser(req as Request<{}, {}, UsersInput>, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  // -------------------- updateUser --------------------
  describe("updateUser", () => {
    it("should update a user successfully", async () => {
      const mockInput: UsersInput = { name: "Alice Updated" } as UsersInput;
      const mockUser: Users = { id: 1, ...mockInput } as Users;

      (userService.updateUser as unknown as vi.Mock).mockResolvedValue(mockUser);
      (mapToUserResource as unknown as vi.Mock).mockImplementation((u: Users) => u);
      vi.spyOn(updateUserSchema, "validate").mockReturnValue({ value: mockInput });

      const req = { body: mockInput, params: { id: "1" } } as Partial<Request<{ id: string }, {}, UsersInput>>;
      await userController.updateUser(req as Request<{ id: string }, {}, UsersInput>, res as Response);

      expect(res.json).toHaveBeenCalledWith({ message: "User updated", user: mockUser });
    });

    it("should return 400 on validation error", async () => {
      const validationError = { error: { details: [{ message: "Invalid" }] } };
      vi.spyOn(updateUserSchema, "validate").mockReturnValue(validationError as any);

      const req = { body: {}, params: { id: "1" } } as Partial<Request<{ id: string }, {}, UsersInput>>;
      await userController.updateUser(req as Request<{ id: string }, {}, UsersInput>, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      const mockInput: UsersInput = { name: "Alice" } as UsersInput;
      (userService.updateUser as unknown as vi.Mock).mockResolvedValue(null);
      vi.spyOn(updateUserSchema, "validate").mockReturnValue({ value: mockInput });
      (createErrorDocument as unknown as vi.Mock).mockImplementation((errs: unknown) => errs);

      const req = { body: mockInput, params: { id: "1" } } as Partial<Request<{ id: string }, {}, UsersInput>>;
      await userController.updateUser(req as Request<{ id: string }, {}, UsersInput>, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  // -------------------- deleteUser --------------------
  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      const mockUser: Users = { id: 1, name: "Alice" } as Users;
      (userService.deleteUser as unknown as vi.Mock).mockResolvedValue(mockUser);
      (mapToUserResource as unknown as vi.Mock).mockImplementation((u: Users) => u);

      const req = { params: { id: "1" } } as Partial<Request<{ id: string }>>;
      await userController.deleteUser(req as Request<{ id: string }>, res as Response);

      expect(res.json).toHaveBeenCalledWith({ message: "User soft deleted", user: mockUser });
    });

    it("should return 404 if user not found", async () => {
      (userService.deleteUser as unknown as vi.Mock).mockResolvedValue(null);
      (createErrorDocument as unknown as vi.Mock).mockImplementation((errs: unknown) => errs);

      const req = { params: { id: "1" } } as Partial<Request<{ id: string }>>;
      await userController.deleteUser(req as Request<{ id: string }>, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it("should handle service errors", async () => {
      const error = new Error("DB failure");
      (userService.deleteUser as unknown as vi.Mock).mockRejectedValue(error);
      (createErrorDocument as unknown as vi.Mock).mockImplementation((errs: unknown) => errs);

      const req = { params: { id: "1" } } as Partial<Request<{ id: string }>>;
      await userController.deleteUser(req as Request<{ id: string }>, res as Response);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
