const db = require('../config/DBmanager');
const { cloudinary } = require('../utils/cloudinary');

module.exports.getAllMedia = async (req, res) => {
  try {
    const query = `SELECT * FROM "Media"`;
    const params = [];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'no media found' });
    }

    return res.json(result.rows);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getMedia = async (req, res) => {
  const { media_id } = req.params;
  try {
    const query = `SELECT * FROM "Media" WHERE "Media_ID" = $1`;
    const params = [media_id];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.addMedia = async (req, res) => {
  const { date, link, description, type, event_id, leader_id } = req.body;
  try {
    const query = `INSERT INTO "Media" ("UploadDate", "Link", "Description", "Type", "Event_ID", "ScoutLeader_ID") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`; // return inserted Media
    const params = [date, link, description, type, event_id, leader_id];
    const result = await db.query(query, params);
    return res
      .status(201)
      .json({ message: 'Added Media successfully', Media: result[0] });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.updateMedia = async (req, res) => {
  const { media_id } = req.params;
  const { date, link, description, type, event_id, leader_id } = req.body;
  try {
    const query = `UPDATE "Media" SET "UploadDate" = $1, "Link" = $2, "Description" = $3, "Type" = $4, "Event_ID" = $5, "ScoutLeader_ID" = $6 WHERE "Media_ID" = $7 RETURNING *`;
    const params = [
      date,
      link,
      description,
      type,
      event_id,
      leader_id,
      media_id,
    ];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }
    return res.json({
      message: 'Media updated successfully',
      Media: result[0],
    });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.deleteMedia = async (req, res) => {
  const { media_id } = req.params;
  try {
    const query1 = `SELECT "Description" FROM "Media" WHERE "Media_ID" = $1`;
    const query = `DELETE FROM "Media" WHERE "Media_ID" = $1`;
    const params = [media_id];

    const result1 = await db.query(query1, params);
    if (!result1.rows.length) {
      return res.status(404).json({ message: 'Media not found' });
    }
    const description = result1.rows[0].Description;
    console.log('Description:', description);

    await cloudinary.uploader.destroy(description);

    const result = await db.query(query, params);
    return res.status(200).json({ message: 'Deleted Media successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
