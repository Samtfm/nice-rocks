import React from 'react';
import RockDetails from 'components/RockDetails.component'
import { StyleSheet, ScrollView, View } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const ViewRock = ({ route }) => {
  const { rockId, toUserId } = route.params
  const collectionPath = `profiles/${toUserId}/rocks`
  useFirestoreConnect(() => [{collection: collectionPath, doc: rockId}])
  const rock = useSelector(
    ({ firestore: { data } }) => {
      return data[collectionPath] && data[collectionPath][rockId]
    }
  )
  return (
    <View style={{flex:1, padding: 10}}>
      <ScrollView >
        {<RockDetails {...rock} />}
      </ScrollView>
    </View>
  );
}

export default ViewRock;