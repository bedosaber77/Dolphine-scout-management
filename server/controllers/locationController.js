const db = require("../config/DBmanager");

module.exports.getLocations = async (req, res) => {
    try {
        const query = `SELECT * FROM "Location"`;
        const params = [];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "no locations found" });
        }

        return res.json(result.rows);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getLocation = async (req, res) => {
    const { location_id } = req.params;
    try {
        const query = `SELECT * FROM "Location" WHERE "Location_ID" = $1`;
        const params = [location_id];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Location not found" });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.addLocation = async (req, res) => {
    const { name, government, city, link } = req.body;
    try {
        const query = `INSERT INTO "Location" ("LocationName", "Government", "City", "Link") VALUES ($1, $2, $3, $4) RETURNING *`; // return inserted Location
        const params = [name, government, city, link];
        const result = await db.query(query, params);
        return res.status(201).json({ message: "Added Location successfully", Location: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateLocation = async (req, res) => {
    const { location_id } = req.params;
    const { name, government, city, link } = req.body;
    try {
        const query = `UPDATE "Location" SET "LocationName" = $1, "Government" = $2, "City" = $3, "Link" = $4 WHERE "Location_ID" = $5 RETURNING *`;
        const params = [name, government, city, link, location_id];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Location not found" });
        }
        return res.json({ message: "Location updated successfully", Location: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.deleteLocation = async (req, res) => {
    const { location_id } = req.params;
    try {
        const query = `DELETE FROM "Location" WHERE "Location_ID" = $1`;
        const params = [location_id];
        const result = await db.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Location not found" });
        }
        return res.status(200).json({ message: "Deleted Location successfully" });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
