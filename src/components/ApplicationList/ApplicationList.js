// src/components/ApplicationList.js

import React from "react";
import ApplicationCard from "../ApplicationCard/ApplicationCard"; // Import the ApplicationCard component
import "./ApplicationList.css"; // Import the CSS file for ApplicationList

const ApplicationList = ({ applications }) => {
	return (
		<div className="application-list">
			{applications.map((app, index) => (
				<ApplicationCard key={index} app={app} />
			))}
		</div>
	);
};

export default ApplicationList;
