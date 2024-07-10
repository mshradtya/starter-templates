import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import { BadRequestsException } from "@/utils/exceptions/bad-request.exception";
import { ErrorCode } from "@/utils/exceptions/root";
import prismaClient from "@/utils/prisma";
import { compareSync, hashSync } from "bcrypt";
import { validateSchema } from "@/middleware/validation.middleware";
import { LoginSchema, RegisterUserSchema } from "./user.validation";
import { NotFoundException } from "@/utils/exceptions/not-found.exception";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/secrets";
import { AuthenticatedRequest } from "@/utils/interfaces/authenticated-req.interface";
import { authMiddleware } from "@/middleware/auth.middleware";
import { errorHandler } from "@/utils/error-handler";

class UserController implements Controller {
  public path = "/users";
  public router = Router();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validateSchema(RegisterUserSchema),
      errorHandler(this.registerUser)
    );

    this.router.post(
      `${this.path}/login`,
      validateSchema(LoginSchema),
      errorHandler(this.loginUser)
    );

    this.router.get(
      `${this.path}/me`,
      [authMiddleware],
      errorHandler(this.currentUser)
    );
  }

  private registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      throw new BadRequestsException(
        "User Already Exists",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    user = await prismaClient.user.create({
      data: { name, email, password: hashSync(password, 10) },
    });
    res.json({ user });
  };

  private loginUser = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotFoundException("User Not Found", ErrorCode.USER_NOT_FOUND);
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestsException(
        "Incorrect Password",
        ErrorCode.INCORRECT_PASSWORD
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.json({ user, token });
  };

  private currentUser = async (req: AuthenticatedRequest, res: Response) => {
    res.json(req.user);
  };
}

export default UserController;
