import React from "react";
import "./Mainbar.css";
import Map from "../Map/Map";
import Calendar from "../Calendar/Calendar";

const Mainbar = ({ user }) => {
	return (
		<div className="Mainbar FlexDisplay">
			<div className="Header FlexDisplay">
				<div className="User flex">
					<div className="Avatar">
						<img src="https://picsum.photos/200" alt="avatar" />
					</div>
					<div className="Name">
						<h3>{user?.userName}</h3>
						<p>{user?.email}</p>
					</div>
				</div>
			</div>
			<div className="MainTop FlexDisplay">
				<Map />
			</div>
			<div className="MainBottom flex">
				<Calendar user={user} />
			</div>
		</div>
	);
};

export default Mainbar;
