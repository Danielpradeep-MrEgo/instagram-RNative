import React from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	Dimensions,
	TextInput,
	KeyboardAvoidingView,
	ScrollView,
} from "react-native";

const SearchScreen = () => {
	return (
		<SafeAreaView
			style={{
				backgroundColor: "#FFFFFF",
				height: Dimensions.get("window").height,
				flex: 1,
			}}
		>
			<View style={{ flex: 1 }}>
				<TextInput placeholder="Search" type="text" style={styles.input} />
			</View>
		</SafeAreaView>
	);
};

export default SearchScreen;

const styles = StyleSheet.create({
	input: {
		backgroundColor: "whitesmoke",
		borderRadius: 10,
		margin: 5,
		height: 50,
	},
});
