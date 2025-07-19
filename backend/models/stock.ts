import { db } from "../db";
import { Stock } from "../types/Stock";
import { OkPacket, RowDataPacket } from "mysql2";

export const setStock = (product_id: number, quantity: number, callback: Function) => {
  const sql = `INSERT INTO stocks (product_id, quantity)
               VALUES (?, ?)
               ON DUPLICATE KEY UPDATE quantity = ?`;
  db.query(sql, [product_id, quantity, quantity], (err, result) => {
    if (err) return callback(err);
    callback(null, "Stock updated.");
  });
};

export const getStockByProductId = (product_id: number, callback: Function) => {
  db.query("SELECT * FROM stocks WHERE product_id = ?", [product_id], (err, results) => {
    if (err) return callback(err);
    callback(null, (results as RowDataPacket[])[0] as Stock);
  });
};
