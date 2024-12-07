const e = require("express");
const db = require("../config/DBmanager");

exports.getAllCamps = async (req, res) => {
  try {
    const query = `SELECT * FROM "Camp"`;
    const camps = await db.query(query);
    res.json(camps.rows);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCamp = async (req, res) => {
  const { camp_id } = req.params;
  try {
    const query = `SELECT * FROM "Camp" WHERE "Event_ID" = $1`;
    const params = [camp_id];
    const camp = await db.query(query, params);
    return res.json(camp.rows[0]);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addCamp = async (req, res) => {
  const { Event_ID, Season, Duration } = req.body;
  try {
    const query = `INSERT INTO "Camp" ("Event_ID", "Season", "Duration") VALUES ($1, $2, $3) RETURNING *`;
    const params = [Event_ID, Season, Duration];
    const newCamp = await db.query(query, params);
    return res.json(newCamp.rows[0]);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateCamp = async (req, res) => {
  const { camp_id } = req.params;
  const { Season, Duration } = req.body;
  if (!Season || !Duration) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const query = `UPDATE "Camp" SET "Season" = $1, "Duration" = $2 WHERE "Event_ID" = $3 RETURNING *`;
    const params = [Season, Duration, camp_id];
    const updatedCamp = await db.query(query, params);
    return res.json(updatedCamp.rows[0]);
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCamp = async (req, res) => {
  const { camp_id } = req.params;
  if (isNaN(camp_id)) {
    return res.status(400).json({ message: "Event_ID must be a number" });
  }
  try {
    const query = `DELETE FROM "Camp" WHERE "Event_ID" = $1`;
    const params = [camp_id];
    const camp = await db.query(query, params);
    if (camp.rowCount === 0) {
      return res.status(404).json({ message: "Camp not found" });
    }
    return res.json({ message: "Camp deleted successfully" });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
