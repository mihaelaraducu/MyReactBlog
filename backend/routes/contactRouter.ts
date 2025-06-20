import { Router } from "express";
import { findAllContacts } from "../models/contact";

const contactRouter = Router();

// Ruta pentru obținerea tuturor mesajelor
contactRouter.get("/", (req, res) => {
  findAllContacts((err: Error, contacts: any) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(contacts);
  });
});

export { contactRouter };