import { Response, NextFunction } from "express";
import { UnauthorizedException } from "@/utils/exceptions/unauthorized.exception";
import { ErrorCode } from "@/utils/exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/secrets";
import prismaClient from "@/utils/prisma";
import { AuthenticatedRequest } from "@/utils/interfaces/authenticated-req.interface";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || "";
  if (!token) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      return next(
        new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};
