import { Router, Request, Response } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import prismaClient from "@/utils/prisma";
import { validateSchema } from "@/middleware/validation.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import { errorHandler } from "@/utils/error-handler";
import { CreateProductSchema } from "./products.validation";
import { adminMiddleware } from "@/middleware/admin.middleware";

class ProductController implements Controller {
  public path = "/products";
  public router = Router();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}`,
      [authMiddleware, adminMiddleware, validateSchema(CreateProductSchema)],
      errorHandler(this.createProduct)
    );
  }

  private createProduct = async (req: Request, res: Response) => {
    const product = await prismaClient.product.create({
      data: {
        ...req.body,
        tags: req.body.tags.join(","),
      },
    });

    res.json(product);
  };
}

export default ProductController;
