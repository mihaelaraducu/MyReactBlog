import express, { Request, Response, Router } from "express";
import * as bodyParser from "body-parser";

import * as userModel from "../models/user";
import { User } from "../types/User";
import { check, validationResult } from "express-validator";
import { generateToken, verifyToken } from "../jwt";

const userRouter: Router = express.Router();
var jsonParser = bodyParser.json();

userRouter.get("/", async (req: Request, res: Response) => {
  if (!verifyToken(req, res)) {
    res.status(403).json({
      message: "<b>Trebue sa fi logat pentru a accesa aceasta zona!<b>",
    });
    return;
  }
  userModel.findAll((err: Error, users: User[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }

    res.status(200).json({ data: users });
  });
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  if (!verifyToken(req, res)) {
    res.status(403).json({
      message: "<b>Trebue sa fi logat pentru a accesa aceasta zona!<b>",
    });
    return;
  }
  const userId: number = Number(req.params.id);
  userModel.findOne(userId, (err: Error, user: User | null) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }
    if (!user) {
      return res.status(404).json({ message: `Utilizatorul cu ID-ul ${userId} nu a fost găsit.` });
    }
    res.status(200).json({ data: user });
  });
});

userRouter.post(
  "/",
  jsonParser,
  [
    check("nume", "Name is requied").not().isEmpty(),
    check("prenume", "Name is requied").not().isEmpty(),
    check("email", "Please include a valid email")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: true }),
    check("parola", "Password must be 8 or more characters").matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "i"
    ),
  ],
  async (req: Request, res: Response) => {
    //console.log(req.body);
    const errors = validationResult(req);
    //console.log(errors);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
      return;
    }

    const newUser: User = req.body;
    userModel.create(newUser, (err: Error, userId: number) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }
      res
        .status(200)
        .json({ message: "Utilizatorul a fost adaugat cu succes!" });
    });
  }
);

// Edit user
userRouter.put("/:id", jsonParser, async (req: Request, res: Response) => {
  if (!verifyToken(req, res)) {
    res.status(403).json({
      message: "<b>Trebue sa fi logat pentru a accesa aceasta zona!<b>",
    });
    return;
  }
  const user: User = req.body;
  console.log(req.body);
  userModel.update(user, (err: Error) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    // res.status(200).send();
    res.status(200).json({
      message: "success",
    });
  });
});
// Delete user
userRouter.delete("/:id", jsonParser, async (req: Request, res: Response) => {
  if (!verifyToken(req, res)) {
    res.status(403).json({
      message: "<b>Trebue sa fi logat pentru a accesa aceasta zona!<b>",
    });
    return;
  }
  const userId: number = Number(req.params.id);
  console.log(userId);
  userModel.deleteUser(userId, (err: Error) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    // res.status(200).send();
    res.status(200).json({
      message: "success",
    });
  });
});
userRouter.post(
  "/veifyLogin",
  jsonParser,
  async (req: Request, res: Response) => {
    console.log(req.body);
    const loginUser: User = req.body;
    userModel.veifyPassword(loginUser, (err: Error, user: User) => {
      if (err) {
        return res.status(401).send({
          accessToken: null,
          message: err.message,
        });
        //return res.status(500).json({"message": err.message});
      }
      var token = generateToken();
      console.log("JWT", token);
      //res.status(200).json({"message": 'success'});
      res.status(200).send({
        id: user.id,
        nume: user.nume,
        prenume: user.prenume,
        email: user.email,
        roles: "ADMIN",
        accessToken: token,
      });
    });
  }
);
userRouter.post("/logout", async (req: Request, res: Response) => {
  res.status(200).json({
    accessToken: null,
    message: "User has been logged out.",
  });
  return;
});

export { userRouter };