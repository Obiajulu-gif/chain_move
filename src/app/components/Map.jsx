import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
	useEffect(() => {
		let map; // Declare the map variable here

		// Check if the map is already initialized
		if (!map) {
			map = L.map("map").setView([51.505, -0.09], 15);

			// Add map tiles
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "© OpenStreetMap contributors",
			}).addTo(map);
		}

		// Clean up the map instance when the component unmounts
		return () => {
			if (map) {
				map.remove(); // Properly destroy the map instance
			}
		};
	}, []); // Empty dependency array to ensure the effect only runs once

	return (
		<div
			id="map"
			style={{
				width: "100%",
				height: "500px",
				border: "1px solid #ccc",
				borderRadius: "8px",
			}}
		></div>
	);
};

export default Map;
