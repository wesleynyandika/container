import React, { useState } from "react";
import "./Schedule.css";
import calendar from "../../assets/calendar.png";
import { Button, TextField } from "@mui/material";
import axios from "axios";

const Schedule = ({ close }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [location, setLocation] = useState("");
	const [date, setDate] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formattedDate = new Date(date).toISOString().split("T")[0];
		const fromTime = `${formattedDate}T${from}`;
		const toTime = `${formattedDate}T${to}`;
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		const data = {
			title,
			description,
			date: formattedDate,
			from: fromTime,
			to: toTime,
			location,
			timezone,
		};
		console.log(data);

		const maxRetries = 3;
		let retries = 0;

		const makeAPICall = () => {
			axios
				.post("http://localhost:8000/schedule", data, { timeout: 10000 })
				.then((res) => {
					console.log(res);
					close();
					window.location.reload();
				})
				.catch((err) => {
					console.log(err);
					if (
						err.code === "ERR_SOCKET_CONNECTION_TIMEOUT" &&
						retries < maxRetries
					) {
						retries++;
						const backoffTime = Math.pow(2, retries) * 1000; // Exponential backoff
						setTimeout(() => makeAPICall(), backoffTime);
					} else {
						if (err.response) {
							// Server responded with a status code
							console.log("Server Error:");
							console.log("Status:", err.response.status);
							console.log("Data:", err.response.data);
						} else if (err.request) {
							// Request made but no response received
							console.log("Request Error:", err.request);
						} else {
							// Something happened in setting up the request
							console.log("Error:", err.message);
						}
					}
				});
		};

		makeAPICall();
	};

	const validateTitle = (title) => {
		const re = /^[a-zA-Z0-9 ]{2,30}$/;
		return re.test(title);
	};

	const validateDescription = (description) => {
		const re = /^[a-zA-Z0-9 ]{2,100}$/;
		return re.test(description);
	};

	const validateDate = (date, from, to) => {
		const selectedDate = new Date(date);
		const selectedFrom = new Date(from);
		const selectedTo = new Date(to);

		if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
			return false;
		}

		if (selectedFrom >= selectedTo) {
			return false;
		}

		return true;
	};

	const validateLocation = (location) => {
		const re = /^[a-zA-Z0-9 ]{2,30}$/;
		return re.test(location);
	};

	return (
		<div className="Schedule flex">
			<div className="ScheduleLeft FlexDisplay bg-gray-200">
				<h3>Schedule</h3>
				<p>Schedule your workouts and keep track of your progress.</p>
				<img src={calendar} alt="calendar" className="calendarLogo" />
				<small></small>
			</div>
			<div className="ScheduleRight FlexDisplay">
				<p>Please fill out the form below to schedule your workout.</p>
				<form onSubmit={handleSubmit}>
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
					<div className="InputFields flex gap-2">
						<TextField
							label="Date"
							variant="outlined"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							size="small"
							type="date"
							InputLabelProps={{ shrink: true }}
							required
							color={validateDate(date, from, to) ? "primary" : "error"}
							helperText={
								validateDate(date, from, to)
									? ""
									: "Date should not be in the past"
							}
							error={!validateDate(date, from, to)}
						/>
						<TextField
							label="From"
							variant="outlined"
							value={from}
							onChange={(e) => setFrom(e.target.value)}
							size="small"
							type="time"
							InputLabelProps={{ shrink: true }}
							required
							color={validateDate(date, from, to) ? "primary" : "error"}
							helperText={
								validateDate(date, from, to)
									? ""
									: "From should be less than to"
							}
							error={!validateDate(date, from, to)}
						/>
						<TextField
							label="To"
							variant="outlined"
							value={to}
							onChange={(e) => setTo(e.target.value)}
							size="small"
							type="time"
							InputLabelProps={{ shrink: true }}
							required
							color={validateDate(date, from, to) ? "primary" : "error"}
							helperText={
								validateDate(date, from, to)
									? ""
									: "From should be less than to"
							}
							error={!validateDate(date, from, to)}
						/>
					</div>
					<TextField
						label="Location"
						variant="outlined"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						size="small"
						required
						color={validateLocation(location) ? "primary" : "error"}
						helperText={
							validateLocation(location)
								? ""
								: "Location should be at least 2 characters"
						}
						error={!validateLocation(location)}
					/>
					<TextField
						label="Description"
						variant="outlined"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						size="small"
						multiline
						rows={4}
						required
						color={validateDescription(description) ? "primary" : "error"}
						helperText={
							validateDescription(description)
								? ""
								: "Description should be at least 2 characters"
						}
						error={!validateDescription(description)}
					/>
					<div className="FormBtns FlexDisplay">
						<Button variant="contained" color="error" onClick={close}>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="primary"
							disabled={
								!validateTitle(title) ||
								!validateDescription(description) ||
								!validateLocation(location) ||
								!validateDate(date, from, to)
							}
							onClick={handleSubmit}
						>
							Schedule
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Schedule;
