import React, { ReactElement } from 'react';
import ReceivedRocks from 'screens/ReceivedRocks'
import SentRocks from 'screens/SentRocks'
import ArchivedRocks from 'screens/ArchivedRocks'
import ComposeButton from 'components/ComposeButton'
import { StyleSheet, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from 'styles/colors';

const Tab = createMaterialBottomTabNavigator();

const Home = (): ReactElement => {

  return (
    <View style={{flex:1}}>
      <Tab.Navigator
        initialRouteName="Received"
        activeColor={colors.primaryDark}
        inactiveColor={colors.gray60}
        barStyle={{ backgroundColor: 'white', /* elevation: 0, */ }}
      >
        <Tab.Screen
          name="Archive"
          component={ArchivedRocks}
          options={{
            tabBarLabel: 'Archive',
            tabBarIcon: ({ color }: {color: string}) => (
              <Icon style={styles.icon} name={'archive'} color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Received"
          component={ReceivedRocks}
          options={{
            tabBarLabel: 'Received',
            tabBarIcon: ({ color }: {color: string}) => (
              <Icon style={styles.icon} name={'home'} color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Sent"
          component={SentRocks}
          options={{
            tabBarLabel: 'Sent',
            tabBarIcon: ({ color }: {color: string}) => (
              <Icon style={styles.icon} name={'cube-send'} color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
      <ComposeButton />
    </View>
  );
}
const styles = StyleSheet.create({
  icon: {
    width: 60,
    alignSelf: 'flex-start',
  }
})

export default Home;
