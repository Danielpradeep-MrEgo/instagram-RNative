import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomTabNav from "./screens/BottomTabNav";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import GoogleScreen from "./screens/GoogleScreen";
import ProfileEditScreen from "./screens/ProfileEditScreen";
import CommentsScreen from "./screens/CommentsScreen";
import PostScreen from "./screens/PostScreen";
import HomeLoginEditScreen from "./screens/HomeLoginEditScreen";
import userChats from "./screens/userChats";
import FollowScreen from "./screens/FollowScreen";
import AddChatScreen from "./screens/AddChatScreen";

const Stack = createStackNavigator();

function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator headerMode="none">
					<Stack.Screen name="Login" component={GoogleScreen} />
					<Stack.Screen name="Nav" component={BottomTabNav} />
					<Stack.Screen name="Chat" component={ChatScreen} />
					<Stack.Screen name="Profile" component={ProfileScreen} />
					<Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
					<Stack.Screen name="Post" component={PostScreen} />
					{/* <Stack.Screen name="LoginEdit" component={HomeLoginEditScreen} /> */}
					<Stack.Screen name="Comments" component={CommentsScreen} />
					<Stack.Screen name="Userchat" component={userChats} />
					<Stack.Screen name="Follow" component={FollowScreen} />
					<Stack.Screen name="AddChat" component={AddChatScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

export default App;
