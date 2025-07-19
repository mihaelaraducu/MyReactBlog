import express, { Request, Response, Router } from "express";
import * as bodyParser from "body-parser";

import * as userModel from "../models/user";
import { PublicUser, User } from "../types/User";
import { check, validationResult } from "express-validator";
import { generateToken, verifyToken } from "../jwt";

const userRouter: Router = express.Router();
var jsonParser = bodyParser.json();

userRouter.get("/", async (req: Request, res: Response) => {
  // if (!verifyToken(req, res)) {
  //   res.status(403).json({
  //     message: "<b>Trebue sa fi logat pentru a accesa aceasta zona!<b>",
  //   });
  //   return;
  // }
  userModel.findAll((err: Error, users: PublicUser[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }

    res.status(200).json({ data: users });
  });
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  // if (!verifyToken(req, res)) {
  //   res.status(403).json({
  //     message: "<b>Trebue sa fi logat pentru a accesa aceasta zona!<b>",
  //   });
  //   return;
  // }
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
    check("name", "Name is requied").not().isEmpty(),
    check("email", "Please include a valid email")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: true }),
    check("password", "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).").matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "i"
    ),
  ],
  async (req: Request, res: Response) => {
    console.log(req.body);
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
  // if (!verifyToken(req, res)) {
  //   res.status(403).json({
  //     message: "<b>Trebue sa fi logat pentru a accesa aceasta zona!<b>",
  //   });
  //   return;
  // }
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
  "/verifyLogin",
  jsonParser,
  async (req: Request, res: Response) => {
    const loginUser: User = req.body;

    userModel.verifyPassword(loginUser, (err: Error, user: User) => {
      if (err) {
        return res.status(401).send({
          accessToken: null,
          message: err.message,
        });
      }

      const token = generateToken();

      res.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "customer",
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
userRouter.post("/changePassword", jsonParser, async (req: Request, res: Response) => {
  const { email, password, new_password } = req.body;

  if (!email || !password || !new_password) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  userModel.changePassword(email, password, new_password, (err, message) => {
    if (err) {
      res.status(500).json({ message: "Error updating password." });
      return;
    }

    if (message === "Invalid current password.") {
      res.status(401).json({ message });
      MediaElementAudioSourceNode;
    }

    if (message === "User not found.") {
      res.status(404).json({ message });
      return;
    }

    res.status(200).json({ message });
    return;
  });
});




export { userRouter };