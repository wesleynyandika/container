const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const router = express.Router();
const scopes = [
	"https://www.googleapis.com/auth/calendar",
	"https://www.googleapis.com/auth/userinfo.profile",
	"https://www.googleapis.com/auth/userinfo.email",
];

const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI,
	"http://localhost:5173"
);

router.get("/google", (req, res) => {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes,
	});

	res.redirect(authUrl);
});

router.get("/google/redirect", async (req, res) => {
	const { code } = req.query;
	console.log("Received code:", code);

	try {
		const { tokens } = await oauth2Client.getToken(code);
		console.log("Obtained tokens:", tokens);
		oauth2Client.setCredentials(tokens);

		// get user info
		const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
		const { data } = await oauth2.userinfo.get();
		console.log("User info:", data);

		if (tokens) {
			res.redirect(`http://localhost:5173?status=success&email=${data.email}`);
		} else {
			res.redirect(`http://localhost:5173?status=fail`);
		}
	} catch (error) {
		console.error(error);
		res.redirect(`http://localhost:5173?status=error`);
	}
});

router.post("/schedule", async (req, res, next) => {
	try {
		const { title, description, from, to, location, timezone } = req.body;

		oauth2Client.setCredentials({ refresh_token });
		const calendar = google.calendar({ version: "v3" });

		const response = await calendar.events.insert({
			auth: oauth2Client,
			calendarId: "primary",
			requestBody: {
				summary: title,
				description,
				colorId: "7",
				start: {
					dateTime: new Date(from),
					timeZone: timezone,
				},
				end: {
					dateTime: new Date(to),
					timeZone: timezone,
				},
				location,
			},
		});

		console.log("Event inserted:", response.data);
		res.json({ message: "Event scheduled successfully", data: response.data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error scheduling event" });
	}
});

// get all events
router.get("/events", async (req, res) => {
	try {
		oauth2Client.setCredentials({ refresh_token });
		const calendar = google.calendar({ version: "v3" });

		const response = await calendar.events.list({
			auth: oauth2Client,
			calendarId: "primary",
			timeMin: new Date().toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: "startTime",
		});

		console.log("Events:", response.data.items);
		res.json({ message: "Events fetched successfully", data: response.data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error fetching events" });
	}
});

module.exports = router;
