import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Image } from "react-native";
import { ListItem } from "react-native-elements";
import { db, auth } from "../firebase";
import firebase from "firebase";

const AddUserChatList = ({ navigation, id, followerName, followerUid }) => {
	const user = auth.currentUser;
	const [profileUri, setProfileUri] = useState();

	useEffect(() => {
		db.collection("users")
			.doc(followerUid)
			.collection("profile")
			.doc("profile")
			.onSnapshot((snapshot) => setProfileUri(snapshot.data()?.uri));
	}, []);

	const addChat = (id) => {
		db.collection("users").doc(user?.uid).collection("userChats").doc(id).set({
			userChat: id,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});
	};

	return (
		<View>
			<ListItem
				onPress={() =>
					navigation.navigate(
						"Chat",
						{
							profileUri,
							name: followerName,
							id: followerUid,
							navigation: navigation,
						},
						addChat(followerUid)
					)
				}
			>
				<Image
					source={{
						uri: profileUri,
					}}
					style={{ height: 50, width: 50, borderRadius: 25 }}
				/>
				<ListItem.Content>
					<ListItem.Title style={{ fontWeight: "700" }}>
						{followerName}
					</ListItem.Title>
					<ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
						Tap to send a message
					</ListItem.Subtitle>
				</ListItem.Content>
			</ListItem>
		</View>
	);
};

export default AddUserChatList;
