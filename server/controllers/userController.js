const db = require("../config/DBmanager");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const query = `SELECT * FROM "User"`;
    const params = [];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "no users found" });
    }

    return res.json(result.rows);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM "User" WHERE "User_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addUser = async (req, res) => {
  const { email, password, Fname, Lname, role, Phonenum } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const query = `INSERT INTO "User" ("email", "password", "Fname", "Lname", "role", "Phonenum") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`; // return inserted User
    const params = [
      email.toLowerCase(),
      hashedPassword,
      Fname,
      Lname,
      role,
      Phonenum,
    ];
    const result = await db.query(query, params);
    const { password, ...rest } = result.rows[0];
    return res
      .status(201)
      .json({ message: "Added User successfully", User: rest });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, Fname, Lname, role, Phonenum } = req.body;
  try {
    let query = `UPDATE "User" SET`;
    let params = [];
    let count = 1;
    if (email) {
      query += ` "email" = $${count},`;
      params.push(email.toLowerCase());
      count++;
    }
    if (password) {
      query += ` "password" = $${count++},`;
      const hashedPassword = await bcrypt.hash(password, 10);
      params.push(hashedPassword);
    }
    if (Fname) {
      query += ` "Fname" = $${count++},`;
      params.push(Fname);
    }
    if (Lname) {
      query += ` "Lname" = $${count++},`;
      params.push(Lname);
    }
    if (role) {
      query += ` "role" = $${count++},`;
      params.push(role);
    }
    if (Phonenum) {
      query += ` "Phonenum" = $${count++},`;
      params.push(Phonenum);
    }
    query = query.slice(0, -1); // remove the last comma
    query += ` WHERE "User_ID" = $${count} RETURNING *`;
    console.log(query);
    params.push(id);
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...rest } = result.rows[0];
    return res.json({
      message: "User updated successfully",
      User: rest,
    });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE FROM "User" WHERE "User_ID" = $1 RETURNING *`;
    const params = [id];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...rest } = result.rows[0];
    return res.json({
      message: "User deleted successfully",
      User: rest,
    });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
