const validate = require("validator");
const db = require("../config/DBmanager");

const validateRegister = async (req, res, next) => {
  const { email, Fname, Lname, password, Phonenum } = req.body;
  console.log(req.body);
  if (!email || !Fname || !Lname || !password || !Phonenum) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const query = `SELECT * FROM "User" WHERE "email" = $1`;
    const params = [email.toLowerCase()];
    const result = await db.query(query, params);
    if (result.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  if (!validate.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (!validate.isAlpha(Fname) || !validate.isAlpha(Lname)) {
    return res
      .status(400)
      .json({ message: "First name and last name must be alphabets" });
  }
  if (!validate.isMobilePhone(Phonenum)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }
  if (!validate.isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    });
  }
  next();
};
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validate.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  next();
};

const validateUpdatePassword = (req, res, next) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validate.isEmail(email)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  if (!validate.isStrongPassword(newPassword)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    });
  }
  next();
};

const validateAchievement = (req, res, next) => {
  const { name, level } = req.body;
  if (!name && level && level <= 0) {
    return res.status(400).json({
      message: "achievement name is required, level must be greater than 0",
    });
  }
  if (!name) {
    return res.status(400).json({ message: "achievement name is required" });
  }
  if (level && level <= 0) {
    return res.status(400).json({ message: "level must be greater than 0" });
  }
  next();
};

const validateLocation = (req, res, next) => {
  const { name, link } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Location name is required" });
  }
  if (link && !validate.isURL(link)) {
    return res.status(400).json({ message: "Invalid location link" });
  }
  next();
};

const validateAnnouncement = async (req, res, next) => {
  const { content, date, priority, visibility, leader_id } = req.body;
  if (!content || !date || !priority || !visibility || !leader_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (leader_id) {
    if (!validate.isInt(leader_id)) {
      return res.status(400).json({ message: "Invalid leader id" });
    }
    try {
      const query = `SELECT * FROM "ScoutLeader" WHERE "User_ID" = $1`;
      const params = [leader_id];
      const result = await db.query(query, params);
      if (result.rows.length === 0) {
        return res
          .status(409)
          .json({ message: "no leader with that id was found" });
      }
    } catch (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  const allowedPriorities = ["Low", "Medium", "High"];
  if (!allowedPriorities.includes(priority)) {
    return res
      .status(400)
      .json({ message: `Priority must be one of "Low", "Medium", or "High"` });
  }
  next();
};

const validateEquipment = async (req, res, next) => {
  const { name, quantity, date, location_id } = req.body;
  if (!name || !date || !location_id) {
    return res
      .status(400)
      .json({ message: "name, date, location_id are required" });
  }
  if (quantity) {
    if (!validate.isInt(quantity)) {
      return res.status(400).json({ message: "Quantity must be a number" });
    }
    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity can't be negative" });
    }
  }

  if (location_id) {
    if (!validate.isInt(location_id)) {
      return res.status(400).json({ message: "Invalid location id" });
    }
    try {
      const query = `SELECT * FROM "Location" WHERE "Location_ID" = $1`;
      const params = [location_id];
      const result = await db.query(query, params);
      if (result.rows.length === 0) {
        return res
          .status(409)
          .json({ message: "no location with that id was found" });
      }
    } catch (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  next();
};

const validateMedia = async (req, res, next) => {
  const { link, date, type, event_id, leader_id } = req.body;
  if (!link || !date || !type || !event_id || !leader_id) {
    return res
      .status(400)
      .json({ message: "link, date, type, event_id, leader_id are required" });
  }
  if (link && !validate.isURL(link)) {
    return res.status(400).json({ message: "Invalid location" });
  }
  const allowedTypes = ["Image", "Video", "Document"];
  if (!allowedTypes.includes(type)) {
    return res
      .status(400)
      .json({ message: `Type must be one of "Image", "Video", or "Document"` });
  }

  if (event_id) {
    if (!validate.isInt(event_id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }
    try {
      const query = `SELECT * FROM "Event" WHERE "Event_ID" = $1`;
      const params = [event_id];
      const result = await db.query(query, params);
      if (result.rows.length === 0) {
        return res
          .status(409)
          .json({ message: "no event with that id was found" });
      }
    } catch (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (leader_id) {
    if (!validate.isInt(leader_id)) {
      return res.status(400).json({ message: "Invalid leader id" });
    }
    try {
      const query = `SELECT * FROM "ScoutLeader" WHERE "User_ID" = $1`;
      const params = [leader_id];
      const result = await db.query(query, params);
      if (result.rows.length === 0) {
        return res
          .status(409)
          .json({ message: "no leader with that id was found" });
      }
    } catch (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  next();
};

const validateSponsor = async (req, res, next) => {
  const { fName, lName, email } = req.body;
  if (!fName || !lName) {
    return res
      .status(400)
      .json({ message: "First and last names are required" });
  }

  if (email) {
    if (!validate.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }
    try {
      const query = `SELECT * FROM "Sponsor" WHERE "Email" = $1`;
      const params = [email];
      const result = await db.query(query, params);
      if (result.rows.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }
    } catch (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  next();
};

const validateSponsorUpdate = async (req, res, next) => {
  const { fName, lName, email } = req.body;
  const { sponsor_id } = req.params;
  if (!fName || !lName) {
    return res
      .status(400)
      .json({ message: "First and last names are required" });
  }

  if (email) {
    if (!validate.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }
    try {
      const query = `SELECT * FROM "Sponsor" WHERE "Email" = $1 AND "Sponsor_ID" != $2`;
      const params = [email, sponsor_id];
      const result = await db.query(query, params);
      if (result.rows.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }
    } catch (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  next();
};

const validateTransaction = async (req, res, next) => {
  const { date, amount, method, sponsor_id, leader_id } = req.body;
  if (!date || !amount || !method) {
    return res
      .status(400)
      .json({ message: "date, amount, transaction method are required" });
  }
  if (!(sponsor_id || leader_id)) {
    return res.status(400).json({ message: "sponsor/leader ID required" });
  }

  if (amount && !validate.isFloat(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const allowedMethods = ["Cash", "Visa"];
  if (!allowedMethods.includes(method)) {
    return res
      .status(400)
      .json({ message: `method must be one of "Cash", "Visa"` });
  }

  if (leader_id) {
    if (!validate.isInt(leader_id)) {
      return res.status(400).json({ message: "Invalid leader id" });
    }
    try {
      const query = `SELECT * FROM "ScoutLeader" WHERE "User_ID" = $1`;
      const params = [leader_id];
      const result = await db.query(query, params);
      if (result.rows.length === 0) {
        return res
          .status(409)
          .json({ message: "no leader with that id was found" });
      }
    } catch (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (sponsor_id) {
    if (!validate.isInt(sponsor_id)) {
      return res.status(400).json({ message: "Invalid leader id" });
    }
    try {
      const query = `SELECT * FROM "Sponsor" WHERE "Sponsor_ID" = $1`;
      const params = [sponsor_id];
      const result = await db.query(query, params);
      if (result.rows.length === 0) {
        return res
          .status(409)
          .json({ message: "no Sponsor with that id was found" });
      }
    } catch (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  next();
};

const validateTransactionStatus = async (req, res, next) => {
  const { status } = req.body;

  const allowedStatus = ["Completed", "Failed"];
  if (!allowedStatus.includes(status)) {
    return res
      .status(400)
      .json({ message: `status must be one of "Completed", "Failed"` });
  }
  next();
};

const validateScoutAchievement = async (req, res, next) => {
  const { id } = req.params;
  const { achievement_id } = req.body;

  if (!id || !achievement_id) {
    return res
      .status(400)
      .json({ message: "scout and achievement ids are required" });
  }

  if (!validate.isInt(id)) {
    return res.status(400).json({ message: "Invalid scout id" });
  }
  if (!validate.isInt(achievement_id)) {
    return res.status(400).json({ message: "Invalid achievement id" });
  }

  try {
    const query = `SELECT * FROM "Scout" WHERE "User_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res
        .status(409)
        .json({ message: "no scout with that id was found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const query = `SELECT * FROM "Achievement" WHERE "Achievement_ID" = $1`;
    const params = [achievement_id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res
        .status(409)
        .json({ message: "no achievement with that id was found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  next();
};

const validateScoutID = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "scout id is required" });
  }

  if (!validate.isInt(id)) {
    return res.status(400).json({ message: "Invalid scout id" });
  }

  try {
    const query = `SELECT * FROM "Scout" WHERE "User_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res
        .status(409)
        .json({ message: "no scout with that id was found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  next();
};

const ValidateAddUser = async (req, res, next) => {
  const { email, password, Fname, Lname, role, Phonenum } = req.body;
  if (!email || !password || !Fname || !Lname || !Phonenum) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validate.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  try {
    const query = `SELECT * FROM "User" WHERE "email" = $1`;
    const params = [email.toLowerCase()];
    const result = await db.query(query, params);
    if (result.rows.length > 0)
      return res.status(400).json({ message: "User Already Exists" });
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  if (!validate.isAlpha(Fname) || !validate.isAlpha(Lname)) {
    return res
      .status(400)
      .json({ message: "First name and last name must be alphabets" });
  }
  if (!validate.isMobilePhone(Phonenum)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }
  if (!validate.isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    });
  }
  next();
};

const validateParentScout = async (req, res, next) => {
  const { id } = req.params;
  const { scout_id, relationship } = req.body;

  if (!id || !scout_id) {
    return res
      .status(400)
      .json({ message: "scout and parent ids are required" });
  }

  if (!validate.isInt(id)) {
    return res.status(400).json({ message: "Invalid parent id" });
  }
  if (!validate.isInt(scout_id)) {
    return res.status(400).json({ message: "Invalid scout id" });
  }
  const allowedRelationship = ["Father", "Mother"];
  if (!allowedRelationship.includes(relationship)) {
    return res
      .status(400)
      .json({ message: `relationship must be one of "Father", "Mother"` });
  }

  try {
    const query = `SELECT * FROM "Parent" WHERE "User_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res
        .status(409)
        .json({ message: "no parent with that id was found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const query = `SELECT * FROM "Scout" WHERE "User_ID" = $1`;
    const params = [scout_id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res
        .status(409)
        .json({ message: "no scout with that id was found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  next();
};

const validateParentID = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "parent id is required" });
  }

  if (!validate.isInt(id)) {
    return res.status(400).json({ message: "Invalid parent id" });
  }

  try {
    const query = `SELECT * FROM "Parent" WHERE "User_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res
        .status(409)
        .json({ message: "no parent with that id was found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  next();
};

const validateAddScout = async (req, res, next) => {
  const { User_ID, rank, PaperSubmitted, Birthdate, academicYear, joinDate } =
    req.body;
  if (
    !User_ID ||
    !rank ||
    !PaperSubmitted ||
    !Birthdate ||
    !academicYear ||
    !joinDate
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validate.isInt(User_ID)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  try {
    const query = `SELECT * FROM "User" WHERE "User_ID" = $1`;
    const params = [User_ID];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  try {
    const query = `SELECT * FROM "Scout" WHERE "User_ID" = $1`;
    const params = [User_ID];
    const result = await db.query(query, params);
    if (result.rows.length > 0) {
      return res.status(409).json({ message: "Scout already exists" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  if (!validate.isBoolean(PaperSubmitted)) {
    return res.status(400).json({ message: "Invalid PaperSubmitted" });
  }
  if (!validate.isDate(Birthdate)) {
    return res.status(400).json({ message: "Invalid Birthdate" });
  }
  if (!validate.isDate(joinDate)) {
    return res.status(400).json({ message: "Invalid joinDate" });
  }
  next();
};

const validateAddTroop = async (req, res, next) => {
  const { Troop_ID, Tname, type, max_Members, ScoutLeader_ID } = req.body;
  if (!Troop_ID || !Tname || !type || !max_Members || !ScoutLeader_ID) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validate.isInt(Troop_ID)) {
    return res.status(400).json({ message: "Invalid Troop ID" });
  }
  if (!validate.isAlpha(Tname)) {
    return res.status(400).json({ message: "Invalid Troop Name" });
  }
  if (!validate.isAlpha(type)) {
    return res.status(400).json({ message: "Invalid Troop Type" });
  }
  if (!validate.isInt(max_Members)) {
    return res.status(400).json({ message: "Invalid Max Members" });
  }
  if (!validate.isInt(ScoutLeader_ID)) {
    return res.status(400).json({ message: "Invalid Scout Leader ID" });
  }
  try {
    const query = `SELECT * FROM "ScoutLeader" WHERE "User_ID" = $1`;
    const params = [ScoutLeader_ID];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "Scout Leader not found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  next();
};

const validateUpdateTroop = async (req, res, next) => {
  const { Tname, type, max_Members, ScoutLeader_ID } = req.body;
  if (!Tname && !type && !max_Members && !ScoutLeader_ID) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (ScoutLeader_ID) {
    if (!validate.isInt(ScoutLeader_ID)) {
      return res.status(400).json({ message: "Invalid Scout Leader ID" });
    }
    try {
      const query = `SELECT * FROM "ScoutLeader" WHERE "User_ID" = $1`;
      const params = [ScoutLeader_ID];
      const result = await db.query(query, params);
      if (result.rows.length === 0) {
        return res.status(409).json({ message: "Scout Leader not found" });
      }
    } catch (error) {
      console.log("Error executing query", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  next();
};

const validateAddScouttoTroop = async (req, res, next) => {
  const { Scout_ID, participationDate } = req.body;
  const { id } = req.params;
  if (!Scout_ID || !participationDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validate.isInt(Scout_ID)) {
    return res.status(400).json({ message: "Invalid Scout ID" });
  }
  try {
    const query = `SELECT * FROM "Troop" WHERE "Troop_ID" = $1`;
    const params = [id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "Troop not found" });
    }
  } catch (err) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  try {
    const query = `SELECT * FROM "Scout" WHERE "User_ID" = $1`;
    const params = [Scout_ID];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "Scout not found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  if (!validate.isDate(participationDate)) {
    return res.status(400).json({ message: "Invalid Participation Date" });
  }
  next();
};

const validateAddScoutleader = async (req, res, next) => {
  const { User_ID, isAdmin, startDate } = req.body;
  if (!User_ID || !isAdmin || !startDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validate.isInt(User_ID)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  try {
    const query = `SELECT * FROM "User" WHERE "User_ID" = $1`;
    const params = [User_ID];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  if (!validate.isBoolean(isAdmin)) {
    return res.status(400).json({ message: "Invalid isAdmin" });
  }
  if (!validate.isDate(startDate)) {
    return res.status(400).json({ message: "Invalid Start Date" });
  }
  next();
};

const validateAddEvent = async (req, res, next) => {
  const { Budget, Ename, Edate, Location_ID, ScoutLeader_ID } = req.body;
  console.log(Budget, Ename, Edate, Location_ID, ScoutLeader_ID);
  if (!Budget || !Ename || !Edate || !Location_ID || !ScoutLeader_ID) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validate.isInt(Budget)) {
    return res.status(400).json({ message: "Invalid Budget" });
  }
  if (!validate.isDate(Edate)) {
    return res.status(400).json({ message: "Invalid Event Date" });
  }
  if (!validate.isInt(Location_ID)) {
    return res.status(400).json({ message: "Invalid Location ID" });
  }
  if (!validate.isInt(ScoutLeader_ID)) {
    return res.status(400).json({ message: "Invalid Scout Leader ID" });
  }
  try {
    const query = `SELECT * FROM "Location" WHERE "Location_ID" = $1`;
    const params = [Location_ID];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "Location not found" });
    }
  } catch (err) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  try {
    const query = `SELECT * FROM "ScoutLeader" WHERE "User_ID" = $1`;
    const params = [ScoutLeader_ID];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "Scout Leader not found" });
    }
  } catch (err) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  next();
};

const validateAddEventAttendace = async (req, res, next) => {
  const { event_id } = req.params;
  const { Scout_ID } = req.body;
  if (!Scout_ID) {
    return res.status(400).json({ message: "Scout ID is required" });
  }
  if (!validate.isInt(Scout_ID)) {
    return res.status(400).json({ message: "Invalid Scout ID" });
  }
  try {
    const query = `SELECT * FROM "Scout" WHERE "User_ID" = $1`;
    const params = [Scout_ID];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "Scout not found" });
    }
  } catch (err) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  try {
    const query = `SELECT * FROM "Event" WHERE "Event_ID" = $1`;
    const params = [event_id];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "Event not found" });
    }
  } catch (err) {
    console.log("Error executing query", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateAchievement,
  validateLocation,
  validateAnnouncement,
  validateEquipment,
  validateSponsor,
  validateSponsorUpdate,
  validateMedia,
  validateTransaction,
  validateTransactionStatus,
  validateUpdatePassword,
  validateScoutAchievement,
  validateScoutID,
  ValidateAddUser,
  validateParentScout,
  validateParentID,
  validateAddScout,
  validateAddTroop,
  validateUpdateTroop,
  validateAddScouttoTroop,
  validateAddScoutleader,
  validateAddEvent,
  validateAddEventAttendace,
};
