import React, { useEffect, useState, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Image,
	Button,
	TouchableOpacity,
	TextInput,
	Alert,
	ImageBackground,
	ScrollView,
	KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../firebase";
import firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useCollection } from "react-firebase-hooks/firestore";
import danger from "../assets/danger.png";
import Svg, { Path } from "react-native-svg";
import spinner from "../assets/Wedges.gif";
import { Animated } from "react-native";

const ProfileEditScreen = ({ navigation }) => {
	const [image, setImage] = useState(null);
	const user = auth.currentUser;
	const imageName = `${user?.uid}`;
	const [profileUri, setProfileUri] = useState(null);
	const [profileName, setProfileName] = useState("");
	const [name, setName] = useState("");
	const [cover, setCover] = useState(null);
	const [coverDataUri, setCoverDataUri] = useState(null);
	const [check, setCheck] = useState();
	const [id, setId] = useState();
	const [toUpdateUri, setToUpdateUri] = useState();

	useEffect(() => {
		const userLikesRef = db
			.collection("allUserNames")
			.where("names", "array-contains", name);
		setCheck(userLikesRef);

		db.collection("allUserNames")
			.where("uid", "==", user.uid)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					console.log(doc.id, " => ", doc.data());
					setId(doc.id);
				});
			});

		return () => {
			userLikesRef;
		};
	}, [name]);

	const [likesSnapshot, loading] = useCollection(check);

	const userLikeExist = (Name) =>
		!!likesSnapshot?.docs.find((allUserName) =>
			allUserName.data(
				(names) => names.find((name) => name === Name)?.length > 0
			)
		);

	const setUniqueUserName = () => {
		// console.warn("setUnique");

		if (!userLikeExist(name)) {
			db.collection("users")
				.doc(user?.uid)
				.collection("profile")
				.doc("name")
				.set({
					name: name,
				});

			if (id) {
				console.warn(id);
				db.collection("allUserNames")
					.doc(id)
					.set({
						names: [name],
						uid: user.uid,
					});
			}

			if (!id) {
				console.warn("no id");
				db.collection("allUserNames").add({
					names: [name],
					uid: user.uid,
				});
			}
		}
		setName("");
		setId();
	};

	useEffect(() => {
		db.collection("all")
			.where("uid", "==", user.uid)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					// console.log(doc.id, " => ", doc.data());
					setToUpdateUri(doc.data()?.displayPic);
					// setToUpdateDocId(doc.id);
					updatedb([doc.id]);
				});
			});

		const updatedb = (docId) => {
			// console.log(docId[0], "dcv");
			if (profileUri != toUpdateUri) {
				if (toUpdateUri) {
					// db.collection("all")
					// 	.where("uid", "==", user.uid)
					// 	.onSnapshot((snapshot) => {
					// 		snapshot.docChanges().forEach((change) => {
					// 			if (change.type === "modified") {
					// 				console.log("Modified city: ", change.doc.data());
					// 			}
					db.collection("all").doc(docId[0]).update({ displayPic: profileUri });
					// });
					// });
				}
			}
		};
	}, [profileUri, toUpdateUri]);

	useEffect(() => {
		const unsubscribe = async () => {
			if (Platform.OS !== "web") {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== "granted") {
					alert("Sorry, we need camera roll permissions to make this work!");
				}
			}
		};

		return unsubscribe;
	}, []);

	const pickImage = async () => {
		console.warn("press pick");
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};
	const pickCoverImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			setCover(result.uri);
		}
	};

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

		console.log("rep");
	}, []);

	const handleUploadProfile = async () => {
		const response = await fetch(image);
		const blob = await response.blob();

		var ref = storage
			.ref()
			.child("Profiles/" + imageName)
			.put(blob)
			.then(() => {
				storage
					.ref()
					.child("Profiles/" + imageName)
					.getDownloadURL()
					.then((url) => {
						db.collection("users")
							.doc(user.uid)
							.collection("profile")
							.doc("profile")
							.set({
								uri: url,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							});
					});
				Alert.alert("success");
				setImage(null);
			});
	};

	const handleCoverPic = async () => {
		const response = await fetch(cover);
		const blob = await response.blob();

		var ref = storage
			.ref()
			.child("CoverPictures/" + imageName)
			.put(blob)
			.then(() => {
				storage
					.ref()
					.child("CoverPictures/" + imageName)
					.getDownloadURL()
					.then((url) => {
						db.collection("users")
							.doc(user.uid)
							.collection("profile")
							.doc("cover")
							.set({
								coverUri: url,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							});
					});
				Alert.alert("success");
				setCover(null);
			});
	};

	const signout = () => {
		auth.signOut().then(() => {
			navigation.replace("Login");
		});
	};

	return (
		<SafeAreaView style={{ backgroundColor: "#FFFFFFF" }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={50}
			>
				<ScrollView>
					{!cover ? (
						<View
							style={{
								borderRadius: 25,
								height: 50,
								width: 50,
								zIndex: 1,
								position: "absolute",
								// backgroundColor: "#5598E9",
								right: 0,
								marginTop: 10,
								paddingRight: 30,
								top: 20,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<TouchableOpacity onPress={pickCoverImage}>
								<LinearGradient
									// colors={["#4c669f", "#3b5998", "#192f6a"]}
									colors={[
										"rgba(225,225,225,0.3)",
										"rgba(225,225,225,0.3)",
										"rgba(225,225,225,0.3)",
										// "transparent",
									]}
									style={{
										borderRadius: 25,
										height: 50,
										width: 50,
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<View
										style={{
											borderRadius: 30,
											height: 40,
											width: 40,
											zIndex: 1,
											justifyContent: "center",
											alignItems: "center",
											blurRadius: 2,
										}}
									>
										<Feather name="edit-2" size={24} color="black" />
									</View>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					) : (
						<View
							style={{
								borderRadius: 25,
								height: 50,
								width: 50,
								zIndex: 1,
								position: "absolute",
								right: 0,
								marginTop: 10,
								paddingRight: 30,
								top: 20,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<TouchableOpacity onPress={handleCoverPic}>
								<LinearGradient
									// colors={["#4c669f", "#3b5998", "#192f6a"]}
									colors={[
										"rgba(225,225,225,0.3)",
										"rgba(225,225,225,0.3)",
										"rgba(225,225,225,0.3)",
										// "transparent",
									]}
									style={{
										borderRadius: 25,
										height: 50,
										width: 50,
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<View
										style={{
											borderRadius: 30,
											height: 40,
											width: 40,
											zIndex: 1,
											justifyContent: "center",
											alignItems: "center",
											blurRadius: 2,
										}}
									>
										<AntDesign name="clouduploado" size={24} color="black" />
									</View>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					)}

					<View>
						{/* <View></View> */}
						{!cover ? (
							<ImageBackground
								source={{
									uri: coverDataUri,
								}}
								style={styles.ImageBackground}
							/>
						) : (
							<ImageBackground
								source={{
									uri: cover,
								}}
								style={styles.ImageBackground}
							/>
						)}
					</View>
					<View style={styles.container}>
						<Text
							style={{
								fontSize: 25,
								fontWeight: "500",
								color: "#232323",
								marginBottom: 10,
							}}
						>
							Profile
						</Text>

						{image ? (
							<Image source={{ uri: image }} style={styles.image} />
						) : (
							<Image
								style={styles.image}
								source={{
									uri: profileUri,
								}}
							/>
						)}
						{image ? (
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										marginTop: 10,
										backgroundColor: "#5598E9",
										borderRadius: 5,
										marginLeft: 15,
									}}
								>
									<TouchableOpacity onPress={handleUploadProfile}>
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
											Done
										</Text>
									</TouchableOpacity>
								</View>
								<Feather
									name="edit-2"
									size={24}
									color="gray"
									style={{ paddingLeft: 10, paddingTop: 10 }}
								/>
							</View>
						) : (
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										marginTop: 10,
										backgroundColor: "#5598E9",
										borderRadius: 5,
										marginLeft: 15,
									}}
								>
									<TouchableOpacity onPress={pickImage}>
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
											Edit
										</Text>
									</TouchableOpacity>
								</View>
								<Feather
									name="edit-2"
									size={24}
									color="gray"
									style={{ paddingLeft: 10, paddingTop: 10 }}
								/>
							</View>
						)}
					</View>

					<View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								paddingTop: 20,
								paddingBottom: 30,
							}}
						>
							<Text style={{ fontSize: 20, fontWeight: "400" }}>Name: </Text>
							{/* {loading && <Text>loading</Text>} */}
							{loading ? (
								<Image source={spinner} style={{ height: 30, width: 30 }} />
							) : (
								<Text style={{ height: 30, width: 30 }}> </Text>
							)}
							<TextInput
								placeholder={profileName?.toString()}
								placeholderTextColor="green"
								style={{
									height: 40,
									backgroundColor: "whitesmoke",
									borderRadius: 30,
									flex: 0.8,
									paddingLeft: 10,
								}}
								value={name}
								onChangeText={(text) => setName(text)}
							/>
							<TouchableOpacity onPress={setUniqueUserName}>
								<Feather
									name="edit-2"
									size={24}
									color="gray"
									style={{ paddingLeft: 10, paddingTop: 10 }}
									// onPress={handleprofilename}
								/>
							</TouchableOpacity>
						</View>
						<View>
							{userLikeExist(name) ? (
								<View
									style={{
										display: "flex",
										justifyContent: "center",
										flexDirection: "row",
										alignItems: "center",
										marginTop: -50,
									}}
								>
									<Text style={{ color: "red" }}>username not available </Text>
									<Image style={{ height: 20, width: 20 }} source={danger} />
								</View>
							) : (
								<View
									style={{
										display: "flex",
										justifyContent: "center",
										flexDirection: "row",
										alignItems: "center",
										marginTop: -50,
									}}
								>
									{/* <Text style={{ color: "red" }}>
										{loading && <Text>loading</Text>}
									</Text> */}
									{/* {!loading && (
										<Image source={spinner} style={{ height: 30, width: 30 }} />
									)} */}
								</View>
							)}
						</View>
					</View>

					{/* {error && <Text>{JSON.stringify(error)}</Text>} */}
					{/* {loading && <Text>loading</Text>} */}
					<View
						style={
							({
								display: "flex",
								flexDirection: "row",
							},
							{ transform: [{ translateX: 170 }] })
						}
					>
						<TouchableOpacity
							onPress={() => navigation.replace("Profile")}
							style={{
								backgroundColor: "#5598E9",
								borderRadius: 10,
								width: "20%",
								height: 40,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
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
								Done
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
	container: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	containerView: {
		flex: 1,
	},
	image: {
		height: 120,
		width: 120,
		borderRadius: 60,
	},
	ImageBackground: {
		height: 300,
		width: Dimensions.get("window").width,
	},
});
