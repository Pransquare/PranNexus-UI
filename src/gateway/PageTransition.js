// src/components/PageTransition.js
import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation } from "react-router-dom";
import "./PageTransition.css"; // Ensure this file exists with the animation styles

const PageTransition = ({ children }) => {
	const location = useLocation();

	return (
		<TransitionGroup>
			<CSSTransition key={location.key} classNames="pag" timeout={300}>
				<div className="pag">{children}</div>
			</CSSTransition>
		</TransitionGroup>
	);
};

export default PageTransition;
