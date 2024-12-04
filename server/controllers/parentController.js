const db = require("../config/DBmanager");

exports.getAllParents = async (req, res) => {
  try {
    const query = `SELECT * FROM "Parent"`;
    const params = [];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "no parents found" });
    }

    return res.json(result.rows);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addParent = async (req, res) => {
  const { User_ID } = req.body;
  try {
    const query = `INSERT INTO "Parent" ("User_ID") VALUES ($1) RETURNING *`; // return inserted User
    const params = [User_ID];
    const result = await db.query(query, params);
    return res
      .status(201)
      .json({ message: "Added Parent successfully", Parent: result.rows[0] });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getParentById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM "Parent" WHERE "Parent_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Parent not found" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteParent = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE FROM "Parent" WHERE "Parent_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Parent not found" });
    }
    return res.json({ message: "Parent deleted successfully" });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
