import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as productModel from "../models/product";
const productRouter = express.Router();
const jsonParser = express.json();

productRouter.post(
    "/",
    jsonParser,
    [
        body("product_code").notEmpty(),
        body("price_with_vat").isNumeric(),
        body("color").isIn(["gold", "silver"]),
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const product = req.body;
        productModel.createProduct(product, (err: Error, id: number) => {
            if (err) return res.status(500).json({ message: err.message });
            res.status(201).json({ message: "Product created", id });
        });
    }
);

productRouter.get("/", (req: Request, res: Response) => {
    productModel.getAllProducts((err: Error, products: any[]) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(products);
    });
});

export default productRouter;
