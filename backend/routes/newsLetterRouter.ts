import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as newsletterModel from "../models/newsletterSubscriber";
const newsLetterRouter = express.Router();
const jsonParser = express.json();

// ✅ Subscribe
newsLetterRouter.post(
  "/subscribe",
  jsonParser,
  [body("email").isEmail().withMessage("Valid email is required.")],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email } = req.body;
    newsletterModel.addSubscriber(email, (err, id) => {
      if (err) {
        res.status(500).json({ message: "Already subscribed or DB error." });
        return;
      }
      res.status(201).json({ message: "Subscribed successfully.", id });
      return;
    });
  }
);

// ✅ Unsubscribe
newsLetterRouter.post(
  "/unsubscribe",
  jsonParser,
  [body("email").isEmail().withMessage("Valid email is required.")],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { email } = req.body;
    newsletterModel.unsubscribe(email, (err, message) => {
      if (err) {
        res.status(500).json({ message: "Error unsubscribing." });
        return;
      }
      res.status(200).json({ message });
      return;
    });
  }
);
export default newsLetterRouter;
