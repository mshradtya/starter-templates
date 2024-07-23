import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import { ErrorCode } from "@/utils/exceptions/root";
import { validateSchema } from "@/middleware/validation.middleware";
import { LoginSchema, RegisterUserSchema } from "./user.validation";
import { AuthenticatedRequest } from "@/utils/interfaces/authenticated-req.interface";
import { authMiddleware } from "@/middleware/auth.middleware";
import { errorHandler } from "@/utils/error-handler";
import UserService from "./user.service";
import { UnauthorizedException } from "@/utils/exceptions/unauthorized.exception";

class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private UserService = new UserService();

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

    this.router.get(`${this.path}/refresh`, errorHandler(this.refresh));

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
    const { email, password, name, role } = req.body;

    const user = await this.UserService.registerUser(
      name,
      email,
      password,
      role
    );

    res.json({ user });
  };

  private loginUser = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    const { email, password } = req.body;

    const { id, name, role, accessToken, refreshToken } =
      await this.UserService.loginUser(email, password);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ id, name, role, accessToken });
  };

  private refresh = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const refreshToken = cookies.jwt;
    const { accessToken, role, id, name, email } =
      await this.UserService.refresh(refreshToken);
    res.json({ id, name, role, email, accessToken });
  };

  private currentUser = async (req: AuthenticatedRequest, res: Response) => {
    res.json(req.user);
  };
}

export default UserController;
