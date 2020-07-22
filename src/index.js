import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { StyleSheet, Text, View } from 'react-native';
import rootReducer from 'reducers/rootReducer';
import RNFirebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux'
import { createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider, firebaseReducer, isEmpty} from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import Home from 'screens/Home'
import ComposeRock from 'screens/ComposeRock'
import Login from 'screens/Login'
import ViewRock from 'screens/ViewRock'
import AuthLoaded from 'components/AuthLoaded.component'


// https://rnfirebase.io/reference/app/firebaseappoptions
const fbConfig = {
  androidClientId: undefined, // iOS only
  apiKey: "AIzaSyCyjvCW1nT4qQszuOf0N42Umw3wMWh6SYQ",
  appId: "1:342705485686:android:98b6ee6c26ed1d04deac57",
  clientId: undefined, // iOS only
  databaseURL: "https://nice-rocks.firebaseio.com",
  deepLinkURLScheme: undefined, // iOS only
  gaTrackingId: undefined,
  messagingSenderId: "342705485686",
  projectId: "nice-rocks",
  storageBucket: "nice-rocks.appspot.com",
}

// react-redux-firebase config
const rrfConfig = {
 userProfile: 'users',
 useFirestoreForProfile: true,// Firestore for Profile instead of Realtime DB
}

// Initialize firebase instance
if (RNFirebase.apps.length == 0){
  RNFirebase.initializeApp(fbConfig)
}

// Initialize other services on firebase instance
RNFirebase.firestore() // <- needed if using firestore
// firebase.functions() // <- needed if using httpsCallable

// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
 firebase: RNFirebase,
 config: rrfConfig,
 dispatch: store.dispatch,
 createFirestoreInstance, // <- needed if using firestore
}

const Stack = createStackNavigator();

const Screens = () => {
  const auth = useSelector(state => state.firebase.auth)
  return isEmpty(auth) ? (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login!' }}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'Welcome!' }}
      />
      <Stack.Screen
        name="ComposeRock"
        component={ComposeRock}
        options={{ title: 'Send a new Rock!' }}
      />
      <Stack.Screen
        name="ViewRock"
        component={ViewRock}
        options={{ title: 'View Rock!' }}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthLoaded>
          <NavigationContainer>
            <Screens />
          </NavigationContainer>
        </AuthLoaded>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
