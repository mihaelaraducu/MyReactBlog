import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import session from "express-session";
import fileUpload from "express-fileupload";
import { userRouter } from "./routes/userRouter";
import { postRouter } from "./routes/postRouter";
import { adminRouter } from "./routes/adminRouter";

import { findOne } from "./models/user";
import contactRouter from "./routes/contactRouter";
import newsLetterRouter from "./routes/newsLetterRouter";
import productRouter from "./routes/productRouter";
import stockRouter from "./routes/stockRouter";
dotenv.config();

const app: Express = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "dist")));

app.use(fileUpload());
const port = process.env.PORT;
app.use(cors());
app.use("/users", userRouter);
app.use("/post", postRouter);
app.use("/admin", adminRouter);
app.use("/messages", contactRouter);
app.use("/newsletter",newsLetterRouter);
app.use("/products", productRouter);
app.use("/stocks", stockRouter);

//app.use("/uploads", express.static(path.join(__dirname+ "/uploads")));
app.use("/uploads", express.static("dist/uploads"));
app.get("/", (req: Request, res: Response) => {
  res.send('Express + TypeScript Server!!!!');
  //res.sendFile(path.join(__dirname + "/acasa.html"));
});
app.get("/articol/:id", (req, res) => {
  const postId = Number(req.params.id);
  findOne(postId, (err: Error, post: any) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!post) {
      return res.status(404).send(`Articolul cu ID-ul ${postId} nu a fost găsit.`);
    }
    res.json(post);
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});