import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { StyleSheet, View } from 'react-native';
import RNFirebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/functions';
import '@react-native-firebase/auth';
import { useSelector } from 'react-redux'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider, isEmpty} from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore' // <- needed if using firestore
import Home from 'screens/Home'
import ComposeRock from 'screens/ComposeRock'
import Login from 'screens/Login'
import ViewRock from 'screens/ViewRock'
import AuthLoaded from 'components/AuthLoaded'
import ContactSelector from 'components/ContactSelector'
import MessagingWrapper from 'components/MessagingWrapper'
import colors from 'styles/colors';
import rootReducer from 'reducers/rootReducer';

// react-redux-firebase config
const rrfConfig = {
 userProfile: 'users',
 useFirestoreForProfile: true,// Firestore for Profile instead of Realtime DB
}

// Initialize other services on firebase instance
RNFirebase.firestore() // <- needed if using firestore
RNFirebase.functions() // <- needed if using httpsCallable

// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
 firebase: RNFirebase,
 config: rrfConfig,
 dispatch: store.dispatch,
 createFirestoreInstance, // <- needed if using firestore
 // allowMultipleListeners: true,
}

const MainNav = createStackNavigator();
const ModalNav = createStackNavigator();
const screenOptions = {
  headerStyle: { backgroundColor: colors.mint },
}

const LoggedInStack = () => {
  return (
    <MainNav.Navigator
      initialRouteName="Home"
      screenOptions={screenOptions}
    >
      <MainNav.Screen
        name="Home"
        component={Home}
        options={{ title: 'My collection' }}
      />
      <MainNav.Screen
        name="ComposeRock"
        component={ComposeRock}
        options={{ title: 'Send a new rock' }}
      />
      <MainNav.Screen
        name="ViewRock"
        component={ViewRock}
        options={{ title: 'View rock' }}
      />
    </MainNav.Navigator>
  )
}
const LoggedOutStack = () => {
  return (
    <MainNav.Navigator initialRouteName="Login" screenOptions={screenOptions}>
      <MainNav.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login' }}
      />
    </MainNav.Navigator>
  )
}

const MainStack = () => {
  const auth = useSelector(state => state.firebase.auth)
  return isEmpty(auth) ? (
    <LoggedOutStack/>
  ) : (
    <MessagingWrapper>
      <ModalNav.Navigator
        mode="modal"
        screenOptions={screenOptions}
      >
        <ModalNav.Screen
          name="Main"
          component={LoggedInStack}
          options={{ headerShown: false }}
        />
        <ModalNav.Screen
          name="SelectContact"
          component={ContactSelector}
          options={{ title: 'Select contact', headerBackTitle: "Cancel" }}
        />
      </ModalNav.Navigator>
    </MessagingWrapper>
  );
}


const App = () => {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthLoaded>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </AuthLoaded>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;