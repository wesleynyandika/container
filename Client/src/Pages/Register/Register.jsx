import React, { useState } from "react";
import "./Register.css";
import logo from "../../assets/logo.png";
import { TextField } from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router-use-history";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [stravaKey, setStravaKey] = useState("");
	const [mapKey, setMapKey] = useState("");
	const [calendarKey, setCalendarKey] = useState("");
	const [userName, setUserName] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const [stravaClientId, setStravaClientId] = useState("");
	const [stravaClientSecret, setStravaClientSecret] = useState("");
	const [refreshReadToken, setRefreshReadToken] = useState("");
	const [refreshWriteToken, setRefreshWriteToken] = useState("");

	// validate email
	const validateEmail = (email) => {
		const re = /\S+@\S+\.\S+/;
		return re.test(email);
	};

	// validate password
	const validatePassword = (password) => {
		const re = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
		return re.test(password);
	};

	// validate confirm password
	const validateConfirmPassword = (confirmPassword) => {
		return confirmPassword === password;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!name ||
			!email ||
			!password ||
			!confirmPassword ||
			!userName ||
			!stravaClientId ||
			!stravaClientSecret||
			!refreshReadToken ||
			!refreshWriteToken
		) {
			setError("Please fill in all the fields");
		} else {
			const newUser = {
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
			};

			try {
				setLoading(true);
				const res = await axios.post(
					"http://localhost:8000/users/register",
					newUser
				);
				setLoading(false);
				setSuccess(res.data.message);

				// Reset fields after a delay
				setTimeout(() => {
					setName("");
					setEmail("");
					setPassword("");
					setConfirmPassword("");
					setStravaKey("");
					setMapKey("");
					setCalendarKey("");
					setUserName("");
					setSuccess("");
					setStravaClientId("");
					setStravaClientSecret("");

					history.push("/login");
					window.location.reload();
				}, 2000);
			} catch (err) {
				setLoading(false);
				if (err.response && err.response.data && err.response.data.message) {
					setError(err.response.data.message);
				} else {
					setError("An error occurred while processing your request");
				}
				console.log(err);
			}
		}
	};

	return (
		<div className="Register flex ">
			<div className="RegisterLeft FlexDisplay">
				<h3>Welcome Back!</h3>
				<img src={logo} alt="logo" />
			</div>
			<div className="RegisterRight FlexDisplay bg-gray-200">
				<h3>
					Register to <span>ExtraSize</span>
				</h3>
				{error ? (
					<div className="Error FlexDisplay">
						<p>{error}</p>
					</div>
				) : success ? (
					<div className="Success FlexDisplay">
						<p>{success}</p>
					</div>
				) : (
					<p>Please fill in the details correctly</p>
				)}
				<form className="FlexDisplay" onSubmit={handleSubmit}>
					<div className="InputField flex">
						<TextField
							label="Username"
							variant="outlined"
							fullWidth
							size="small"
							color={userName.length > 0 ? "success" : "error"}
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
						/>
						<TextField
							label="Name"
							variant="outlined"
							fullWidth
							size="small"
							color={name.length > 0 ? "success" : "error"}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<TextField
						label="Email"
						variant="outlined"
						fullWidth
						size="small"
						type="email"
						color={validateEmail(email) ? "success" : "error"}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<TextField
						label="Strava Client Id"
						variant="outlined"
						fullWidth
						size="small"
						type="password"
						color={stravaClientId.length > 0 ? "success" : "error"}
						value={stravaClientId}
						onChange={(e) => setStravaClientId(e.target.value)}
					/>
					<TextField
						label="Strava Client Secret"
						variant="outlined"
						fullWidth
						size="small"
						type="password"
						color={stravaClientSecret.length > 0 ? "success" : "error"}
						value={stravaClientSecret}
						onChange={(e) => setStravaClientSecret(e.target.value)}
					/>
					<div className="InputField flex">
						<TextField
							label="Read Refresh Token"
							variant="outlined"
							fullWidth
							size="small"
							type="password"
							color={refreshReadToken.length > 0 ? "success" : "error"}
							value={refreshReadToken}
							onChange={(e) => setRefreshReadToken(e.target.value)}
						/>
						<TextField
							label="Write Refresh Token"
							variant="outlined"
							fullWidth
							size="small"
							type="password"
							color={refreshWriteToken.length > 0 ? "success" : "error"}
							value={refreshWriteToken}
							onChange={(e) => setRefreshWriteToken(e.target.value)}
						/>
					</div>
					<div className="InputField flex">
						<TextField
							label="Password"
							variant="outlined"
							fullWidth
							size="small"
							type="password"
							color={validatePassword(password) ? "success" : "error"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<TextField
							label="Confirm Password"
							variant="outlined"
							fullWidth
							size="small"
							type="password"
							color={
								validateConfirmPassword(confirmPassword) ? "success" : "error"
							}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
					<div className="Btns FlexDisplay">
						<button
							type="submit"
							className="btn btn-primary"
							disabled={
								!(
									name &&
									email &&
									password &&
									confirmPassword &&
									userName
								) ||
								!validateEmail(email) ||
								!validatePassword(password) ||
								!validateConfirmPassword(confirmPassword)
							}
						>
							Register
						</button>
						<p>
							Have an account? <a href="/login">Login</a>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
