import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	Image,
	Dimensions,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	StatusBar,
	ScrollView,
	Keyboard,
} from "react-native";
import { auth, db } from "../firebase";
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const CommentsScreen = (props) => {
	const user = auth.currentUser;
	const [profileCommentUri, setProfileCommentUri] = useState(null);
	const [input, setInput] = useState("");
	// const [name, setName] = useState("");
	const [comments, setComments] = useState([]);
	const id = props?.route.params.id;
	const name = props?.route.params.name;
	const profileUri = props?.route.params.displayPic;
	const postComment = props?.route.params.comment;

	useEffect(() => {
		db.collection("users")
			.doc(user?.uid)
			.collection("profile")
			.doc("profile")
			.onSnapshot((snapshot) => setProfileCommentUri(snapshot.data()?.uri));

		db.collection("allComments")
			.doc(id)
			.collection("comments")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) =>
				setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
			);
	}, [profileCommentUri, name]);

	const sendComment = () => {
		db.collection("allComments").doc(id).collection("comments").add({
			comment: input,
			displayPic: profileCommentUri,
			name: name,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});
		setInput("");
		Keyboard.dismiss();

		// console.warn("Comment");
	};

	// console.log(comments);

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#FFFFFF",
				flex: 1,
			}}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS == "ios" ? "height" : ""}
				keyboardVerticalOffset={25}
				style={styles.containerView}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						padding: 10,
						borderBottomWidth: 1,
						borderBottomColor: "lightgray",
					}}
				>
					<TouchableOpacity>
						<Ionicons name="arrow-back-outline" size={28} color="black" />
					</TouchableOpacity>
					<Text style={{ fontSize: 23, fontWeight: "400" }}>comments</Text>
					<TouchableOpacity>
						<FontAwesome5 name="paper-plane" size={24} color="black" />
					</TouchableOpacity>
				</View>

				<View
					style={
						Platform.OS === "ios" ? styles.textViewIos : styles.textViewAndroid
					}
				>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							// alignItems: "center",
						}}
					>
						<Image source={{ uri: profileUri }} style={styles.image} />
						<Text
							style={{ fontSize: 18, fontWeight: "700", paddingLeft: 10 }}
							ellipsizeMode="tail"
						>
							{name}
						</Text>
					</View>

					<View>
						<Text
							style={{
								fontSize: 18,
								// fontWeight: "400",
								padding: 10,
								marginLeft: 40,
								top: -25,
							}}
							ellipsizeMode="tail"
							numberOfLines={1}
						>
							{postComment}
						</Text>
					</View>
				</View>

				<ScrollView style={{ marginBottom: 40 }}>
					<View
						style={{
							// backgroundColor: "#EBF5F7",
							padding: 10,
							// borderBottomColor: "lightgray",
							// borderBottomWidth: 1,
						}}
					>
						{comments.map((comment) => (
							<View
								key={comment.id}
								style={{
									display: "flex",
									flexDirection: "row",
									paddingBottom: 20,
								}}
							>
								<Image
									source={{ uri: comment.displayPic }}
									style={styles.image}
								/>
								<View
									style={{
										display: "flex",
										flexDirection: "column",
										paddingLeft: 10,
									}}
								>
									<Text style={{ fontSize: 18, fontWeight: "bold" }}>
										{comment.name}
									</Text>
									<Text ellipsizeMode="tail" numberOfLines={3}>
										{comment.comment}
									</Text>
								</View>
							</View>
						))}
					</View>
				</ScrollView>

				<View style={styles.bottomContainer}>
					<Image source={{ uri: profileCommentUri }} style={styles.image} />
					<TextInput
						placeholder="Add a comment...."
						value={input}
						onChangeText={(text) => setInput(text)}
						style={{ paddingLeft: 10, marginLeft: 10, flex: 1 }}
					/>
					<TouchableOpacity onPress={sendComment}>
						<Text
							style={{
								color: "#5598E9",
								fontSize: 18,
								fontWeight: "400",
								padding: 5,
								paddingLeft: 10,
								paddingRight: 10,
							}}
						>
							Post
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default CommentsScreen;

const styles = StyleSheet.create({
	bottomContainer: {
		position: "absolute",
		bottom: 0,
		padding: 10,
		backgroundColor: "whitesmoke",
		display: "flex",
		flexDirection: "row",
		flex: 1,
		alignItems: "center",
	},
	image: {
		height: 40,
		width: 40,
		borderRadius: 20,
	},
	containerView: {
		flex: 1,
	},
	textViewAndroid: {
		display: "flex",
		flexDirection: "column",
		padding: 10,
		borderRadius: 15,
		backgroundColor: "whitesmoke",
		margin: 15,
		// shadowColor: "#000",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 4,
		// },
		// shadowOpacity: 0,
		// shadowRadius: 4.65,

		shadowColor: "rgba(0,0,0,0.6)",
		shadowOffset: { width: 3, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 25,
		elevation: 30,
	},
	textViewIos: {
		display: "flex",
		flexDirection: "column",
		padding: 10,
		borderRadius: 15,
		backgroundColor: "whitesmoke",
		margin: 15,
		// shadowColor: "#000",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 4,
		// },
		// shadowOpacity: 0,
		// shadowRadius: 4.65,

		shadowColor: "rgba(0,0,0,0.4)",
		shadowOffset: { width: 3, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 15,
		elevation: 20,
	},
});
