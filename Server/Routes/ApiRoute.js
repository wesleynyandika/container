const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const router = express.Router();
const scopes = [
	"https://www.googleapis.com/auth/calendar",
	"https://www.googleapis.com/auth/userinfo.profile",
	"https://www.googleapis.com/auth/userinfo.email",
];

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI,
	'http://localhost:5173'
);

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

router.get("/google", (req, res) => {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes,
	});

	res.redirect(authUrl);
});

router.get("/google/redirect", async (req, res) => {
	const { code } = req.query;
	console.log(code);

	try {
		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);

		// get user info
		const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
		const { data } = await oauth2.userinfo.get();
		console.log(data);

		if (tokens) {
			res.redirect(
				`http://localhost:5173?status=success&code=${code}&email=${data.email}`
			);
		} else {
			res.redirect(`http://localhost:5173?status=fail`);
		}
	} catch (error) {
		console.error(error);
		res.redirect(`http://localhost:5173?status=error`);
	}
});

router.post("/schedule", async (req, res) => {
	const { title, description, from, to, location, timezone } = req.body;

	try {
		const event = {
			summary: title,
			description,
			start: { dateTime: from, timeZone: timezone },
			end: { dateTime: to, timeZone: timezone },
			location,
			reminders: {
				useDefault: false,
				overrides: [
					{ method: "email", minutes: 24 * 60 },
					{ method: "popup", minutes: 10 },
				],
			},
		};

		console.log(event);

		const response = await calendar.events.insert({
			calendarId: "primary",
			resource: event,
		});

		console.log(response.data);
		res.json({ message: "Event scheduled successfully", data: response.data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error scheduling event" });
	}
});

module.exports = router;
