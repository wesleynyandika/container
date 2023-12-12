import React, { useState, useEffect } from "react";
import "./Record.css";
import strava from "../../assets/strava.png";
import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import axios from "axios";

const Record = ({ user, close, date }) => {
	const [workoutDate, setWorkoutDate] = useState(new Date());
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [location, setLocation] = useState("");
	const [timezone, setTimezone] = useState(
		Intl.DateTimeFormat().resolvedOptions().timeZone
	);
	const [duration, setDuration] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [country, setCountry] = useState("");
	const [type, setType] = useState("");
	const [refresh_accessToken, setRefresh_accessToken] = useState(null);
	const [distance, setDistance] = useState("");

	useEffect(() => {
		if (date) {
			setWorkoutDate(date);
		}
	}, [date]);

	// validate title
	const validateTitle = (title) => {
		const re = /^[a-zA-Z0-9 ]{2,30}$/;
		return re.test(title);
	};

	const activityTypes = [
		"AlpineSki",
		"BackcountrySki",
		"Canoeing",
		"Crossfit",
		"EBikeRide",
		"Elliptical",
		"Golf",
		"Handcycle",
		"Hike",
		"IceSkate",
		"InlineSkate",
		"Kayaking",
		"Kitesurf",
		"NordicSki",
		"Ride",
		"RockClimbing",
		"RollerSki",
		"Rowing",
		"Run",
		"Sail",
		"Skateboard",
		"Snowboard",
		"Snowshoe",
		"Soccer",
		"StairStepper",
		"StandUpPaddling",
		"Surfing",
		"Swim",
		"Velomobile",
		"VirtualRide",
		"VirtualRun",
		"Walk",
		"WeightTraining",
		"Wheelchair",
		"Windsurf",
		"Workout",
		"Yoga",
	];

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				if (user) {
					const data = {
						refresh_token: `${user?.refreshWriteToken}`,
						client_id: `${user?.stravaClientId}`,
						client_secret: `${user?.stravaClientSecret}`,
					};

					const response = await axios.post(
						"http://localhost:8000/strava/refresh",
						data
					);
					console.log("Refresh Response:", response.data);

					const accessToken = response.data?.access_token;
					console.log("Access Token:", accessToken);
					setRefresh_accessToken(accessToken);
				}
			} catch (err) {
				console.error("Error Fetching Activities:", err);
			}
		};

		fetchActivities();
	}, [user]);

	console.log("Refresh Access Token:", refresh_accessToken);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// change distance to miles
			const formattedDistance = parseFloat(distance) * 0.621371;
			const data = {
				access_token: refresh_accessToken,
				name: title,
				type: type,
				distance: formattedDistance,
				start_date_local: workoutDate,
				elapsed_time: duration,
				location_city: city,
				location_state: state,
				location_country: country,
			};
			console.log("Data:", data);
			const response = await axios.post(
				"http://localhost:8000/strava/activity",
				data
			);
			console.log("Response:", response.data);
			if (response.data) {
				window.location.reload();
			}
			close();
		} catch (err) {
			console.error("Error Creating Activity:", err);
		}
	};

	return (
		<div className="Record flex">
			<div className="RecordLeft FlexDisplay bg-gray-200">
				<h3>Record</h3>
				<p>Record your workouts and keep track of your progress.</p>
				<img src={strava} alt="strava" className="stravaLogo" />
				<small>
					{date
						? `Current Date: ${date.toDateString()}(${timezone})`
						: `Current Date: ${workoutDate.toDateString()}(${timezone})`}
				</small>
			</div>
			<div className="RecordRight FlexDisplay">
				<p>Please fill out the form below to Record your workout.</p>
				<form>
					<div className="InputFiels flex gap-2">
						<TextField
							label="Title"
							variant="outlined"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							size="small"
							required
							color={validateTitle(title) ? "primary" : "error"}
							helperText={
								validateTitle(title)
									? ""
									: "Title should be at least 2 characters"
							}
							error={!validateTitle(title)}
						/>
						<TextField
							label="Type"
							variant="outlined"
							value={type}
							onChange={(e) => setType(e.target.value)}
							size="small"
							select
						>
							{activityTypes.map((option) => (
								<MenuItem key={option} value={option}>
									{option}
								</MenuItem>
							))}
						</TextField>
					</div>
					<div className="InputFiels flex gap-2">
						<TextField
							label="Date"
							variant="outlined"
							value={workoutDate}
							onChange={(e) => setWorkoutDate(e.target.value)}
							size="small"
							type="date"
							InputLabelProps={{ shrink: true }}
							required
						/>
						<TextField
							label="Duration (seconds)"
							variant="outlined"
							value={duration}
							onChange={(e) => setDuration(e.target.value)}
							size="small"
							type="duration"
							InputLabelProps={{ shrink: true }}
						/>
					</div>
					<TextField
						label="Distance (KM)"
						variant="outlined"
						value={distance}
						onChange={(e) => setDistance(e.target.value)}
						size="small"
						type="distance"
					/>

					<div className="InputFiels flex gap-2">
						<TextField
							label="City"
							variant="outlined"
							value={city}
							onChange={(e) => setCity(e.target.value)}
							size="small"
						/>
						<TextField
							label="Country"
							variant="outlined"
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							size="small"
						/>
						<TextField
							label="State"
							variant="outlined"
							value={state}
							onChange={(e) => setState(e.target.value)}
							size="small"
						/>
					</div>
				</form>
				<div className="FormBtns FlexDisplay">
					<Button variant="contained" color="error" onClick={close}>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						disabled={!validateTitle(title)}
						onClick={handleSubmit}
					>
						Record
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Record;
