import prismaClient from "@/utils/prisma";
import { NotFoundException } from "@/utils/exceptions/not-found.exception";
import { BadRequestsException } from "@/utils/exceptions/bad-request.exception";
import { ErrorCode } from "@/utils/exceptions/root";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/utils/secrets";
import { UnauthorizedException } from "@/utils/exceptions/unauthorized.exception";
import { Role, User } from "@prisma/client";

class UserService {
  /**
   * Register a new user
   */
  public async registerUser(
    name: string,
    email: string,
    password: string,
    role: Role
  ): Promise<Partial<User>> {
    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      throw new BadRequestsException(
        "User Already Exists",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    user = await prismaClient.user.create({
      data: { name, email, role, password: hashSync(password, 10) },
    });

    // Create a new object excluding the password
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  /**
   * Attempt to login a user
   */
  public async loginUser(
    email: string,
    password: string
  ): Promise<{
    id: number;
    name: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }> {
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
    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Get New Access Token
   */
  public async refresh(refreshToken: string): Promise<{
    id: number;
    name: string;
    role: string;
    email: string;
    accessToken: string;
  }> {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          reject(
            new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
          );
          return;
        }

        const jwtPayload = decoded as JwtPayload;

        if (!jwtPayload.user || typeof jwtPayload.user !== "object") {
          reject(
            new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
          );
          return;
        }

        const { id } = jwtPayload.user;

        try {
          const newUser = await prismaClient.user.findFirst({ where: { id } });

          if (!newUser) {
            reject(
              new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
            );
            return;
          }

          const accessToken = jwt.sign(
            {
              user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
              },
            },
            ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1d",
            }
          );

          resolve({
            id: newUser.id,
            name: newUser.name,
            role: newUser.role,
            email: newUser.email,
            accessToken,
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

export default UserService;
