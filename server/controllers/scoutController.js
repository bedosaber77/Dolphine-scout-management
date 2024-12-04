const db = require("../config/DBmanager");

exports.getAllScouts = async (req, res) => {
  try {
    const query = `SELECT * FROM "Scout"`;
    const params = [];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "no scouts found" });
    }
    return res.json(result.rows);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getScoutbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM "Scout" WHERE "User_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "scout not found" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addScout = async (req, res) => {
  const { User_ID, rank, PaperSubmitted, Birthdate, academicYear, joinDate } =
    req.body;
  try {
    const query = `INSERT INTO "Scout" ("User_ID", "rank", "PapersSubmitted","Birthdate","academicYear","joinDate") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`; // return inserted Scout
    const params = [
      User_ID,
      rank,
      PaperSubmitted,
      Birthdate,
      academicYear,
      joinDate,
    ];
    const result = await db.query(query, params);
    const query2 = `Update "User" Set "role" ='Scout' Where "User_ID" = $1`;
    const params2 = [User_ID];
    await db.query(query2, params2);
    return res
      .status(201)
      .json({ message: "Added Scout successfully", Scout: result.rows[0] });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateScout = async (req, res) => {
  const { id } = req.params;
  const { rank, PaperSubmitted, Birthdate, academicYear, joinDate } = req.body;
  try {
    const query = `UPDATE "Scout" SET "rank" = $1, "PaperSubmitted" = $2, "Birthdate" = $3, "academicYear" = $4, "joinDate" = $5 WHERE "id" = $6 RETURNING *`;
    const params = [
      rank,
      PaperSubmitted,
      Birthdate,
      academicYear,
      joinDate,
      id,
    ];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Scout not found" });
    }
    return res.json({
      message: "Scout updated successfully",
      Scout: result.rows[0],
    });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteScout = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE FROM "Scout" WHERE "id" = $1 RETURNING *`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Scout not found" });
    }
    return res.json({ message: "Scout deleted successfully" });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}; // needed to be revisit what to do here
