require("dotenv").config();
const axios = require("axios");

const authLink = "https://www.strava.com/oauth/token";

function getActivities(res) {
	const activitiesLink = `https://www.strava.com/api/v3/athlete/activities`;
	axios
		.get(activitiesLink, {
			params: { access_token: res.access_token },
		})
		.then((response) => {
			console.log(response.data);
		})
		.catch((error) => {
			console.error(error);
		});
}

function reAuthorize() {
	axios
		.post(authLink, {
			client_id: process.env.STRAVA_CLIENT_ID,
			client_secret: process.env.STRAVA_CLIENT_SECRET,
			refresh_token: process.env.STRAVA_REFRESH_TOKEN,
			grant_type: "refresh_token",
		})
		.then((res) => getActivities(res.data))
		.catch((error) => {
			console.error(error);
		});
}

// Perform the re-authorization
reAuthorize();

// Export the function
module.exports = { reAuthorize };
