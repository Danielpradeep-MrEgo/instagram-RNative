import React, { useEffect, useState } from "react";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { FontAwesome5 } from "@expo/vector-icons";
import PostScreen from "./PostScreen";
import StoryScreen from "./StoryScreen";
import { auth, db } from "../firebase";

const HomeScreen = ({ navigation }) => {
	const user = auth.currentUser;
	const [posts, setPosts] = useState([]);
	// const [docId, setDocId] = useState();

	useEffect(() => {
		const unsubscribe = db
			.collection("all")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) =>
				setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
			);

		return unsubscribe;
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
			<View style={styles.header}>
				<View style={styles.headerText}>
					<Text style={styles.textC}>C</Text>
					<Text style={styles.texto}>o</Text>
					<Text style={styles.textl}>l</Text>
					<Text style={styles.textL}>l</Text>
					<Text style={styles.texte}>e</Text>
					<Text style={styles.textc}>c</Text>
					<Text style={styles.textt}>t</Text>
					<Text style={styles.texti}>i</Text>
					<Text style={styles.textO}>o</Text>
					<Text style={styles.textn}>n</Text>
				</View>

				<TouchableOpacity onPress={() => navigation.navigate("Userchat")}>
					<FontAwesome5 name="paper-plane" size={24} color="black" />
				</TouchableOpacity>
			</View>

			<ScrollView>
				<Text style={styles.postHeading}>Trending</Text>
				<StoryScreen />
				{posts.map((post) => (
					<PostScreen
						key={post.id}
						id={post.id}
						name={post.name}
						displayPic={post.displayPic}
						postUri={post.uri}
						comment={post.comment}
						userUid={post.uid}
						navigation={navigation}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "whitesmoke",
		marginBottom: 30,
	},
	postHeading: {
		fontSize: 20,
		fontWeight: "bold",
		paddingLeft: 15,
		paddingTop: 10,
		backgroundColor: "#FFFFFF",
	},
	textC: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
	},
	texto: {
		color: "#BF5AF2",
		fontSize: 30,
		fontWeight: "bold",
	},
	textl: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
	},
	textL: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
	},
	texte: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
	},
	textc: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
	},
	textt: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
	},
	texti: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
	},
	textO: {
		color: "#FFD60A",
		fontSize: 30,
		fontWeight: "bold",
	},
	textn: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
	},
	headerText: {
		display: "flex",
		flexDirection: "row",
	},
	header: {
		display: "flex",
		flexDirection: "row",
		padding: 10,
		paddingRight: 20,
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
	},
});
