const express = require("express");
const router = express.Router();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dbPath = path.resolve(__dirname, "../db/db.sqlite");

// Function to create users table
const createUsersTable = async () => {
	const db = await open({
		filename: dbPath,
		driver: sqlite3.Database,
	});

	await db.exec(
		`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      stravaKey TEXT,
      mapKey TEXT,
      calendarKey TEXT,
      token TEXT,
      stravaClientId TEXT,
      stravaClientSecret TEXT,
      refreshReadToken TEXT,
      refreshWriteToken TEXT
    )`
	);
};

router.post("/register", async (req, res) => {
	const {
		name,
		email,
		password,
		stravaKey,
		mapKey,
		calendarKey,
		userName,
		stravaClientId,
		stravaClientSecret,
		refreshReadToken,
		refreshWriteToken,
	} = req.body;

	try {
		const db = await open({
			filename: dbPath,
			driver: sqlite3.Database,
		});

		await createUsersTable();

		const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [
			email,
		]);

		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await db.run(
			"INSERT INTO users (username, name, email, password, stravaKey, mapKey, calendarKey, stravaClientId, stravaClientSecret, refreshReadToken, refreshWriteToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			[
				userName,
				name,
				email,
				hashedPassword,
				stravaKey,
				mapKey,
				calendarKey,
				stravaClientId,
				stravaClientSecret,
				refreshReadToken,
				refreshWriteToken,
			]
		);

		const token = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		// Assign the generated token to the saved user
		await db.run("UPDATE users SET token = ? WHERE email = ?", [token, email]);

		res.json({
			message: "User registered successfully",
			token: token,
			user: {
				name,
				email,
				stravaKey,
				mapKey,
				calendarKey,
				username,
				stravaClientId,
				stravaClientSecret,
				refreshReadToken,
				refreshWriteToken,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const db = await open({
			filename: dbPath,
			driver: sqlite3.Database,
		});

		await createUsersTable();

		const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

		if (!user) {
			return res.status(400).json({ message: "User does not exist" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		// Assign the generated token to the saved user
		await db.run("UPDATE users SET token = ? WHERE email = ?", [token, email]);

		res.json({
			message: "User logged in successfully",
			token: token,
			user: {
				name: user.name,
				email: user.email,
				username: user.username,
				stravaClientId: user.stravaClientId,
				stravaClientSecret: user.stravaClientSecret,
				refreshReadToken: user.refreshReadToken,
				refreshWriteToken: user.refreshWriteToken,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
});

module.exports = router;
