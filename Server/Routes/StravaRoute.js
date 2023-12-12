const express = require("express");
const axios = require("axios");
const router = express.Router();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const authLink = "https://www.strava.com/oauth/token";

router.post("/token", async (req, res) => {
	try {
		const { client_id, client_secret, code } = req.body;

		if (!client_id || !client_secret || !code) {
			return res.status(400).json({
				error: "Client ID, Client Secret, and Authorization Code are required.",
			});
		}

		const requestBody = {
			client_id,
			client_secret,
			code,
			grant_type: "authorization_code",
		};

		const { data } = await axios.post(authLink, requestBody);

		if (data && data.access_token && data.refresh_token) {
			return res.status(200).json({
				access_token: data.access_token,
				refresh_token: data.refresh_token,
			});
		} else {
			return res
				.status(500)
				.json({ error: "Access token not received from Strava." });
		}
	} catch (error) {
		console.error("Strava token request error:", error);

		if (error.response) {
			// The request was made, but the server responded with a status code other than 2xx
			return res.status(error.response.status).json({
				error: "Error in Strava request",
				details: error.response.data,
			});
		}

		return res
			.status(500)
			.json({ error: "Error in Strava request", details: error });
	}
});

// Get access token from refresh token
router.post("/refresh", async (req, res) => {
	try {
		const { client_id, client_secret, refresh_token } = req.body;

		if (!client_id || !client_secret || !refresh_token) {
			return res.status(400).json({
				error: "Client ID, Client Secret, and Refresh Token are required.",
			});
		}

		const authLink = "https://www.strava.com/oauth/token";
		const requestBody = {
			client_id,
			client_secret,
			refresh_token,
			grant_type: "refresh_token",
		};

		const { data } = await axios.post(authLink, requestBody);

		if (data && data.access_token) {
			return res.status(200).json({ access_token: data.access_token });
		} else {
			return res
				.status(500)
				.json({ error: "Access token not received from Strava." });
		}
	} catch (error) {
		console.error("Strava refresh token request error:", error);

		if (error.response) {
			// The request was made, but the server responded with a status code other than 2xx
			return res.status(error.response.status).json({
				error: "Error in Strava request",
				details: error.response.data,
			});
		}

		return res
			.status(500)
			.json({ error: "Error in Strava request", details: error });
	}
});

// Get write access token from refresh token
router.post("/refresh_write", async (req, res) => {
	try {
		const { client_id, client_secret, refresh_write } = req.body;

		if (!client_id || !client_secret || !refresh_write) {
			return res.status(400).json({
				error: "Client ID, Client Secret, and Refresh Token are required.",
			});
		}

		const authLink = "https://www.strava.com/oauth/token";
		const requestBody = {
			client_id,
			client_secret,
			refresh_write,
			grant_type: "refresh_token",
		};

		const { data } = await axios.post(authLink, requestBody);

		if (data && data.access_token) {
			return res.status(200).json({ access_token: data.access_token });
		} else {
			return res
				.status(500)
				.json({ error: "Access token not received from Strava." });
		}
	} catch (error) {
		console.error("Strava refresh token request error:", error);

		if (error.response) {
			// The request was made, but the server responded with a status code other than 2xx
			return res.status(error.response.status).json({
				error: "Error in Strava request",
				details: error.response.data,
			});
		}

		return res
			.status(500)
			.json({ error: "Error in Strava request", details: error });
	}
});

// create a new activity
router.post("/activity", async (req, res) => {
	const API_URL = "https://www.strava.com/api/v3/activities";

	try {
		const {
			access_token,
			name,
			distance,
			location_city,
			location_state,
			location_country,
			type,
			start_date_local,
			elapsed_time,
		} = req.body;

		if (!access_token || !name || !type || !start_date_local || !elapsed_time) {
			return res.status(400).json({
				error:
					"Access Token, Name, Type, Start Date, and Elapsed Time are required.",
			});
		}

		const requestBody = {
			name,
			type,
			start_date_local,
			elapsed_time,
			distance,
			location_city,
			location_state,
			location_country,
		};

		// Use Strava API URL and your Strava access token
		const config = {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		};

		// Make a POST request to create an activity on Strava
		const { data } = await axios.post(API_URL, requestBody, config);

		if (data && data.id) {
			return res.status(200).json({ activity_id: data.id });
		} else {
			return res
				.status(500)
				.json({ error: "Activity ID not received from Strava." });
		}

		// store activity in database, create a new table if it doesn't exist
		const db = await open({
			filename: dbPath,
			driver: sqlite3.Database,
		});

		await createActivitiesTable();

		const activity = await db.get(
			"SELECT * FROM activities WHERE activity_id = ?",
			[data.id]
		);

		if (!activity) {
			await db.run(
				"INSERT INTO activities (activity_id, name, type, start_date_local, elapsed_time, distance, location_city, location_state, location_country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[
					data.id,
					data.name,
					data.type,
					data.start_date_local,
					data.elapsed_time,
					data.distance,
					data.location_city,
					data.location_state,
					data.location_country,
				]
			);
		}

		return res.status(200).json({ activity_id: data.id });
	} catch (error) {
		// Handle errors
		if (error.response) {
			return res.status(error.response.status).json({
				error: "Error in Strava request",
				details: error.response.data,
			});
		}
		return res
			.status(500)
			.json({ error: "Error in Strava request", details: error });
	}
});

module.exports = router;
