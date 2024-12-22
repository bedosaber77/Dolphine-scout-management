const db = require('../config/DBmanager');

exports.getAllParents = async (req, res) => {
  try {
    const query = `SELECT U.*, P.*
                    FROM "User" U
                    INNER JOIN "Parent" P
                    ON U."User_ID" = P."User_ID"`;

    const params = [];
    const result = await db.query(query, params);

    // if (result.rows.length === 0) {
    //   return res.status(404).json({ message: 'no parents found' });
    // }

    return res.json(result.rows);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addParent = async (req, res) => {
  const { User_ID, gender } = req.body;
  console.log(User_ID, gender);
  try {
    const query = `INSERT INTO "Parent" ("User_ID","gender") VALUES ($1,$2) RETURNING *`; // return inserted User
    const params = [User_ID, gender];
    const result = await db.query(query, params);
    return res
      .status(201)
      .json({ message: 'Added Parent successfully', Parent: result.rows[0] });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getParentById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT U.*, P.*
                    FROM "User" U
                    INNER JOIN "Parent" P
                    ON U."User_ID" = P."User_ID"
                    WHERE P."User_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteParent = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `DELETE FROM "Parent" WHERE "User_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    return res.json({ message: 'Parent deleted successfully' });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getScouts = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
          SELECT U.*, S.*
          FROM "User" U
          INNER JOIN "Scout" S
          ON U."User_ID" = S."User_ID"
          INNER JOIN "ParentScout" P
          ON S."User_ID" = P."Scout_ID"
          WHERE P."Parent_ID" = $1
          `;
    const params = [id];
    const result = await db.query(query, params);

    // if (result.rows.length === 0) {
    //   return res.status(404).json({ message: 'no scouts found' });
    // }

    return res.json(result.rows);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.addScout = async (req, res) => {
  const { id } = req.params;
  const { scout_id } = req.body;
  try {
    const query = `INSERT INTO "ParentScout" ("Parent_ID", "Scout_ID" ) VALUES ($1, $2) RETURNING *`;
    const params = [id, scout_id];
    const result = await db.query(query, params);
    return res
      .status(201)
      .json({ message: 'Added Scout successfully', achievement: result[0] });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.deleteChild = async (req, res) => {
  const { id, scoutID } = req.params;
  try {
    const query = `DELETE FROM "ParentScout" WHERE "Parent_ID" = $1 AND "Scout_ID" = $2 RETURNING *`;
    const params = [id, scoutID];
    const result = await db.query(query, params);
    return res
      .status(201)
      .json({ message: 'Deleted Scout successfully', achievement: result[0] });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateParent = async (req, res) => {
  const { id } = req.params;
  const { gender } = req.body;
  try {
    const query = `UPDATE "Parent"  SET "gender" = $1 WHERE "User_ID" = $2 RETURNING *`;
    const params = [gender, id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    return res.json({
      message: 'Parent updated successfully',
      Parent: result.rows[0],
    });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
