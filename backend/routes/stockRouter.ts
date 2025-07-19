import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as stockModel from "../models/stock";

const router = express.Router();
const jsonParser = express.json();

router.post(
    "/",
    jsonParser,
    [
        body("product_id").isInt({ min: 1 }),
        body("quantity").isInt({ min: 0 }),
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { product_id, quantity } = req.body;
        stockModel.setStock(product_id, quantity, (err: Error, msg: string) => {
            if (err) return res.status(500).json({ message: err.message });
            res.status(200).json({ message: msg });
        });
    }
);

router.get("/:product_id", (req: Request, res: Response) => {
    const product_id = Number(req.params.product_id);
    stockModel.getStockByProductId(product_id, (err: Error, stock: any) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(stock);
    });
});

export default router;
