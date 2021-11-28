import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { db, auth } from "../firebase";

const UserChatList = ({ chatId, navigation }) => {
	const user = auth.currentUser;
	const [profileUri, setProfileUri] = useState();
	const [userName, setUserName] = useState("");
	const [lastMessage, setLastMessage] = useState([]);
	const [lastMsg, setLastMsg] = useState();

	useEffect(() => {
		db.collection("users")
			.doc(chatId)
			.collection("profile")
			.doc("profile")
			.onSnapshot((snapshot) => setProfileUri(snapshot.data()?.uri));
		db.collection("users")
			.doc(chatId)
			.collection("profile")
			.doc("name")
			.onSnapshot((snapshot) => setUserName(snapshot.data()?.name));
		db.collection("users")
			.doc(user?.uid)
			.collection("profile")
			.doc("name")
			.onSnapshot((snapshot) => setLastMsg(snapshot.data()?.name));
	}, []);

	useEffect(() => {
		db.collection("messages")
			.doc(chatId)
			.collection("userMessages")
			.doc(lastMsg)
			.collection(user?.uid)
			.orderBy("timestamp", "asc")
			.onSnapshot((snapshot) =>
				setLastMessage(
					snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
				)
			);
	}, []);

	// console.warn(lastMessage);

	return (
		<>
			<ListItem
				onPress={() =>
					navigation.navigate("Chat", {
						profileUri,
						name: userName,
						id: chatId,
						navigation: navigation,
					})
				}
			>
				<Avatar
					rounded
					source={{
						uri: profileUri,
					}}
					style={{ height: 50, width: 50 }}
				/>
				<ListItem.Content>
					<ListItem.Title style={{ fontWeight: "700" }}>
						{userName}
					</ListItem.Title>
					<ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
						{lastMessage[0]?.data.message}
					</ListItem.Subtitle>
				</ListItem.Content>
			</ListItem>
		</>
	);
};

export default UserChatList;
