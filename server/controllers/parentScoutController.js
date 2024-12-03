const db = require("../config/DBmanager");

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

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "no scouts found" });
        }

        return res.json(result.rows);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.addScout = async (req, res) => {
    const { id } = req.params;
    const { scout_id, relationship } = req.body;
    try {
        const query = `INSERT INTO "ParentScout" ("Parent_ID", "Scout_ID", "Relationship") VALUES ($1, $2, $3) RETURNING *`;
        const params = [id, scout_id, relationship];
        const result = await db.query(query, params);
        return res.status(201).json({ message: "Added Scout successfully", achievement: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};