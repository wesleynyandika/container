require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { open } = require("sqlite");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, "db", "db.sqlite");

// Create the database file and tables if they don't exist
const initDB = async () => {
	try {
		if (!fs.existsSync(path.resolve(__dirname, "db"))) {
			fs.mkdirSync(path.resolve(__dirname, "db"));
		}

		if (!fs.existsSync(dbPath)) {
			const db = await open({
				filename: dbPath,
				driver: sqlite3.Database,
			});

			// Creating the users table
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

			console.log("Created users table");
		} else {
			console.log("Connected to the existing database");
		}
	} catch (err) {
		console.error("Error initializing database:", err);
	}
};

initDB();

// Routes
app.use("/users", require("./Routes/UserRoute"));
app.use("/strava", require("./Routes/StravaRoute"));
app.use("/", require("./Routes/CalendarRoute"));
// app.use("/tokens",require("./Routes/ApiRoute"));

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
