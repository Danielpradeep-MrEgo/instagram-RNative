import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
// import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import * as GoogleSignIn from "expo-google-sign-in";
import * as AppAuth from 'expo-app-auth';
const { URLSchemes } = AppAuth;

const LoginScreen = () => {
	const [user, setUser] = useState();
	useEffect(() => {
		initAsync();
	});

	const initAsync = async () => {
		await GoogleSignIn.initAsync({
			// You may ommit the clientId when the firebase `googleServicesFile` is configured
			clientId:
				"764782688883-j7hgigoecfo72ihg7anfiac5hc7donki.apps.googleusercontent.com",
		});
		syncUserWithStateAsync();
	};

	const syncUserWithStateAsync = async () => {
		const user = await GoogleSignIn.signInSilentlyAsync();
		setUser(user);
	};

	const signOutAsync = async () => {
		await GoogleSignIn.signOutAsync();
		setUser(null);
	};

	const signInAsync = async () => {
		try {
			await GoogleSignIn.askForPlayServicesAsync();
			const { type, user } = await GoogleSignIn.signInAsync();
			if (type === "success") {
				syncUserWithStateAsync();
			}
		} catch ({ message }) {
			alert("login: Error:" + message);
		}
	};

	const onPress = () => {
		if (user) {
			signOutAsync();
		} else {
			signInAsync();
		}
	};

	return (
		<SafeAreaView>
			<Text style={{ paddingTop: 40 }} onPress={onPress}>
				Toggle Auth
			</Text>
		</SafeAreaView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({});

// keytool -list -v -keystore C:\Users\YOURUSERPROFILENAME\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
