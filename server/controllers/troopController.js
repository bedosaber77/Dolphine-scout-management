const db = require("../config/DBmanager");

exports.getAllTroops = async (req, res) => {
  try {
    const query = `SELECT * FROM "Troop"`;
    const params = [];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "no troops found" });
    }
    return res.json(result.rows);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getTroopById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM "Troop" WHERE "Troop_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Troop not found" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addTroop = async (req, res) => {
  const { Troop_ID, Tname, type, max_Members, ScoutLeader_ID } = req.body;
  try {
    const query = `INSERT INTO "Troop" ("Troop_ID", "Tname", "type", "max_Members", "ScoutLeader_ID") VALUES ($1, $2, $3, $4, $5) RETURNING *`; // return inserted User
    const params = [Troop_ID, Tname, type, max_Members, ScoutLeader_ID];
    const result = await db.query(query, params);
    return res
      .status(201)
      .json({ message: "Added Troop successfully", Troop: result.rows[0] });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateTroop = async (req, res) => {
  const { id } = req.params;
  const { Tname, type, max_Members, ScoutLeader_ID } = req.body;
  try {
    const query = `UPDATE "Troop" SET "Tname" = $1, "type" = $2, "max_Members" = $3, "ScoutLeader_ID" = $4 WHERE "Troop_ID" = $5 RETURNING *`;
    const params = [Tname, type, max_Members, ScoutLeader_ID, id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Troop not found" });
    }
    return res.json({
      message: "Troop updated successfully",
      Troop: result.rows[0],
    });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteTroop = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE FROM "Troop" WHERE "Troop_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Troop not found" });
    }
    return res.status(200).json({ message: "Troop deleted successfully" });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getScoutsInTroop = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
    SELECT U."User_ID", U."Fname", U."Lname", U."Phonenum", U."email", U."role", S.*
    FROM "User" U
    INNER JOIN "Scout" S
    ON U."User_ID" = S."User_ID"
    INNER JOIN "Participation" T
    ON S."User_ID" = T."Scout_ID"
    WHERE T."Troop_ID" = $1
            `;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "no scouts found" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addScoutToTroop = async (req, res) => {
  const { id } = req.params;
  const { Scout_ID, participationDate } = req.body;
  try {
    const query = `Insert into "Participation" ("Scout_ID", "Troop_ID", "ParticipationDate") VALUES ($1, $2, $3) RETURNING *`;
    const params = [Scout_ID, id, participationDate];
    const result = await db.query(query, params);
    return res.status(201).json({
      message: "Added Scout successfully",
      //Scout: result.rows
    });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeScoutFromTroop = async (req, res) => {
  const { id, scout_id } = req.params;
  try {
    const query = `DELETE FROM "Participation" WHERE "Scout_ID" = $1 AND "Troop_ID" = $2`;
    const params = [scout_id, id];
    const result = await db.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Scout not found" });
    }
    return res.status(200).json({ message: "Scout removed successfully" });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
