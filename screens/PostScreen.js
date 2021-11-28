import React, { useEffect, useState, useRef, useCallback } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
	TouchableHighlight,
	Button,
	TouchableOpacity,
	ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import { AntDesign } from "@expo/vector-icons";
import { useCollection } from "react-firebase-hooks/firestore";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { TapGestureHandler } from "react-native-gesture-handler";
const AnimatedImage = Animated.createAnimatedComponent(Image);
import heart from "../assets/heart.png";

const PostScreen = ({
	name,
	id,
	postUri,
	displayPic,
	comment,
	navigation,
	userUid,
}) => {
	const user = auth.currentUser;
	const [like, setLike] = useState([]);
	const [check, setCheck] = useState();
	const [commentCount, setCommentCount] = useState([]);
	const [toUpdateName, setToUpdateName] = useState();
	const [updatedRef, setUpdatedRef] = useState();
	const [updateDocId, setToUpdateDocId] = useState([]);
	const [likeTap, setLikeTap] = useState("false");

	// if (likeTap === "true") {
	// 	setTimeout(() => {
	// 		setLikeTap("false");
	// 	}, 3000);
	// }

	const uid = user?.uid;
	useEffect(() => {
		db.collection("allUserNames")
			.where("uid", "==", user?.uid)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					// console.log(doc.id, " => ", doc.data());
					setUpdatedRef(doc.data()?.names.toString());
				});
			});
	}, []);

	useEffect(() => {
		db.collection("all")
			.where("uid", "==", user?.uid)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					// console.log(doc.id, " => ", doc.data());
					setToUpdateName(doc.data()?.name.toString());
					setToUpdateDocId(doc.id);
					updatedb([doc.id]);
				});
			});

		const updatedb = (docId) => {
			// console.log(docId[0], "dcv");
			if (updatedRef != toUpdateName) {
				if (toUpdateName) {
					// db.collection("all")
					// 	.where("uid", "==", user.uid)
					// 	.onSnapshot((snapshot) => {
					// 		snapshot.docChanges().forEach((change) => {
					// 			if (change.type === "modified") {
					// 				console.log("Modified city: ", change.doc.data());
					// 			}
					db.collection("all").doc(docId[0]).update({ name: updatedRef });
					// });
					// });
				}
			}
		};
	}, [updatedRef, toUpdateName]);

	useEffect(() => {
		const userLikesRef = db
			.collection("allLikes")
			.doc(id)
			.collection("likes")
			.where("likes", "==", uid);
		setCheck(userLikesRef);
	}, []);

	const [likesSnapshot] = useCollection(check);

	const userLikeExist = (uid) =>
		!!likesSnapshot?.docs.find((like) =>
			like.data((likes) => likes.find((like) => like === uid)?.length > 0)
		);

	const setPostsId = () => {
		if (!userLikeExist(uid)) {
			console.warn(id);
			db.collection("allLikes").doc(id).collection("likes").add({
				likes: user.uid,
			});
		}
	};

	// const setGraphicLikeIdSingle = () => {
	// 	if (likeTap === "true2") {
	// 		setGraphicLikeId(id);
	// 		console.warn("true2");
	// 	}
	// };

	// const setGraphicLikeId = () => {
	// 	if (!userLikeExist(uid)) {
	// 		db.collection("allLikes")
	// 			.doc(id)
	// 			.collection("likes")
	// 			.add({
	// 				likes: [user.uid],
	// 			});
	// 	}
	// };
	// if (likeTap == "true2") {
	// 	setTimeout(() => {
	// 		setLikeTap("false");
	// 	}, 3000);
	// }

	const deletePost = (deleteDoc) => {
		db.collection("allLikes")
			.doc(id)
			.collection("likes")
			.doc(deleteDoc)
			.get()
			.then((doc) => {
				doc.ref.delete();
			});
	};

	useEffect(() => {
		db.collection("allLikes")
			.doc(id)
			.collection("likes")
			.onSnapshot((snapshot) =>
				setLike(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
			);

		db.collection("allComments")
			.doc(id)
			.collection("comments")
			.onSnapshot((snapshot) =>
				setCommentCount(
					snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
				)
			);
	}, [id]);

	const scale = useSharedValue(0);
	const opacity = useSharedValue(1);

	const doubleTapRef = useRef();

	const rStyle = useAnimatedStyle(() => ({
		transform: [{ scale: Math.max(scale.value, 0) }],
	}));

	const rTextStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const onDoubleTap = useCallback(() => {
		scale.value = withSpring(1, undefined, (isFinished) => {
			if (isFinished) {
				scale.value = withDelay(500, withSpring(0));
			}
		});
		setPostsId(id);
		// setGraphicLikeId();
		// setLikeTap("true2");
	}, []);
	const onSingleTap = useCallback(() => {
		opacity.value = withTiming(0, undefined, (isFinished) => {
			if (isFinished) {
				opacity.value = withDelay(500, withTiming(1));
			}
		});
		// setLikeTap("true");
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.postcard__container}>
				<View style={styles.postcard}>
					<View style={styles.postcard__headerIcons}>
						<View style={styles.post__avatar}>
							<Image
								style={styles.image}
								source={{
									uri: displayPic,
								}}
							/>
							{/* <Text>{likeTap}</Text> */}

							<View>
								<Text
									style={styles.userName}
									onPress={() =>
										navigation.navigate("Follow", { displayPic, name, userUid })
									}
								>
									{name}
								</Text>
								<Text style={styles.location}>location</Text>
							</View>
						</View>

						<View id="scroll">
							<MaterialCommunityIcons
								name="dots-horizontal-circle-outline"
								size={24}
								color="black"
							/>
						</View>
					</View>

					<View style={styles.postcard__imageContainer}>
						<TouchableHighlight>
							<TapGestureHandler
								waitFor={doubleTapRef}
								onActivated={onSingleTap}
							>
								<TapGestureHandler
									maxDelayMs={250}
									ref={doubleTapRef}
									numberOfTaps={2}
									onActivated={onDoubleTap}
								>
									<Animated.View>
										<ImageBackground
											source={{ uri: postUri }}
											style={styles.postcard__image}
										>
											<AnimatedImage
												source={heart}
												style={[
													styles.image,
													{
														shadowOffset: { width: 0, height: 20 },
														shadowOpacity: 0.35,
														shadowRadius: 35,
													},
													rStyle,
												]}
												resizeMode={"center"}
											/>
										</ImageBackground>
									</Animated.View>
								</TapGestureHandler>
							</TapGestureHandler>
						</TouchableHighlight>
					</View>

					<View style={styles.postcard__bottom}>
						<View style={styles.postcard__iconsLeft}>
							{!userLikeExist(uid) ? (
								<TouchableNativeFeedback onPress={() => setPostsId(id)}>
									<AntDesign name="hearto" size={28} color="black" />
								</TouchableNativeFeedback>
							) : (
								<TouchableNativeFeedback onPress={() => setPostsId(id)}>
									<AntDesign
										name="heart"
										size={28}
										color="red"
										onPress={() =>
											db
												.collection("allLikes")
												.doc(id)
												.collection("likes")
												.where("likes", "array-contains", uid)
												.get()
												.then((querySnapshot) => {
													querySnapshot.forEach((doc) => {
														console.log(doc.id);
														deletePost(doc.id);
													});
												})
										}
									/>
								</TouchableNativeFeedback>
							)}

							<TouchableNativeFeedback
								onPress={() =>
									navigation.navigate("Comments", {
										id,
										name,
										displayPic,
										comment,
									})
								}
							>
								<Ionicons
									name="ios-chatbubble-outline"
									size={30}
									color="black"
									style={{ paddingLeft: 20 }}
								/>
							</TouchableNativeFeedback>

							<MaterialCommunityIcons
								name="send-circle-outline"
								size={32}
								color="black"
								style={{ paddingLeft: 20 }}
							/>
						</View>
						<Feather name="bookmark" size={30} color="black" />
					</View>
					<View
						key={id}
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							paddingTop: 10,
							paddingLeft: 10,
						}}
					>
						<Text style={{ fontSize: 20, fontWeight: "bold" }}>
							{like.length} likes
						</Text>
					</View>
					{comment ? (
						<View>
							<View
								key={id}
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									paddingTop: 10,
									paddingLeft: 6,
								}}
							>
								<Text
									style={{ fontSize: 16, fontWeight: "bold", paddingLeft: 5 }}
								>
									{name}{" "}
								</Text>
								<Text style={{ fontSize: 16 }}>{comment}</Text>
							</View>
							<Text style={{ color: "gray", paddingLeft: 10, paddingTop: 5 }}>
								View all {commentCount.length} comments
							</Text>
						</View>
					) : (
						<View></View>
					)}
				</View>
			</View>
		</View>
	);
};

export default PostScreen;

const styles = StyleSheet.create({
	container: {},
	postcard__container: {
		borderBottomColor: "lightgray",
		borderBottomWidth: 1,
		marginBottom: 20,
	},
	postcard: {
		padding: 20,
		backgroundColor: "#FFFFFF",
	},
	postcard__headerIcons: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	post__avatar: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	postcard__image: {
		height: Dimensions.get("window").width,
		width: "100%",
		borderRadius: 10,
		resizeMode: "cover",
		justifyContent: "center",
		alignItems: "center",
	},
	postcard__imageContainer: {
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 30,
	},

	image: {
		height: 50,
		width: 50,
		borderRadius: 30,
	},
	userName: {
		fontWeight: "bold",
		fontSize: 15,
		paddingLeft: 10,
	},
	location: {
		paddingLeft: 10,
	},
	postcard__bottom: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	postcard__iconsLeft: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 10,
		width: "70%",
	},
	square: {
		// position: "absolute",
		zIndex: 1,
		top: 160,
		left: 140,
		alignItems: "center",
		justifyContent: "center",
		opacity: 0,
	},
	squarelite: {
		zIndex: 1,
		top: 160,
		left: 140,
		alignItems: "center",
		justifyContent: "center",
	},
});
