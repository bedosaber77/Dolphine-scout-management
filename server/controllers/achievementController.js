const db = require("../config/DBmanager");

module.exports.getAchievements = async (req, res) => {
    try {
        const query = `SELECT * FROM "Achievement"`;
        const params = [];
        const result = await db.query(query, params);
        return res.json(result.rows);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getAchievement = async (req, res) => {
    const { achievement_id } = req.params;
    try {
        const query = `SELECT * FROM "Achievement" WHERE "Achievement_ID" = $1`;
        const params = [achievement_id];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Achievement not found" });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.addAchievement = async (req, res) => {
    const { name, level, criteria, description } = req.body;
    try {
        const query = `INSERT INTO "Achievement" ("Aname", "Level", "Criteria", "Description") VALUES ($1, $2, $3, $4) RETURNING *`; // return inserted achievement
        const params = [name, level, criteria, description];
        const result = await db.query(query, params);
        return res.status(201).json({ message: "Added Achievement successfully", achievement: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateAchievement = async (req, res) => {
    const { achievement_id } = req.params;
    const { name, level, criteria, description } = req.body;
    try {
        const query = `UPDATE "Achievement" SET "Aname" = $1, "Level" = $2, "Criteria" = $3, "Description" = $4 WHERE "Achievement_ID" = $5 RETURNING *`;
        const params = [name, level, criteria, description, achievement_id];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Achievement not found" });
        }
        return res.json({ message: "Achievement updated successfully", achievement: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.deleteAchievement = async (req, res) => {
    const { achievement_id } = req.params;
    try {
        const query = `DELETE FROM "Achievement" WHERE "Achievement_ID" = $1`;
        const params = [achievement_id];
        const result = await db.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Achievement not found" });
        }
        return res.status(200).json({ message: "Deleted Achievement successfully" });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
