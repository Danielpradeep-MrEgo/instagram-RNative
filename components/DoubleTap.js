import React from "react";
import { TouchableWithoutFeedback } from "react-native";

const DoubleTap = (props) => {
	const delay = 300;
	let lastTap = null;

	const handleDoubleTap = () => {
		console.warn("tap");
		const now = Date.now();
		if (lastTap && now - lastTap < delay) {
			props.onDoubleTap();
		} else {
			lastTap = now;
		}
	};

	return (
		<TouchableWithoutFeedback onPress={() => handleDoubleTap()}>
			{props.children}
		</TouchableWithoutFeedback>
	);
};

export default DoubleTap;
