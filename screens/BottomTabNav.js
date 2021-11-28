import React from "react";
import { Image, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import camera from "../assets/camera8.png";
import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "./SearchScreen";
import ProfileScreen from "./ProfileScreen";
import HomeLoginEditScreen from "./HomeLoginEditScreen";
import ProfileEditScreen from "./ProfileEditScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabNav = () => {
	return (
		<View style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={{ flex: 1, zIndex: 999 }}
				// behavior={Platform.OS === "ios" ? "padding" : "height"}
				behavior={Platform.OS === "ios" ? "" : "height"}
				keyboardVerticalOffset={-90}
			>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							if (route.name === "Home") {
								return focused ? (
									<MaterialIcons name="home" size={24} color="black" />
								) : (
									<MaterialIcons name="home" size={24} color="gray" />
								);
							} else if (route.name === "Search") {
								return focused ? (
									<EvilIcons name="search" size={24} color="black" />
								) : (
									<EvilIcons name="search" size={24} color="gray" />
								);
							} else if (route.name === "Camera") {
								return focused ? (
									<View style={styles.imageContainer}>
										<Image source={camera} style={styles.image} />
									</View>
								) : (
									<View style={styles.imageContainer}>
										<Image source={camera} style={styles.image} />
									</View>
								);
							} else if (route.name === "Notification") {
								return focused ? (
									<Ionicons
										name="notifications-circle"
										size={24}
										color="black"
									/>
								) : (
									<Ionicons
										name="notifications-circle-outline"
										size={24}
										color="gray"
									/>
								);
							} else if (route.name === "Profile") {
								return focused ? (
									<Ionicons name="person" size={24} color="black" />
								) : (
									<Ionicons name="person" size={24} color="gray" />
								);
							}
						},
					})}
					tabBarOptions={{
						activeTintColor: "black",
						inactiveTintColor: "gray",
						tabBarVisible: false,
					}}
				>
					<Tab.Screen name="Home" component={HomeScreen} />
					<Tab.Screen name="Search" component={SearchScreen} />
					<Tab.Screen name="Camera" component={CameraScreen} />
					<Tab.Screen name="Notification" component={SearchScreen} />
					<Tab.Screen name="Profile" component={ProfileScreen} />
					{/* <Tab.Screen name="ProfileEdit" component={ProfileEditScreen} /> */}
				</Tab.Navigator>
			</KeyboardAvoidingView>
		</View>
	);
};

export default BottomTabNav;

const styles = StyleSheet.create({
	imageContainer: {
		height: 70,
		width: 70,
		borderRadius: 35,
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 15,
	},
	image: {
		height: 50,
		width: 50,
	},
});
