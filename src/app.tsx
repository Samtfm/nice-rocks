import 'react-native-gesture-handler';
import React, { ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RNFirebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/functions';
import '@react-native-firebase/auth';
import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore' // <- needed if using firestore
import AuthLoaded from 'components/AuthLoaded'
import colors from 'styles/colors';
import { persistor, store } from 'reducers/rootReducer';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ActivityIndicator, Platform, UIManager } from 'react-native';
import { navigationRef, isReadyRef } from './RootNavigation';
import MainStack from 'nav/MainStack';
import IsShareExtensionContext from 'IsShareExtensionContext';
import { PersistGate } from 'redux-persist/integration/react';
import { initNotifHandlers } from 'notificationHandlers';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  fonts: { 
    ...DefaultTheme.fonts,
    // regular: { // somehow all this did was change the footer font, so commented out for now
    //   fontFamily: 'Bitter-Regular',
    //   fontWeight: 'normal' as const,
    // },
  },
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.blue,
  },
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// react-redux-firebase config
const rrfConfig = {
 userProfile: 'users',
 useFirestoreForProfile: true,// Firestore for Profile instead of Realtime DB
}

// Initialize other services on firebase instance
RNFirebase.firestore() // <- needed if using firestore
RNFirebase.functions() // <- needed if using httpsCallable

const rrfProps = {
 firebase: RNFirebase,
 config: rrfConfig,
 dispatch: store.dispatch,
 createFirestoreInstance, // <- needed if using firestore
 // allowMultipleListeners: true,
}

initNotifHandlers()

const App = (): ReactElement => {
  React.useLayoutEffect(() => {
    return () => {
      isReadyRef.current = false
    };
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator size="large" color={colors.blue} style={{flex: 1}}/>} persistor={persistor}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <PaperProvider theme={theme}>
            <AuthLoaded>
              <NavigationContainer ref={navigationRef} onReady={() => {isReadyRef.current = true;}}>
                <MainStack />
              </NavigationContainer>
            </AuthLoaded>
          </PaperProvider>
        </ReactReduxFirebaseProvider>
      </PersistGate>
    </Provider>
  );
}

export const MainApp = () => {
  return (
    <IsShareExtensionContext.Provider value={false}>
      <App/>
    </IsShareExtensionContext.Provider>
  );
}
export const ShareApp = () => {
  return (
    <IsShareExtensionContext.Provider value={true}>
      <App/>
    </IsShareExtensionContext.Provider>
  );
}