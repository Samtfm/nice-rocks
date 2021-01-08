import React, { ReactElement } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import ContactName from 'components/ContactName';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { Linking, StyleSheet, View } from 'react-native';
import colors from 'styles/colors';
import Avatar from 'components/Avatar';
import { Button, Drawer } from 'react-native-paper';
import { actionTypes } from 'redux-firestore'
import Text from 'components/Text';
import { useNavigation } from '@react-navigation/native';
import { versionName } from '../../../package.json';


interface DrawerContent{
  // The navigation state of the navigator, state.routes contains list of all routes
  state: any
  // The navigation object for the navigator.
  navigation: any
  // An descriptor object containing options for the drawer screens. The options can be accessed at descriptors[route.key].options.
  descriptors: any 
  // Reanimated Node that represents the animated position of the drawer (0 is closed; 1 is open).
  progress: any,
}
const DrawerContent = ({}: DrawerContent): ReactElement => {
  const userData = useSelector((state : RootState) => (state.firestore.data.userData));
  const uid = userData.id
  const messagingToken = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData.messagingToken;
    }
  )
  const remoteConfig = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.remoteConfig;
    }
  )

  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const clearToken = () => {
    const ref = { collection: 'users', doc: uid }
    return firestore.update(ref, {
      messagingToken: null,
    })
  }

  const logout = () => {
    firebase.messaging().getToken().then((myToken: string) => {
      const shouldClearTokenAfter = myToken == messagingToken
      firebase.messaging().deleteToken().catch(console.log).then(firebase.logout).then(() => {
        dispatch({ type: actionTypes.CLEAR_DATA })
        if (shouldClearTokenAfter) {
          clearToken()
        }
      })
    })
  }

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Avatar id={uid} size={45} />
        <ContactName style={{marginTop: 10, fontSize: 18}} id={uid} />
      </View>
      <Drawer.Item
        icon="settings"
        label="Settings"
        onPress={() => {
          navigation.navigate(
            'Settings',
          );
        }}
      />
      <Drawer.Item
        icon="alert-circle"
        label="Support"
        onPress={() => {
          navigation.navigate(
            'Support',
          );
        }}
      />
      <Drawer.Item
        icon="file-document-box"
        label="Privacy Policy"
        onPress={() => Linking.openURL(remoteConfig.privacyPolicyUrl)}
      />

      <View style={styles.spacer}></View>
      <Button
        onPress={logout}
        color={colors.primaryDark}
        style={styles.logoutButton}
      >
        Log Out
      </Button>
      <Text style={styles.versionCode}>{versionName /* nicerocksversion */}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
    backgroundColor: colors.primaryLight,
    paddingLeft: 20,
    paddingRight: 6,
    paddingTop: 20,
    paddingBottom: 20,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  versionCode: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    fontSize: 10,
  },
})
export default DrawerContent;