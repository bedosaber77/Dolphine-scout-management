const db = require('../config/DBmanager');

exports.getAllScoutleaders = async (req, res) => {
  try {
    const query = `SELECT s.*, u."User_ID", u."Fname", u."Lname", u."Phonenum", u."email", u."role"
    FROM "ScoutLeader" s
    JOIN "User" u ON s."User_ID" = u."User_ID"`;
    const result = await db.query(query);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getScoutleaderbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT L.*, CONCAT(u."Fname", ' ', u."Lname") AS name FROM "ScoutLeader"L JOIN "User"U ON L."User_ID" = U."User_ID" AND L."User_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ScoutLeader not found' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addScoutleader = async (req, res) => {
  const { User_ID, isAdmin, startDate } = req.body;
  console.log(User_ID, isAdmin, startDate);
  try {
    const query = `INSERT INTO "ScoutLeader" ("User_ID","isAdmin","startDate") VALUES ($1,$2,$3) RETURNING *`;
    const params = [User_ID, isAdmin, startDate];
    const result = await db.query(query, params);
    const query2 = `Update "User" Set "role" ='Scoutleader' Where "User_ID" = $1`;
    const params2 = [User_ID];
    await db.query(query2, params2);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateScoutleader = async (req, res) => {
  const { isAdmin, startDate } = req.body;
  const { id } = req.params;
  console.log(isAdmin, startDate);
  try {
    const query = `UPDATE "ScoutLeader" SET "isAdmin" = $2, "startDate" = $3 WHERE "User_ID" = $1 RETURNING *`;
    const params = [id, isAdmin, startDate];
    const result = await db.query(query, params);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteScoutleader = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE FROM "ScoutLeader" WHERE "User_ID" = $1 RETURNING *`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ScoutLeader not found' });
    }
    const query2 = `Update "User" Set "role" =NULL Where "User_ID" = $1`;
    const params2 = [result.rows[0].User_ID];
    await db.query(query2, params2);
    return res
      .status(200)
      .json({ message: 'ScoutLeader deleted successfully' });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
