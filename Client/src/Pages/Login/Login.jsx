import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { TextField } from "@mui/material";
import axios from "axios"; // Don't forget to import axios

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

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

	// login
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			const res = await axios.post("http://localhost:8000/users/login", {
				email,
				password,
			});
			console.log(res);
			if (res.data.message === "User logged in successfully") {
				setLoading(false);
				setSuccess(res.data.message);
				setError("");
				localStorage.setItem("Extrasize", JSON.stringify(res.data.user));
				window.location.href = "/";
			} else {
				setLoading(false);
				setError(res.data.message);
				setSuccess("");
			}
		} catch (err) {
			setLoading(false);
			setError(err.response.data.message);
			setSuccess("");
		}
	};

	return (
		<div className="Login flex ">
			<div className="LoginLeft FlexDisplay">
				<h3>Welcome Back!</h3>
				<img src={logo} alt="logo" />
			</div>
			<div className="LoginRight FlexDisplay bg-gray-200">
				<h3>
					Login to <span>ExtraSize</span>
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
					<p>Please Fill in the form to login to your account!</p>
				)}
				<form className="FlexDisplay" onSubmit={handleSubmit}>
					<TextField
						label="Email"
						variant="outlined"
						fullWidth
						size="small"
						color={validateEmail(email) ? "success" : "error"}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<TextField
						label="Password"
						variant="outlined"
						fullWidth
						size="small"
						color={validatePassword(password) ? "success" : "error"}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className="Btns FlexDisplay">
						<button type="submit">
							{loading ? (
								<i className="fas fa-circle-notch fa-spin"></i>
							) : (
								<p>Login</p>
							)}
						</button>
						<p>
							Don't have an account? <a href="/register">Register</a>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
