// import { Router } from "express";
// import { findAllContacts } from "../models/contact";

// const contactRouter = Router();

// // Ruta pentru obținerea tuturor mesajelor
// contactRouter.get("/", (req, res) => {
//   findAllContacts((err: Error, contacts: any) => {
//     if (err) {
//       return res.status(500).send(err.message);
//     }
//     res.json(contacts);
//   });
// });

// export { contactRouter };

import express, { Request, Response } from "express";
import * as contactModel from "../models/contactMessageModel";
import { ContactMessage } from "../types/ContactMessage";

const contactRouter = express.Router();
const jsonParser = express.json();

// POST /contact - trimite un mesaj
contactRouter.post("/", jsonParser, (req: Request, res: Response) => {
  const newMessage: ContactMessage = req.body;

  if (!newMessage.name || !newMessage.email || !newMessage.subject || !newMessage.message) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  contactModel.createMessage(newMessage, (err, id) => {
    if (err) {
      res.status(500).json({ message: "Error saving message." });
      return;
    }
    res.status(201).json({ message: "Message sent successfully.", id });
    return;
  });
});

// GET /contact - toate mesajele
contactRouter.get("/", (req: Request, res: Response) => {
  contactModel.getAllMessages((err, messages) => {
    if (err) return res.status(500).json({ message: "Error retrieving messages." });
    res.status(200).json(messages);
  });
});

// GET /contact/:id - un mesaj specific
contactRouter.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  contactModel.getMessageById(id, (err, message) => {
    if (err) return res.status(500).json({ message: "Error retrieving message." });
    if (!message) return res.status(404).json({ message: "Message not found." });
    res.status(200).json(message);
  });
});

// DELETE /contact/:id - șterge un mesaj
contactRouter.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  contactModel.deleteMessage(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting message." });
    res.status(200).json({ message: result });
  });
});

export default contactRouter;
