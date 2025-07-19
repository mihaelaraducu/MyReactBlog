import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { ContactMessage } from "../types/ContactMessage";

export const createMessage = (
  msg: ContactMessage,
  callback: (err: Error | null, id?: number) => void
) => {
  const sql = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [msg.name, msg.email, msg.subject, msg.message], (err, result) => {
    if (err) return callback(err);
    const insertId = (result as OkPacket).insertId;
    callback(null, insertId);
  });
};

export const getAllMessages = (
  callback: (err: Error | null, results?: ContactMessage[]) => void
) => {
  db.query("SELECT * FROM contact_messages ORDER BY sent_at DESC", (err, results) => {
    if (err) return callback(err);
    callback(null, results as ContactMessage[]);
  });
};

export const getMessageById = (
  id: number,
  callback: (err: Error | null, result?: ContactMessage) => void
) => {
  db.query("SELECT * FROM contact_messages WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    const message = (results as RowDataPacket[])[0];

    //callback(null, message);
  });
};

export const deleteMessage = (
  id: number,
  callback: (err: Error | null, result?: string) => void
) => {
  db.query("DELETE FROM contact_messages WHERE id = ?", [id], (err, result) => {
    if (err) return callback(err);
    callback(null, "Message deleted successfully.");
  });
};
