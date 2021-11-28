import firebase from "firebase/app";

import "firebase/auth";
//import "firebase/database";
import "firebase/firestore";
//import "firebase/functions";
import "firebase/storage";

const firebaseConfig = {
	// apiKey: "AIzaSyCH9h0OdUSgdqVVwJDIxGAILh1BvlmZac8",
	// authDomain: "users-9aca1.firebaseapp.com",
	// databaseURL: "https://users-9aca1.firebaseio.com",
	// projectId: "users-9aca1",
	// storageBucket: "users-9aca1.appspot.com",
	// messagingSenderId: "764782688883",
	// appId: "1:764782688883:web:3424a918a682b29f4f0806",
	// measurementId: "G-CTTG9DZYNB",

	apiKey: "AIzaSyBR_sros5F0T7xIVwTz2s1_X-iCwqLdJOY",
	authDomain: "fir-9ec3a.firebaseapp.com",
	projectId: "fir-9ec3a",
	storageBucket: "fir-9ec3a.appspot.com",
	messagingSenderId: "971674320564",
	appId: "1:971674320564:web:5cadf268c9a92c262721e1",
};

let app;

if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
const google = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { db, auth, google, storage };
