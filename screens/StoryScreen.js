import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const StoryScreen = () => {
	return (
		<View style={styles.mainContainer}>
			<View style={styles.container}>
				<View style={styles.story}>
					<Image
						style={styles.image}
						source={{
							uri: "https://i.pinimg.com/474x/87/12/ea/8712eaa221916ff0e3ebfb64a99e3f18.jpg",
						}}
					/>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={styles.headerText}
					>
						Dannyyyyyyy
					</Text>
				</View>

				<View style={styles.story}>
					<Image
						style={styles.image}
						source={{
							uri: "https://i.pinimg.com/474x/87/12/ea/8712eaa221916ff0e3ebfb64a99e3f18.jpg",
						}}
					/>
					<Text style={styles.headerText}>Danny</Text>
				</View>

				<View style={styles.story}>
					<Image
						style={styles.image}
						source={{
							uri: "https://i.pinimg.com/474x/87/12/ea/8712eaa221916ff0e3ebfb64a99e3f18.jpg",
						}}
					/>
					<Text style={styles.headerText}>Danny</Text>
				</View>
			</View>
		</View>
	);
};

export default StoryScreen;

const styles = StyleSheet.create({
	mainContainer: {
		display: "flex",
		backgroundColor: "#FFFFFF",
		flexDirection: "row",
		borderBottomColor: "lightgray",
		borderBottomWidth: 1,
		marginBottom: 20,
		paddingBottom: 20,
	},
	container: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
	},
	story: {
		height: 63,
		width: 63,
		borderRadius: 37,
		borderColor: "lightgray",
		borderWidth: 2,
		marginRight: 10,
		marginTop: 20,
		marginLeft: 20,
		marginBottom: 10,
	},
	image: {
		width: 55,
		height: 55,
		resizeMode: "cover",
		borderRadius: 32,
		margin: 2,
	},
	headerText: {
		fontSize: 15,
		color: "black",
		padding: 7,
		width: 80,
	},
});
