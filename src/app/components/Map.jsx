"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
	const mapContainer = useRef(null); // Reference to the map container
	const mapInstance = useRef(null); // Reference to store the Leaflet map instance

	useEffect(() => {
		// Check if running in the browser and the map container exists
		if (
			typeof window !== "undefined" &&
			mapContainer.current &&
			!mapInstance.current
		) {
			mapInstance.current = L.map(mapContainer.current).setView(
				[51.505, -0.09],
				15
			);

			// Add map tiles
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "© OpenStreetMap contributors",
			}).addTo(mapInstance.current);
		}

		return () => {
			// Cleanup: destroy the map instance if it exists
			if (mapInstance.current) {
				mapInstance.current.remove();
				mapInstance.current = null;
			}
		};
	}, []);

	return (
		<div
			ref={mapContainer}
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
