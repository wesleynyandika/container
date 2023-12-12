import React, { useEffect } from "react";
import "./Map.css";

const Map = () => {
	useEffect(() => {
		getLocation();
	}, []);

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			alert("Geolocation is not supported by this browser.");
		}
	};

	const showPosition = (position) => {
		const iframe = document.querySelector("iframe");
		if (iframe) {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			const src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.982578286725!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4807a4d4d5a9d3f7%3A0x3a9a0f4b3b4a8a3d!2sGymnase%20de%20la%20Corderie!5e0!3m2!1sfr!2sfr!4v1634184709081!5m2!1sfr!2sfr`;
			iframe.src = src;
		}
	};

	return (
		<section className="Map">
			<iframe
				title="Google Map"
				width="100%"
				height="600"
				style={{ border: 0 }}
				allowFullScreen
				src=""
			></iframe>
		</section>
	);
};

export default Map;
