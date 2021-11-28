import React, { useEffect, useState } from "react";
import {
	Alert,
	Button,
	SafeAreaView,
	StyleSheet,
	Text,
	Image,
	View,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import logo from "../assets/Google.png";
import Icon from "../assets/iconLogo.png";
import { db, auth } from "../firebase";
import { IOScrollView, InView } from "react-native-intersection-observer";

const GoogleScreen = ({ navigation }) => {
	const [data, setData] = useState();
	const user = auth.currentUser;
	const [True, setTrue] = useState(false);

	useEffect(() => {
		if (user) {
			navigation.replace("Nav");
		}
	}, [user]);

	// console.log(data, "data");
	// console.log(user);

	useEffect(() => {
		if (True) {
			db.collection("users")
				.doc(user?.uid)
				.collection("profile")
				.doc("name")
				.onSnapshot((snapshot) => setData(snapshot.data()?.name));
		}
	}, []);

	// useEffect(() => {
	// db.collection("users")
	// 	.doc(user?.uid)
	// 	.collection("profile")
	// 	.doc("name")
	// 	.onSnapshot((snapshot) => setData(snapshot.data()?.name));

	// const setData = (data) => {
	// 	if (data) {
	// 		console.log(data);
	// 		auth.onAuthStateChanged((user) => {
	// 			console.log(user, "user");
	// 			if (user && data == undefined) {
	// 				navigation.replace("LoginEdit");
	// 			} else if (user && data != undefined) {
	// 				navigation.replace("Nav");
	// 			}
	// 		});
	// 	}
	// };

	useEffect(() => {
		if (user) {
			auth.onAuthStateChanged((user) => {
				console.log(user, "user");
				if (user) {
					navigation.replace("Nav");
				}
			});
		}
	}, []);

	if (user && data) {
		auth.onAuthStateChanged((user) => {
			if (user && data == undefined) {
				navigation.replace("LoginEdit");
			} else if (user) {
				navigation.replace("Nav");
			}
		});
	}

	// console.log("fire", data);
	// }, [user, user?.uid, True, !data]);

	// if (True) {
	// 	db.collection("users")
	// 		.doc(user?.uid)
	// 		.collection("profile")
	// 		.doc("name")
	// 		.onSnapshot((snapshot) => setData(snapshot.data()?.name));
	// }

	// if (data == undefined) {
	// 	db.collection("users")
	// 		.doc(user?.uid)
	// 		.collection("profile")
	// 		.doc("name")
	// 		.onSnapshot((snapshot) => setData(snapshot.data()?.name));
	// }

	// useEffect(() => {
	// 	if (user && !data) {
	// 		auth.onAuthStateChanged((user) => {
	// 			if (user && data == undefined) {
	// 				navigation.replace("LoginEdit");
	// 			} else if (user) {
	// 				navigation.replace("Nav");
	// 			}
	// 		});
	// 	}
	// }, []);

	const login = (result) => {
		var credential = firebase.auth.GoogleAuthProvider.credential(
			result.idToken,
			result.accessToken
		);
		auth
			.signInWithCredential(credential)
			.then(() => {
				auth.onAuthStateChanged((user) => {
					console.log(user, "user");
					if (user) {
						navigation.replace("Nav");
					}
					// db.collection("users")
					// 	.doc(user?.uid)
					// 	.collection("profile")
					// 	.doc("name")
					// 	.onSnapshot((snapshot) => setData(snapshot.data()?.name));
					// if (data == undefined) {
					// 	navigation.replace("LoginEdit");
					// } else if (data && user) {
					// 	navigation.replace("Nav");
					// }

					// unsubscribe();
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const signInWithGoogleAsync = async () => {
		console.log("done");
		try {
			const result = await Google.logInAsync({
				androidClientId:
					"764782688883-j7hgigoecfo72ihg7anfiac5hc7donki.apps.googleusercontent.com",
				iosClientId:
					// "764782688883-r3t2rejdn28e40sv70r03s6tbpvsrarl.apps.googleusercontent.com",
					"971674320564-epso5m0cgcurlaqof0vfn30pivnff77e.apps.googleusercontent.com",

				scopes: ["profile", "email"],
			});

			if (result.type === "success") {
				login(result);
				return result.accessToken;
			} else {
				return { cancelled: true };
			}
		} catch (e) {
			return { error: true };
		}
	};

	return (
		<SafeAreaView style={{ paddingTop: 40 }}>
			<View style={styles.welcomeContainer}>
				<Text style={{ fontSize: 30 }}>Welcome To Collections</Text>
			</View>

			<View style={{ top: 50 }}>
				<Image source={Icon} />
			</View>

			<View
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: 20,
					top: -80,
				}}
			>
				<Text style={{ fontSize: 13, fontWeight: "400", color: "#3D84B8" }}>
					Safe and easy to Use presenting the
				</Text>
				<Text style={{ color: "#0274B1", fontSize: 20 }}> New Collections</Text>
				<Text style={{ color: "#FCA6E9" }}>Danny</Text>
			</View>

			<TouchableOpacity onPress={() => signInWithGoogleAsync()}>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 30,
						backgroundColor: "#1BA5F2",
						padding: 5,
						width: Dimensions.get("window").width - 20,
						margin: 8,
						top: 20,
					}}
				>
					<Image source={logo} style={{ height: 40, width: 40 }} />
					<Text style={{ fontSize: 20, color: "#FFFFFF", paddingLeft: 20 }}>
						Signin With Google
					</Text>
				</View>
			</TouchableOpacity>
			{/* <IOScrollView>
				<InView onChange={(inView) => setTrue(true)}>
					<Text>.</Text>
				</InView>
			</IOScrollView> */}
		</SafeAreaView>
	);
};

export default GoogleScreen;

const styles = StyleSheet.create({
	welcomeContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
});
