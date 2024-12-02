const db = require("../config/DBmanager");

module.exports.getSponsors = async (req, res) => {
    try {
        const query = `SELECT * FROM "Sponsor"`;
        const params = [];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "no sponsors found" });
        }

        return res.json(result.rows);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getSponsor = async (req, res) => {
    const { sponsor_id } = req.params;
    try {
        const query = `SELECT * FROM "Sponsor" WHERE "Sponsor_ID" = $1`;
        const params = [sponsor_id];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Sponsor not found" });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.addSponsor = async (req, res) => {
    const { fName, lName, phoneNum, email } = req.body;
    try {
        const query = `INSERT INTO "Sponsor" ("Fname", "Lname", "PhoneNum", "Email") VALUES ($1, $2, $3, $4) RETURNING *`; // return inserted Sponsor
        const params = [fName, lName, phoneNum, email];
        const result = await db.query(query, params);
        return res.status(201).json({ message: "Added Sponsor successfully", Sponsor: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateSponsor = async (req, res) => {
    const { sponsor_id } = req.params;
    const { fName, lName, phoneNum, email } = req.body;
    try {
        const query = `UPDATE "Sponsor" SET "Fname" = $1, "Lname" = $2, "PhoneNum" = $3, "Email" = $4 WHERE "Sponsor_ID" = $5 RETURNING *`;
        const params = [fName, lName, phoneNum, email, sponsor_id];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Sponsor not found" });
        }
        return res.json({ message: "Sponsor updated successfully", Sponsor: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.deleteSponsor = async (req, res) => {
    const { sponsor_id } = req.params;
    try {
        const query = `DELETE FROM "Sponsor" WHERE "Sponsor_ID" = $1`;
        const params = [sponsor_id];
        const result = await db.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Sponsor not found" });
        }
        return res.status(200).json({ message: "Deleted Sponsor successfully" });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
