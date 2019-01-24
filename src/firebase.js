// @flow
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseApp = firebase.initializeApp({
  apiKey: process.env.ZENPORT_FIREBASE_API_KEY,
  databaseURL: `https://${process.env.ZENPORT_FIREBASE_PROJECT_ID || ''}.firebaseio.com`,
  projectId: process.env.ZENPORT_FIREBASE_PROJECT_ID,
});

firebaseApp.database();

export default firebaseApp;
