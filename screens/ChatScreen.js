import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	Dimensions,
	KeyboardAvoidingView,
	SafeAreaView,
	TouchableHighlight,
	Keyboard,
	ScrollView,
} from "react-native";

import lines from "../assets/lines.png";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import firebase from "firebase";
import infinity from "../assets/Infinity.gif";

const ChatScreen = (props) => {
	const user = auth.currentUser;
	const profileUri = props?.route.params.profileUri;
	const name = props?.route.params.name;
	const id = props?.route.params.id;
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [userUri, setUserUri] = useState();
	const [userName, setUserName] = useState();

	useEffect(() => {
		db.collection("messages")
			.doc(user?.uid)
			.collection("userMessages")
			.doc(name)
			.collection(id)
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) =>
				setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
			);

		db.collection("users")
			.doc(user?.uid)
			.collection("profile")
			.doc("profile")
			.onSnapshot((snapshot) => setUserUri(snapshot.data()?.uri));
		db.collection("users")
			.doc(user?.uid)
			.collection("profile")
			.doc("name")
			.onSnapshot((snapshot) => setUserName(snapshot.data()?.name));
	}, []);

	const sendMessage = () => {
		db.collection("messages")
			.doc(user?.uid)
			.collection("userMessages")
			.doc(name)
			.collection(id)
			.add({
				message: input,
				username: name,
				userUid: user?.uid,
				receiverId: id,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});
		db.collection("messages")
			.doc(id)
			.collection("userMessages")
			.doc(userName)
			.collection(user?.uid)
			.add({
				message: input,
				username: name,
				senderUid: user?.uid,
				userId: id,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});
		setInput("");

		db.collection("users")
			.doc(user?.uid)
			.collection("userChats")
			.doc(id)
			.update({
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			});
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
			<KeyboardAvoidingView
				// behavior={Platform.OS === "ios" ? "padding" : "height"}
				behavior={Platform.OS === "ios" ? "padding" : ""}
				style={styles.containerView}
				// keyboardVerticalOffset={50}
			>
				<View style={styles.container}>
					<View style={styles.top}>
						<View
							style={{
								display: "flex",
								alignItems: "center",
								flexDirection: "row",
							}}
						>
							<Image
								source={{ uri: profileUri }}
								style={{ height: 30, width: 30, borderRadius: 25 }}
							/>
							<Text
								style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}
							>
								{name}
							</Text>
						</View>

						<Image source={infinity} style={{ width: 40, height: 20 }} />

						<View
							style={{
								display: "flex",
								alignItems: "center",
								flexDirection: "row",
							}}
						>
							<Text
								style={{ fontSize: 20, fontWeight: "bold", paddingRight: 10 }}
							>
								{userName}
							</Text>
							<Image
								source={{ uri: userUri }}
								style={{ height: 30, width: 30, borderRadius: 25 }}
							/>
						</View>
					</View>
					<ScrollView>
						{messages.map((message) => (
							<View
								style={
									message.username == name
										? {
												display: "flex",
												flexDirection: "column",
												flex: 1,
												alignItems: "flex-end",
												margin: 10,
										  }
										: {
												display: "flex",
												flexDirection: "column",
												flex: 1,
												alignItems: "flex-start",
												margin: 10,
										  }
								}
								key={message.id}
							>
								<TouchableHighlight
									style={{
										fontSize: 20,
										backgroundColor: "#E8F0F2",
										borderRadius: 10,
										width: "auto",
										padding: 10,
										marginBottom: 5,
									}}
								>
									<Text
										style={{
											fontSize: 15,
										}}
									>
										{message.username}
									</Text>
								</TouchableHighlight>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										backgroundColor: "#FAF1E6",
										borderRadius: 10,
										padding: 10,
										maxWidth: 200,
										minWidth: 100,
									}}
								>
									<Text style={{ fontSize: 20, margin: 5 }}>
										{message.message}
									</Text>
									<Text
										style={{
											fontSize: 8,
											bottom: 0,
											position: "absolute",
											alignItems: "flex-start",
											right: 0,
											padding: 3,
										}}
									>
										{new Date(message.timestamp?.toDate()).toLocaleTimeString()}
									</Text>
								</View>
							</View>
						))}
					</ScrollView>

					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							type="text"
							placeholder="Type Something"
							value={input}
							onChangeText={(text) => setInput(text)}
						/>
						<TouchableOpacity style={{ borderRadius: 30 }}>
							<SimpleLineIcons
								name="emotsmile"
								size={24}
								color="black"
								style={{
									height: 37,
									width: 37,
									backgroundColor: "purple",
									borderRadius: 30,
									color: "white",
									padding: 6,
									paddingRight: 6,
								}}
							/>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => sendMessage()}>
							<Ionicons
								name="ios-paper-plane-outline"
								size={24}
								color="black"
								style={{
									height: 37,
									width: 37,
									backgroundColor: "purple",
									borderRadius: 30,
									color: "white",
									padding: 6,
									paddingRight: 6,
								}}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ChatScreen;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		// height: Dimensions.get("window").height,
		flex: 1,
	},
	containerView: {
		flex: 1,
	},
	top: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 10,
		alignItems: "center",
	},

	inputContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginBottom: 20,
		padding: 10,
	},
	input: {
		bottom: 0,
		height: 40,
		flex: 0.9,
		marginRight: 15,
		backgroundColor: "#ECECEC",
		padding: 10,
		color: "gray",
		borderRadius: 30,
	},
});
