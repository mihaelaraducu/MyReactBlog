import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { NewsletterSubscriber } from "../types/NewsletterSubscriber";

export const addSubscriber = (
  email: string,
  callback: (err: Error | null, id?: number) => void
) => {
  const sql = `INSERT INTO newsletter_subscribers (email) VALUES (?)`;
  db.query(sql, [email], (err, result) => {
    if (err) return callback(err);
    callback(null, (result as OkPacket).insertId);
  });
};

export const getAllSubscribers = (
  callback: (err: Error | null, results?: NewsletterSubscriber[]) => void
) => {
  db.query("SELECT * FROM newsletter_subscribers WHERE activ = 1", (err, results) => {
    if (err) return callback(err);
    callback(null, results as NewsletterSubscriber[]);
  });
};

export const unsubscribe = (
  email: string,
  callback: (err: Error | null, message?: string) => void
) => {
  const sql = `UPDATE newsletter_subscribers SET activ = 0 WHERE email = ?`;
  db.query(sql, [email], (err, result) => {
    if (err) return callback(err);
    callback(null, "Unsubscribed successfully.");
  });
};
