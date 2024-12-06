"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
	const mapContainer = useRef(null); // Reference to the map container
	const mapInstance = useRef(null); // Reference to store the Leaflet map instance

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			mapContainer.current &&
			!mapInstance.current
		) {
			// Initialize the map only if it hasn't been initialized
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

		// Cleanup function to destroy the map on unmount
		return () => {
			if (mapInstance.current) {
				mapInstance.current.remove();
				mapInstance.current = null; // Reset the map instance
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
