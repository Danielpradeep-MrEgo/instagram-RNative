import React, { useEffect, useState, useRef } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
	Image,
	SafeAreaView,
	Button,
	TextInput,
	ImageBackground,
	Alert,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import capture from "../assets/circle.png";
import photo from "../assets/photo.png";
import flipCamera from "../assets/rotate.png";
import flashOn from "../assets/flash2.png";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { auth, db, storage } from "../firebase";
import firebase from "firebase";

const CameraScreen = ({ navigation }) => {
	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [previewVisible, setPreviewVisible] = useState(null);
	const [flashMode, setFlashMode] = useState("off");
	const user = auth.currentUser;
	const imageName = `${user?.uid}`;
	const [profileUri, setProfileUri] = useState(null);
	const [profileName, setProfileName] = useState("");
	const [name, setName] = useState([]);
	const [input, setInput] = useState("");

	const [image, setImage] = useState(null);

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
	}, [profileName, profileUri]);

	useEffect(() => {
		(async () => {
			if (Platform.OS !== "web") {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== "granted") {
					alert("Sorry, we need camera roll permissions to make this work!");
				}
			}
		})();
	}, []);

	const setCustomId = (customId, customData) => {
		db.collection("all").doc(customId).set({
			uri: customData.uri,
			comment: customData.comment,
			name: customData.name,
			displayPic: customData.displayPic,
			uid: user.uid,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});

		Alert.alert("success doc");
		setImage(null);
		setPreviewVisible(null);
		setInput("");
	};

	const pickImage = async () => {
		// let result = await ImagePicker.launchImageLibraryAsync();
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.all,
			allowsEditing: true,
			// aspect: [4, 3],
			// quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}

		setName({ profileName: profileName, profileUri: profileUri });
	};

	const find = image?.indexOf("ImagePicker");
	const slice = image?.slice(find);

	const findCam = previewVisible?.indexOf("Camera");
	const sliceCam = previewVisible?.slice(findCam);

	const handleUpload = async () => {
		const response = await fetch(image);
		const blob = await response.blob();

		var ref = storage
			.ref()
			.child("posts/" + slice)
			.put(blob)
			.then(() => {
				storage
					.ref()
					.child("posts/" + slice)
					.getDownloadURL()
					.then((url) => {
						db.collection("users")
							.doc(user.uid)
							.collection("posts")
							.add({
								uri: url,
								comment: input,
								name: name.profileName,
								displayPic: name.profileUri
									? name.profileUri
									: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							});
					});
			});

		var ref = storage
			.ref()
			.child("posts/" + slice)
			.put(blob)
			.then(() => {
				storage
					.ref()
					.child("posts/" + slice)
					.getDownloadURL()
					.then((url) => {
						db.collection("users")
							.doc(user.uid)
							.collection("posts")
							.where("uri", "==", url)
							.get()
							.then((querySnapshot) => {
								querySnapshot.forEach((doc) => {
									const customId = doc.id;
									const customData = doc.data();
									setCustomId(customId, customData);
								});
							})
							.catch((error) => {
								console.log(error);
							});
					});
			});
	};

	const handleCameraUpload = async () => {
		const response = await fetch(previewVisible);
		const blob = await response.blob();

		var ref = storage
			.ref()
			.child("posts/" + sliceCam)
			.put(blob)
			.then(() => {
				storage
					.ref()
					.child("posts/" + sliceCam)
					.getDownloadURL()
					.then((url) => {
						db.collection("users")
							.doc(user.uid)
							.collection("posts")
							.add({
								uri: url,
								comment: input,
								name: name.profileName,
								displayPic: name.profileUri
									? name.profileUri
									: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							});
					});
			});

		var ref = storage
			.ref()
			.child("posts/" + sliceCam)
			.put(blob)
			.then(() => {
				storage
					.ref()
					.child("posts/" + sliceCam)
					.getDownloadURL()
					.then((url) => {
						db.collection("users")
							.doc(user.uid)
							.collection("posts")
							.where("uri", "==", url)
							.get()
							.then((querySnapshot) => {
								querySnapshot.forEach((doc) => {
									const customId = doc.id;
									const customData = doc.data();
									setCustomId(customId, customData);
								});
							})
							.catch((error) => {
								console.log(error);
							});
					});
			});
	};

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}
	<Camera
		ref={(ref) => {
			camera = ref;
		}}
	/>;
	let camera = Camera;

	const handleFlashMode = () => {
		if (flashMode === "on") {
			setFlashMode("off");
		} else if (flashMode === "off") {
			setFlashMode("on");
		} else {
			setFlashMode("auto");
		}
	};

	const snap = async () => {
		if (camera) {
			let photo = await camera.takePictureAsync();
			const image = photo.uri;
			setPreviewVisible(photo.uri);
		}
	};

	const reset = () => {
		setPreviewVisible(null);
		setImage(null);
	};
	return (
		<>
			{previewVisible || image ? (
				<SafeAreaView>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "none",
							position: "absolute",
							top: 10,
							zIndex: 1,
							padding: 15,
						}}
					>
						<LinearGradient
							// colors={["#4c669f", "#3b5998", "#192f6a"]}
							colors={[
								"rgba(225,225,225,0.3)",
								"rgba(225,225,225,0.3)",
								"rgba(225,225,225,0.3)",
								// "transparent",
							]}
							style={{
								borderRadius: 20,
								height: 40,
								width: 40,
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
								<Ionicons
									name="chevron-back-circle-outline"
									size={24}
									color="black"
									onPress={reset}
								/>
							</View>
						</LinearGradient>
					</View>

					{!image ? (
						<Button
							title="post came"
							style={{
								position: "absolute",
								bottom: 0,
								backgroundColor: "transparent",
							}}
							onPress={handleCameraUpload}
						/>
					) : (
						<Button
							title="post"
							style={{
								position: "absolute",
								bottom: 0,
								backgroundColor: "transparent",
							}}
							onPress={handleUpload}
						/>
					)}
					{!image ? (
						<ImageBackground
							source={{ uri: previewVisible }}
							style={styles.bigView}
						/>
					) : (
						<ImageBackground source={{ uri: image }} style={styles.bigView} />
					)}

					<View
						style={{
							backgroundColor: "yellow",
							zIndex: 1,
							flex: 1,
							position: "absolute",
							// bottom: 0,
							top: 70,
							// marginBottom: 80,
						}}
					>
						<TextInput
							placeholder="add a comment"
							value={input}
							onChangeText={(text) => setInput(text)}
						/>
					</View>
				</SafeAreaView>
			) : (
				<View style={styles.container}>
					<Camera
						style={styles.camera}
						type={type}
						flashMode={flashMode}
						// showGallery={true}
						ratio={"16:9"}
						ref={(ref) => {
							camera = ref;
						}}
					></Camera>
					<View style={styles.buttonContainer}>
						{/* <BlurView
							intensity={90}
							style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}
							tint={"default"}
						>
							<Text>Hello! I am bluring contents underneath</Text>
						</BlurView> */}
						<TouchableOpacity
							style={styles.button}
							onPress={() => {
								setType(
									type === Camera.Constants.Type.back
										? Camera.Constants.Type.front
										: Camera.Constants.Type.back
								);
							}}
						>
							<Image source={flipCamera} style={styles.filp} />
						</TouchableOpacity>

						<TouchableOpacity style={styles.capture} onPress={snap}>
							<Image source={capture} style={styles.captureImage} />
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} onPress={handleFlashMode}>
							<Image source={flashOn} style={styles.flash} />
						</TouchableOpacity>
						<TouchableOpacity style={styles.button} onPress={pickImage}>
							<Image source={photo} style={styles.flash} />
						</TouchableOpacity>
					</View>
				</View>
			)}
		</>
	);
};

export default CameraScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		height: Dimensions.get("window").height,
	},

	text: {
		color: "white",
	},
	bigView: {
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width,
	},
	back: {
		position: "absolute",
		// top: 70,
		bottom: 70,
		backgroundColor: "white",
		width: "20%",
	},
	// cameraContainer: {
	// 	flex: 1,
	// 	flexDirection: "row",
	// 	height: Dimensions.get("window").height,
	// },
	fixedRatio: {
		flex: 1,
		aspectRatio: 1,
	},

	capture: {
		bottom: 0,
	},

	captureImage: {
		height: 100,
		width: 100,
	},

	filp: {
		height: 40,
		width: 40,
	},

	flash: {
		height: 30,
		width: 30,
	},
	buttonContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		bottom: 200,
		alignItems: "center",
	},
});
