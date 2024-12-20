const bcrypt = require('bcrypt');
const db = require('../config/DBmanager');
const jwtGenerator = require('../utils/jwtGenerator');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, Fname, Lname, password, PhoneNum } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO "User" ("email", "Fname", "Lname", "password", "Phonenum") VALUES ($1, $2, $3, $4, $5) 
    returning *`;
    const params = [
      email.toLowerCase(),
      Fname,
      Lname,
      hashedPassword,
      PhoneNum,
    ];
    const result = await db.query(query, params);
    return res.status(201).json({
      message: 'User registered successfully',
      // needed to revisit this
    });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = `SELECT * FROM "User" WHERE "email" = $1`;
    const params = [email];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    let user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let query2 = '';
    if (user.role === 'Scout')
      query2 = `SELECT * FROM "Scout" WHERE "User_ID" = $1`;
    else if (user.role === 'Parent')
      query2 = `SELECT * FROM "Parent" WHERE "User_ID" = $1`;
    else if (user.role === 'Scoutleader')
      query2 = `SELECT * FROM "ScoutLeader" WHERE "User_ID" = $1`;
    const params2 = [user.User_ID];
    const result2 = await db.query(query2, params2);

    const user2 = result2.rows[0];

    user = { ...user, isAdmin: user2.isAdmin };

    console.log(user);

    const accessToken = jwtGenerator(user, '30 min');
    const refreshToken = jwtGenerator(user, '7d');
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'None',
    });
    return res.status(200).json({
      message: 'User logged in successfully',
      user: {
        User_ID: user.User_ID,
        email: user.email,
        Fname: user.Fname,
        Lname: user.Lname,
        role: user.role,
        isAdmin: user2.isAdmin,
      },
      accessToken,
    });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const query = `SELECT * FROM "User" WHERE "email" = $1`;
    const params = [email.toLowerCase()];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old Password is Invaild' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query2 = `UPDATE "User" SET "password" = $1 WHERE "email" = $2`;
    const params2 = [hashedPassword, email.toLowerCase()];
    await db.query(query2, params2);
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized - Token not found' });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log('decoded', decoded.user);
    const accessToken = jwtGenerator(decoded.user, '30 min');
    return res.status(200).json({ accessToken, user: decoded.user });
  } catch (error) {
    console.error('Error verifying token', error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'An error occurred during logout' });
  }
};
