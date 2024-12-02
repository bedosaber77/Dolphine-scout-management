const db = require("../config/DBmanager");

module.exports.getScoutAchievements = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT A.*
            FROM "Achievement" A
            INNER JOIN "AchievementTaken" T
            ON A."Achievement_ID" = T."Achievement_ID"
            WHERE T."Scout_ID" = $1
        `;
        const params = [id];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "no achievements found" });
        }

        return res.json(result.rows);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.addScoutAchievement = async (req, res) => {
    const { id } = req.params;
    const { achievement_id, date } = req.body;
    try {
        const query = `INSERT INTO "AchievementTaken" ("Scout_ID", "Achievement_ID", "DateAwarded") VALUES ($1, $2, $3) RETURNING *`;
        const params = [id, achievement_id, date];
        const result = await db.query(query, params);
        return res.status(201).json({ message: "Added Achievement successfully", achievement: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.deleteScoutAchievement = async (req, res) => {
    const { id, achievement_id } = req.params;
    try {
        const query = `DELETE FROM "AchievementTaken" WHERE "Scout_ID" = $1 AND "Achievement_ID" = $2`;
        const params = [id, achievement_id];
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
