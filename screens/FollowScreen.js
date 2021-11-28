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
import cover from "../assets/cover.png";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

const FollowScreen = (props) => {
	const user = auth.currentUser;
	const uid = user.uid;
	const [coverDataUri, setCoverDataUri] = useState(null);
	const [nameData, setNameData] = useState("");
	const [posts, setPosts] = useState([]);
	const [FollowerCheck, setFollowerCheck] = useState();
	const [FollowingCheck, setFollowingCheck] = useState();
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);

	const profileUri = props?.route.params.displayPic;
	const name = props?.route.params.name;
	const userUid = props?.route.params.userUid;

	useEffect(() => {
		db.collection("users")
			.doc(userUid)
			.collection("profile")
			.doc("cover")
			.onSnapshot((snapshot) => setCoverDataUri(snapshot.data()?.coverUri));
		db.collection("users")
			.doc(user?.uid)
			.collection("profile")
			.doc("name")
			.onSnapshot((snapshot) => setNameData(snapshot.data()?.name));
	}, [coverDataUri, nameData]);

	useEffect(() => {
		db.collection("users")
			.doc(userUid)
			.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) =>
				setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
			);

		db.collection("friends")
			.doc(userUid)
			.collection("followers")
			.onSnapshot((snapshot) =>
				setFollowers(
					snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				)
			);
		db.collection("friends")
			.doc(userUid)
			.collection("following")
			.onSnapshot((snapshot) =>
				setFollowing(
					snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				)
			);
	}, []);

	useEffect(() => {
		const userFollowerRef = db
			.collection("friends")
			.doc(userUid)
			.collection("followers")
			.where("followerUid", "==", user?.uid);
		setFollowerCheck(userFollowerRef);

		const userFollowingRef = db
			.collection("friends")
			.doc(user?.uid)
			.collection("following")
			.where("followingUid", "==", userUid);
		setFollowingCheck(userFollowingRef);

		// db.collection("allUserNames")
		// 	.where("uid", "==", user.uid)
		// 	.get()
		// 	.then((querySnapshot) => {
		// 		querySnapshot.forEach((doc) => {
		// 			// console.log(doc.id, " => ", doc.data());
		// 			setUpdatedRef(doc.data()?.names.toString());
		// 		});
		// 	});

		console.log("on");
	}, []);

	const [followerSnapshot] = useCollection(FollowerCheck);
	const [followingSnapshot] = useCollection(FollowingCheck);

	const userFollowerExist = (uid) =>
		!!followerSnapshot?.docs.find((friend) =>
			friend.data(
				(likes) => likes.find((followerUid) => followerUid === uid)?.length > 0
			)
		);

	const userFollowingExist = (userUid) =>
		!!followingSnapshot?.docs.find((friend) =>
			friend.data(
				(likes) =>
					likes.find((followingUid) => followingUid === userUid)?.length > 0
			)
		);

	const FollowReq = () => {
		if (!userFollowerExist(uid)) {
			db.collection("friends").doc(userUid).collection("followers").add({
				followerName: nameData,
				followerUid: user.uid,
			});
		}

		if (!userFollowingExist(userUid)) {
			db.collection("friends").doc(user?.uid).collection("following").add({
				followingName: name,
				followingUid: userUid,
			});
		}
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
				{coverDataUri ? (
					<ImageBackground
						source={{
							uri: coverDataUri,
						}}
						style={styles.ImageBackground}
					/>
				) : (
					<ImageBackground style={styles.ImageBackground} source={cover} />
				)}

				<View style={styles.middle}>
					<View style={{ alignItems: "center" }}>
						<Text style={{ fontSize: 24, fontWeight: "bold" }}>
							{followers.length}
						</Text>
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
						<Text style={{ fontSize: 24, fontWeight: "bold" }}>
							{following.length}
						</Text>
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
						{name}
					</Text>
				</View>

				<View
					style={{
						alignItems: "center",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						top: 30,
						padding: 20,
					}}
				>
					<View style={{ alignItems: "center", paddingLeft: 35 }}>
						<Text style={{ fontSize: 24, fontWeight: "bold" }}>
							{posts.length}
						</Text>
						<Text style={{ color: "gray", fontSize: 15 }}>Posts</Text>
					</View>
					{name != nameData && (
						<View
							style={{
								alignItems: "center",
								justifyContent: "center",
								marginTop: 10,
								backgroundColor: "#5598E9",
								borderRadius: 5,
								width: 90,
							}}
						>
							{!userFollowerExist(uid) ? (
								<TouchableOpacity onPress={() => FollowReq()}>
									<Text
										style={{
											color: "#FFFFFF",
											fontSize: 18,
											fontWeight: "400",
											padding: 5,
											paddingLeft: 10,
											paddingRight: 10,
										}}
									>
										Follow
									</Text>
								</TouchableOpacity>
							) : (
								<TouchableOpacity onPress={() => FollowReq()}>
									<Text
										style={{
											color: "#FFFFFF",
											fontSize: 18,
											fontWeight: "400",
											padding: 5,
											paddingLeft: 10,
											paddingRight: 10,
											width: "100%",
											height: 40,
											paddingTop: 10,
										}}
									>
										Unfollow
									</Text>
								</TouchableOpacity>
							)}
						</View>
					)}

					<View style={{ alignItems: "center", paddingRight: 40 }}>
						<TouchableOpacity>
							<FontAwesome name="edit" size={30} color="black" />
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
						{name}'s Posts
					</Text>

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

export default FollowScreen;

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
		top: 50,
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
