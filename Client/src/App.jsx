import React, { useState, useEffect } from "react";
import "./App.css";
import Mainbar from "./Components/Mainbar/Mainbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import { Modal } from "@mui/material";
import axios from "axios";

const App = () => {
	const [user, setUser] = useState(null);
	const [activeComponent, setActiveComponent] = useState("Login");
	const [activities, setActivities] = useState([]);

	useEffect(() => {
		const storedUser = localStorage.getItem("Extrasize");

		if (storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
				console.log("Parsed User:", parsedUser);
			} catch (error) {
				console.error("Error parsing stored user data", error);
				localStorage.removeItem("Extrasize");
			}
		}

		const path = window.location.pathname;
		setActiveComponent(path === "/register" ? "Register" : "Login");
	}, []);

	useEffect(() => {
		const path = window.location.pathname;
		if (path === "/login" || path === "/register") {
			localStorage.removeItem("Extrasize");
		}
	}, [activeComponent]);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				if (user) {
					const data = {
						refresh_token: `${user?.refreshReadToken}`,
						client_id: `${user?.stravaClientId}`,
						client_secret: `${user?.stravaClientSecret}`,
					};

					const response = await axios.post(
						"http://localhost:8000/strava/refresh",
						data
					);
					console.log("Refresh Response:", response.data);

					const accessToken = response.data?.access_token;

					const activitiesResponse = await axios.get(
						`https://www.strava.com/api/v3/athlete/activities`,
						{
							headers: {
								Authorization: `Bearer ${accessToken}`,
							},
						}
					);
					console.log("Activities Response:", activitiesResponse.data);
					setActivities(activitiesResponse.data);
				}
			} catch (err) {
				console.error("Error Fetching Activities:", err);
			}
		};

		fetchActivities();
	}, [user]);

	console.log("Activities:", activities);

	return (
		<div className="App flex flexDisplay">
			{user && (
				<>
					<Sidebar user={user} activities={activities} />
					<Mainbar user={user} activities={activities} />
				</>
			)}
			{!user && (
				<Modal
					open={true}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					className="Modal FlexDisplay"
				>
					<div className="LoginModal">
						{activeComponent === "Login" && <Login />}
						{activeComponent === "Register" && <Register />}
					</div>
				</Modal>
			)}
		</div>
	);
};

export default App;
