import React from "react";
import "./Sidebar.css";
import Logo from "../../assets/logo.png";
import workoutIcon from "../../assets/workout.png";

const Sidebar = ({ activities }) => {
	console.log(activities);

	// get distance in miles
	const getDistance = (distance) => {
		return (distance / 1609.344).toFixed(2);
	};
	// get duration in hours and minutes
	const getDuration = (duration) => {
		const hours = Math.floor(duration / 3600);
		const minutes = Math.floor((duration % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	// get speed in miles per hour
	const getSpeed = (speed) => {
		return (speed * 2.237).toFixed(2);
	};

	return (
		<div className="Sidebar FlexDisplay bg-gray-200">
			<div className="SidebarTop FlexDisplay">
				<img src={Logo} alt="Logo" className="SidebarLogo" />
				<div className="CInfo">
					<h3>Extrasize </h3>
					<p>Track your running workouts.</p>
					<small>Version 1.0.0 © 2021 Extrasize </small>
				</div>
			</div>
			<div className="SidebarBottom FlexDisplay">
				<h3>WorkOuts</h3>
				{activities?.map((activity, index) => (
					<div className="WorkOut FlexDisplay" key={index}>
						<p>
							{activity?.name} on{" "}
							{new Date(activity?.start_date).toLocaleDateString()}
						</p>
						<div className="ItemContainer FlexDisplay flex">
							<div className="Icon">
								<img src={workoutIcon} alt="Workout Icon" />
							</div>
							<div className="Details">
								<div className="DetailsLeft FlexDisplay">
									<div className="WItem flex FlexDirection">
										<span>Distance:</span>
										<p>{getDistance(activity?.distance)}Mil</p>
									</div>
									<div className="WItem">
										<span>Duration:</span>
										<p>{getDuration(activity?.elapsed_time)}</p>
									</div>
								</div>
								<div className="DetailsRight FlexDisplay">
									<div className="WItem ">
										<span>Speed:</span>
										<p>{getSpeed(activity?.average_speed)}Mil/h</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
