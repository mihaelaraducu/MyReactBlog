import { db } from "../db";
import { Contact } from "../types/Contact";
import { RowDataPacket } from "mysql2";


export const findAllContacts = (callback: Function) => {
  const queryString = `SELECT * FROM contact`;
  db.query(queryString, (err, result) => {
    if (err) {
      return callback(err);
    }
    const rows = <RowDataPacket[]>result;
    const contacts: Contact[] = rows.map(row => ({
      id: row.id,
      nume: row.nume,
      prenume: row.prenume,
      email: row.email,
      mesaj: row.mesaj,
      data_adaugare: row.data_adaugare
    }));
    callback(null, contacts);
  });
};