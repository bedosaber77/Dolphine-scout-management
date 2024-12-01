const db = require("../config/DBmanager");

module.exports.getTransactions = async (req, res) => {
    try {
        const query = `SELECT * FROM "Transaction"`;
        const params = [];
        const result = await db.query(query, params);
        return res.json(result.rows);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getTransaction = async (req, res) => {
    const { transaction_id } = req.params;
    try {
        const query = `SELECT * FROM "Transaction" WHERE "Transaction_ID" = $1`;
        const params = [transaction_id];
        const result = await db.query(query, params);

        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.addTransaction = async (req, res) => {
    const { amount, date, purpose, method, sponsor_id, leader_id } = req.body;
    const status = "Pending";
    let type;
    if (sponsor_id)
        type = "Deposit";
    else
        type = "Withdraw";

    try {
        const query = `INSERT INTO "Transaction" ("Amount", "Tdate", "Purpose", "TransactionType", "PaymentMethod", "Status", "Sponsor_ID", "ScoutLeader_ID") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`; // return inserted Transaction
        const params = [amount, date, purpose, type, method, status, sponsor_id, leader_id];
        const result = await db.query(query, params);
        return res.status(201).json({ message: "Added Transaction successfully", Transaction: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateTransaction = async (req, res) => {
    const { transaction_id } = req.params;
    const { amount, date, purpose, type, method, status, sponsor_id, leader_id } = req.body;
    try {
        const query = `UPDATE "Transaction" SET "Amount" = $1, "Tdate" = $2, "Purpose" = $3, "TransactionType" = $4, "PaymentMethod" = $5, "Status" = $6, "Sponsor_ID" = $7, "ScoutLeader_ID" = $8 WHERE "Transaction_ID" = $9 RETURNING *`;
        const params = [amount, date, purpose, type, method, status, sponsor_id, leader_id, transaction_id];
        const result = await db.query(query, params);

        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        return res.json({ message: "Transaction updated successfully", Transaction: result[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateTransactionStatus = async (req, res) => {
    const { transaction_id } = req.params;
    const { status } = req.body;

    try {
        const query = `UPDATE "Transaction" SET "Status" = $1 WHERE "Transaction_ID" = $2 RETURNING *`;
        const params = [status, transaction_id];
        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        return res.json({ message: "Transaction status updated successfully", Transaction: result.rows[0] });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports.deleteTransaction = async (req, res) => {
    const { transaction_id } = req.params;
    try {
        const query = `DELETE FROM "Transaction" WHERE "Transaction_ID" = $1`;
        const params = [transaction_id];
        const result = await db.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        return res.status(200).json({ message: "Deleted Transaction successfully" });
    } catch (error) {
        console.log("Error executing query", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
