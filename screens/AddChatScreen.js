import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	TextInput,
	Dimensions,
	Image,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import AddUserChatList from "./AddUserChatList";
import { ListItem } from "react-native-elements";
import { db, auth } from "../firebase";

const AddChatScreen = (props) => {
	const navigation = props.route.params.navigation;
	const user = auth.currentUser;

	const [chats, setChats] = useState([]);

	useEffect(() => {
		db.collection("friends")
			.doc(user.uid)
			.collection("followers")
			.onSnapshot((snapshot) => {
				setChats(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
			});
	}, []);

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#FFFFFF",
				height: Dimensions.get("window").height,
			}}
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
				<TouchableOpacity onPress={() => navigation.navigate("Userchat")}>
					<Ionicons name="arrow-back-outline" size={28} color="black" />
				</TouchableOpacity>
				<Text style={{ fontSize: 23, fontWeight: "400" }}>New Message</Text>
				<TouchableOpacity>
					<FontAwesome5 name="paper-plane" size={24} color="black" />
				</TouchableOpacity>
			</View>

			<View
				style={{
					display: "flex",
					flexDirection: "row",
					padding: 10,
					alignItems: "center",
				}}
			>
				<Ionicons
					name="ios-search"
					size={24}
					color="gray"
					style={{ position: "absolute", zIndex: 1, marginLeft: 20 }}
				/>
				<TextInput
					placeholder="Search"
					type="text"
					style={{
						backgroundColor: "whitesmoke",
						borderRadius: 10,
						margin: 5,
						paddingLeft: 40,
						flex: 1,
						height: 40,
					}}
				/>
			</View>

			<View>
				{chats.map((chat) => (
					<AddUserChatList
						key={chat.id}
						navigation={navigation}
						id={chat.id}
						followerName={chat.followerName}
						followerUid={chat.followerUid}
					/>
				))}
			</View>
		</SafeAreaView>
	);
};

export default AddChatScreen;

const styles = StyleSheet.create({});
