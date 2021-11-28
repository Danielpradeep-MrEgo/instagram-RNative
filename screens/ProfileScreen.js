import React, { useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	ImageBackground,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Button,
} from "react-native";
import lines from "../assets/linesLight.png";
import person from "../assets/person-icon.png";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { auth, db } from "../firebase";

const ProfileScreen = ({ navigation }) => {
	const user = auth.currentUser;
	const [profileUri, setProfileUri] = useState(null);
	const [profileName, setProfileName] = useState("");
	const [coverDataUri, setCoverDataUri] = useState(null);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		db.collection("users")
			.doc(user?.uid)
			.collection("profile")
			.doc("profile")
			.onSnapshot((snapshot) => setProfileUri(snapshot.data()?.uri));
		db.collection("users")
			.doc(user?.uid)
			.collection("profile")
			.doc("name")
			.onSnapshot((snapshot) => setProfileName(snapshot.data()?.name));
		db.collection("users")
			.doc(user?.uid)
			.collection("profile")
			.doc("cover")
			.onSnapshot((snapshot) => setCoverDataUri(snapshot.data()?.coverUri));
	}, [profileName, profileUri, coverDataUri]);

	useEffect(() => {
		db.collection("users")
			.doc(user?.uid)
			.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) =>
				setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
			);
	}, []);

	const signout = () => {
		auth.signOut().then(() => {
			navigation.replace("Login");
		});
	};

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#FFFFFF",
				height: Dimensions.get("window").height,
				paddingBottom: 50,
			}}
		>
			<ScrollView>
				<ImageBackground
					source={{
						uri: coverDataUri,
					}}
					style={styles.ImageBackground}
				>
					<View style={styles.top}>
						{/* <AntDesign
							name="setting"
							size={24}
							color="white"
							onPress={() => navigation.replace("Nav")}
						/> */}
						<TouchableOpacity>
							<AntDesign
								name="home"
								size={24}
								color="black"
								onPress={() => navigation.replace("Nav")}
							/>
						</TouchableOpacity>
						<Image source={lines} style={{ width: 20 }} />
					</View>
				</ImageBackground>

				<View style={styles.middle}>
					<View style={{ alignItems: "center" }}>
						<Text style={{ fontSize: 24, fontWeight: "bold" }}>0</Text>
						<Text style={{ color: "gray", fontSize: 15 }}>Followers</Text>
					</View>
					<View style={{ alignItems: "center", justifyContent: "center" }}>
						{profileUri ? (
							<Image
								style={styles.image}
								source={{
									uri: profileUri,
								}}
							/>
						) : (
							<Image style={styles.image} source={person} />
						)}
					</View>
					<View style={{ alignItems: "center" }}>
						<Text style={{ fontSize: 24, fontWeight: "bold" }}>0</Text>
						<Text style={{ color: "gray", fontSize: 15 }}>Following</Text>
					</View>
				</View>

				<View style={styles.handler}>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "700",
						}}
					>
						{profileName}
					</Text>
				</View>

				<View style={styles.icons}>
					<View
						style={{
							backgroundColor: "#1473e6",
							borderRadius: 30,
							width: 50,
							height: 50,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<TouchableOpacity onPress={() => navigation.replace("ProfileEdit")}>
							<MaterialCommunityIcons
								name="account-edit-outline"
								size={24}
								color="white"
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.feedContainer}>
					<Text
						style={{
							fontSize: 18,
							fontWeight: "bold",
							paddingLeft: 5,
						}}
					>
						Feed
					</Text>

					<Button
						title="logOut"
						onPress={signout}
						style={{ marginBottom: 60 }}
					/>

					<View style={styles.feed}>
						{posts.map((data) => (
							<Image
								key={data.id}
								style={{ height: 110, width: 110, margin: 8 }}
								source={{
									uri: data.uri,
								}}
							/>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	ImageBackground: {
		height: 300,
		width: Dimensions.get("window").width,
	},
	top: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 20,
	},
	image: {
		height: 100,
		width: 100,
		borderRadius: 50,
		top: -75,
		position: "absolute",
	},
	middle: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	handler: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		top: 20,
	},
	icons: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		top: 20,
		margin: 20,
	},
	feedContainer: {
		padding: 5,
	},
	feed: {
		marginTop: 10,
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		borderRadius: 13,
		backgroundColor: "#E5E8F1",
		padding: 10,
		paddingBottom: 40,
	},
});
