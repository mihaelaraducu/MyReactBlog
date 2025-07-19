import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { Product } from "../types/Product";

export const createProduct = (
  product: Product,
  callback: Function
) => {
  const sqlProduct = `
    INSERT INTO products (product_code, name, description, price, price_with_vat, material, color, image_url, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const sqlStock = `
    INSERT INTO stocks (product_id, quantity) VALUES (?, ?)
  `;

  // Start tranzacție
  db.beginTransaction((err) => {
    if (err) return callback(err);

    db.query(
      sqlProduct,
      [
        product.product_code,
        product.name,
        product.description,
        product.price,
        product.price_with_vat,
        product.material,
        product.color,
        product.image_url,
        product.is_active ?? 1,
      ],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            callback(err);
          });
        }

        const productId = (result as OkPacket).insertId;

        db.query(sqlStock, [productId, product.stock], (err, result) => {
          if (err) {
            return db.rollback(() => {
              callback(err);
            });
          }

          // Commit tranzacția
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }

            callback(null, productId);
          });
        });
      }
    );
  });
};


export const getAllProducts = (callback: Function) => {
  db.query("SELECT p.*,s.quantity FROM products p inner join stocks s on p.id=s.product_id WHERE p.is_active = 1", (err, results) => {
    if (err) return callback(err);
    callback(null, results as Product[]);
  });
};

export const getProductById = (id: number, callback: Function) => {
  db.query("SELECT p.*,s.quantity FROM products p inner join stocks s on p.id=s.product_id WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    callback(null, (results as RowDataPacket[])[0] as Product);
  });
};
