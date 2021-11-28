import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
	ListViewComponent,
	Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import UserChatList from "../components/UserChatList";
import { db, auth } from "../firebase";

const userChats = ({ navigation }) => {
	const user = auth.currentUser;
	const [profileName, setProfileName] = useState("");
	const [chats, setChats] = useState([]);

	useEffect(() => {
		db.collection("users")
			.doc(user?.uid)
			.collection("profile")
			.doc("name")
			.onSnapshot((snapshot) => setProfileName(snapshot.data()?.name));

		db.collection("users")
			.doc(user?.uid)
			.collection("userChats")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) =>
				setChats(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
			);
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
					justifyContent: "space-between",
					alignItems: "center",
					padding: 10,
					borderBottomColor: "lightgray",
					borderBottomWidth: 1,
				}}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<TouchableOpacity onPress={() => navigation.replace("Nav")}>
						<Ionicons name="arrow-back" size={24} color="black" />
					</TouchableOpacity>
					<Text style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 10 }}>
						{profileName}
					</Text>
				</View>
				<TouchableOpacity
					onPress={() => navigation.navigate("AddChat", { navigation })}
				>
					<FontAwesome5 name="edit" size={24} color="black" />
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

			<View style={{ backgroundColor: "#FFFFFF" }}>
				{chats.map((chat) => (
					<UserChatList
						chatId={chat.id}
						key={chat.id}
						navigation={navigation}
					/>
				))}
			</View>
		</SafeAreaView>
	);
};

export default userChats;

const styles = StyleSheet.create({});
