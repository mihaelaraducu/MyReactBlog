import { mapToPublicUser, PublicUser, User } from "./../types/User";
import { db } from "../db";
import bcryptjs from "bcryptjs";
import { OkPacket, RowDataPacket } from "mysql2";
// Get all users
export const findAll = (callback: Function) => {
  const queryString = `SELECT * FROM users`;
  db.query(queryString, (err, result) => {
    if (err) {
      callback(err);
    }
    const rows = <RowDataPacket[]>result;
    const users: PublicUser[] = [];
    console.log(users);
    rows.forEach((row) => {
      const user: User = {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        created_at: row.created_at,
        activ: row.activ
      };
      const publicUser = mapToPublicUser(user);
      users.push(publicUser);
    });

    callback(null, users);
  });
};
// Get one user
export const findOne = (userId: number, callback: Function) => {
  const queryString = `SELECT * FROM users WHERE id=?`;
  db.query(queryString, userId, (err, result) => {
    if (err) {
      return callback(err);
    }

    const row = (<RowDataPacket>result)[0];
    if (!row) {
      return callback(null, null); // Return null dacă nu există date
    }

    const user: User = {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      password: row.password,
      created_at: row.created_at,
      activ: row.activ
    };
    const publicUsers = mapToPublicUser(user);
    callback(null, publicUsers);
  });
};
// create user
export const create = (user: User, callback: Function) => {
  //Verificam daca exista user cu aceasta adresa de email
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [user.email], (err, result) => {
    const row = (<RowDataPacket>result)[0];
    if (row !== null && row !== undefined) {
      callback("User already exists!." + err?.message);
    } else {
      const queryString =
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
      console.log("insert", user);

      const saltRounds = bcryptjs.genSaltSync(10);
      const password_hash = bcryptjs.hashSync(user.password!, saltRounds);

      try {
        db.query(
          queryString,
          [user.name, user.email, password_hash, user.role || 'customer'], // 1 = activ
          (err, result) => {
            if (result !== undefined && 'insertId' in result) {
              const insertId = (result as OkPacket).insertId;
              callback(null, insertId);
            } else {
              console.log("error inserting user", err);
              callback(err);
            }
          }
        );
      } catch (error) {
        callback(error);
      }

    }
  });
};

// update user
export const update = (user: User, callback: Function) => {
  const queryString = `UPDATE users SET name=?, role=? WHERE id=?`;

  db.query(queryString, [user.name, user.role, user.id], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null);
  });
};
// delete user
export const deleteUser = (user: number, callback: Function) => {
  console.log(user);
  const queryString = `UPDATE users SET activ=0 WHERE id=?`;

  db.query(queryString, [user], (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null);
  });
};

export const changePassword = (
  email: string,
  password: string,
  new_password: string,
  callback: (err: Error | null, message?: string) => void
) => {
  const queryString = `SELECT * FROM users WHERE email = ? LIMIT 1`;

  db.query(queryString, [email], (err, result) => {
    if (err) return callback(err);

    if ((result as any).length === 1) {
      const row = (result as RowDataPacket[])[0];
      const storedHash = row.password;

      const isMatch = bcryptjs.compareSync(password, storedHash);

      if (!isMatch) {
        return callback(null, "Invalid current password.");
      }

      const saltRounds = 10;
      const newPasswordHash = bcryptjs.hashSync(new_password, saltRounds);

      const updatePasswordString = `UPDATE users SET password = ? WHERE email = ?`;

      db.query(updatePasswordString, [newPasswordHash, email], (updateErr) => {
        if (updateErr) return callback(updateErr);
        return callback(null, "Password updated successfully.");
      });

    } else {
      return callback(null, "User not found.");
    }
  });
};


//login  example
export const verifyPassword = (user: User, callback: Function) => {
  const queryString = `SELECT * from users where email=? LIMIT 1;`;
  const passwordUser = user.password;
  db.query(queryString, [user.email], (err, result) => {
    if (err) {
      callback(err);
    }
    if ((result as any).length == 1) {
      const row = (<RowDataPacket>result)[0];
      var password_hash = row.password;
      const verified = bcryptjs.compareSync(passwordUser!, password_hash);
      if (verified) {
        const user: User = {
          id: row.id,
          name: row.name,
          email: row.email,
          password: row.password,
          role: row.role,
          created_at: row.created_at,
          activ: row.activ
        };
        callback(null, user);
      } else {
        console.log("Password doesn't match!");
        callback({message:"Invalid Password!"});
      }
    } else {
      callback({message:"User Not found."});
    }
  });
};