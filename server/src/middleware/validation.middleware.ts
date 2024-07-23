import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { UnprocessableEntity } from "@/utils/exceptions/unprocessable-entity.exception";
import { ErrorCode } from "@/utils/exceptions/root";

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      next(
        new UnprocessableEntity(
          parseResult.error.issues,
          "Unprocessable Entity",
          ErrorCode.UNPROCESSABLE_ENTITY
        )
      );
      return;
    }

    // Attach parsed data to the request object
    req.body = parseResult.data;
    next();
  };
};
