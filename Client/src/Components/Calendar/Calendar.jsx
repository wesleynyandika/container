import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { Button, Menu, MenuItem, Modal } from "@mui/material";
import Schedule from "../Schedule/Schedule";
import Record from "../Record/Record";
import axios from "axios";

const MyCalendar = ({ user }) => {
	const [date, setDate] = useState(new Date());
	const [anchorEl, setAnchorEl] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [selectedOption, setSelectedOption] = useState("");
	const [authenticated, setAuthenticated] = useState(false);
	const [events, setEvents] = useState([]);

	const urlParams = new URLSearchParams(window.location.search);
	const status = urlParams.get("status");
	const email = urlParams.get("email");

	useEffect(() => {
		if (status === "success") {
			setAuthenticated(true);
		}
	}, [status]);
	console.log(authenticated);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleModal = (event) => {
		setSelectedOption(event.target.innerText);
		setAnchorEl(null);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleLogin = async () => {
		try {
			window.open("http://localhost:8000/google", "_self");
		} catch (err) {
			console.log(err);
		}
	};

	// fetch events from google calendar
	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const res = await axios.get("http://localhost:8000/events");
				console.log(res.data);
				if (res.data) {
					setEvents(res.data?.data?.items);
				}
			} catch (err) {
				console.log(err);
			}
		};
		fetchEvents();
	}, []);
	console.log(events);

	// get the date of each event
	const eventDates = events.map((event) => {
		return new Date(event.start.dateTime).toISOString().split("T")[0];
	});
	console.log(eventDates);

	return (
		<section className="Calendar">
			<div className="GoogleCalendar FlexDisplay">
				<h3>
					<i className="fas fa-calendar-alt"></i> My Calendar
				</h3>
				<Button
					variant="contained"
					color="primary"
					onClick={() => handleLogin()}
					disabled={authenticated}
				>
					{authenticated ? "Synced" : "Sync with google"}&nbsp;
				</Button>
				<Calendar
					onChange={setDate}
					value={date}
					tileClassName={({ date, view }) => {
						if (view === "month") {
							const dateISO = date.toISOString().split("T")[0];
							const isActive = eventDates.includes(dateISO) ? "active" : "";
							return `${isActive}`;
						}
					}}
				/>

				<div className="Create">
					<Button
						variant="contained"
						color="primary"
						onClick={handleClick}
						disabled={!authenticated}
					>
						<i className="fas fa-plus"></i>&nbsp; Create
					</Button>
					<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={() => setAnchorEl(null)}
					>
						<MenuItem className="MenuItem" onClick={handleModal}>
							Schedule
						</MenuItem>
						<MenuItem className="MenuItem" onClick={handleModal}>
							Record
						</MenuItem>
					</Menu>
				</div>
				{openModal && (
					<Modal
						open={openModal}
						onClose={handleCloseModal}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<div className="CalendarModal">
							<div className="ModalContent">
								{selectedOption === "Schedule" ? (
									<Schedule close={handleCloseModal} date={date} user={user} />
								) : (
									<Record close={handleCloseModal} date={date} user={user} />
								)}
							</div>
						</div>
					</Modal>
				)}
			</div>
			<div className="GoogleEvents FlexDisplay">
				<iframe
					title="Google Calendar"
					src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
						email
					)}&showTitle=1&showPrint=0&showTabs=1&showCalendars=1&
					color=colorId&showTz=1&mode=MONTH&ctz=${
						Intl.DateTimeFormat().resolvedOptions().timeZone
					}`}
					width="100%"
					height="600"
					style={{ border: 0 }}
					allowFullScreen
				></iframe>
			</div>
		</section>
	);
};

export default MyCalendar;
