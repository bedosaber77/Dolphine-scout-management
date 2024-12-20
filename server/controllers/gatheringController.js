const db = require('../config/DBmanager');

exports.getAllGatherings = async (req, res) => {
  try {
    const query = `SELECT E.* , G.*
     FROM "Gathering" G 
     INNER JOIN "Event" E
     ON E."Event_ID" = G."Event_ID"`;
    const gatherings = await db.query(query);
    res.json(gatherings.rows);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getGathering = async (req, res) => {
  const { gathering_id } = req.params;
  try {
    const query = `SELECT * FROM "Gathering" WHERE "Event_ID" = $1`;
    const params = [gathering_id];
    const gathering = await db.query(query, params);
    if (gathering.rowCount === 0) {
      return res.status(404).json({ message: 'No gatherings found' });
    }
    return res.json(gathering.rows[0]);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
exports.addGathering = async (req, res) => {
  const {
    Event_ID,
    GeneralOutcome,
    EducationalOutcome,
    PhysicalOutcome,
    ScientificOutcome,
    ArtOutcome,
    ExtraOutcome,
  } = req.body;
  try {
    const query = `INSERT INTO "Gathering" ("Event_ID", "GeneralOutcome", "EducationalOutcome", "PhysicalOutcome", "ScientificOutcome", "ArtOutcome", "ExtraOutcome") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const params = [
      Event_ID,
      GeneralOutcome,
      EducationalOutcome,
      PhysicalOutcome,
      ScientificOutcome,
      ArtOutcome,
      ExtraOutcome,
    ];
    const result = await db.query(query, params);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateGathering = async (req, res) => {
  const { gathering_id } = req.params;
  const {
    GeneralOutcome,
    EducationalOutcome,
    PhysicalOutcome,
    ScientificOutcome,
    ArtOutcome,
    ExtraOutcome,
  } = req.body;
  try {
    const query = `UPDATE "Gathering" SET "GeneralOutcome" = $1, "EducationalOutcome" = $2, "PhysicalOutcome" = $3, "ScientificOutcome" = $4, "ArtOutcome" = $5, "ExtraOutcome" = $6 WHERE "Event_ID" = $7 RETURNING *`;
    const params = [
      GeneralOutcome,
      EducationalOutcome,
      PhysicalOutcome,
      ScientificOutcome,
      ArtOutcome,
      ExtraOutcome,
      gathering_id,
    ];
    const result = await db.query(query, params);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteGathering = async (req, res) => {
  const { gathering_id } = req.params;
  try {
    const query = `DELETE FROM "Gathering" WHERE "Event_ID" = $1`;
    const params = [gathering_id];
    await db.query(query, params);
    return res.status(204).json();
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
