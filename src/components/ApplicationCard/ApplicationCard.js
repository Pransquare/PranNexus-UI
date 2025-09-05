// src/components/ApplicationCard.js

import React from "react";
import "./ApplicationCard.css"; // Import the CSS file for ApplicationCard
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import PMSImage from "../../assets/images/PMS.png"; // Import image for PMS app
import EMSImage from "../../assets/images/EMS.png"; // Import image for EMS app
import SHImage from "../../assets/images/SH.png"; // Import image for NexusHire app

const ApplicationCard = ({ app }) => {
	// Map app names to their respective images and URLs
	const appData = {
		PMS: {
			image: PMSImage,
			url: "http://103.77.26.220:3001/", // Replace with actual URL for PMS
		},
		EMS: {
			image: EMSImage,
			url: "http://103.77.26.220:3002/", // Replace with actual URL for EMS
		},
		NexusHire: {
			image: SHImage,
			url: "http://103.77.26.220:3000/", // Replace with actual URL for NexusHire
		},
	};

	// Default values if app name doesn't match
	const { image, url } = appData[app.name] || {
		image: PMSImage, // Default image if not found
		url: "/", // Default URL if not found
	};

	return (
		<Link
			to={url}
			className="application-link"
			target="_blank"
			rel="noopener noreferrer">
			<div className="application-card">
				<div className="image-container">
					<div className="image-wrapper">
						<img
							src={image}
							alt={`${app.name} logo`}
							className="application-image"
						/>
					</div>
				</div>
				<div className="app-info-container">
					<h2 className="application-name">{app.name}</h2>
					<p className="application-description">{app.description}</p>
				</div>
			</div>
		</Link>
	);
};

export default ApplicationCard;
