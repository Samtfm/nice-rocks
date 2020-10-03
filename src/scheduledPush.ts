var PushNotification = require("react-native-push-notification");
import { queueNewRock } from 'reducers/newRocksReducer';
import { RootState } from 'reducers/rootReducer';

export const NEW_ROCKS_PUSH_ID = '123456789';

const trunc = (str: string, chars: number) => {
  if (str.length <= chars) {
    return str;
  } else {
    return str.slice(0, chars-3) + '...'
  }
}

export const setOrUpdateScheduledPush = (state: RootState) => {
  // clear any old scheduled push
  PushNotification.cancelAllLocalNotifications()
  // PushNotification.cancelLocalNotifications({id: NEW_ROCKS_PUSH_ID});
  const {settings: {disableAll, enableInstantRocks}} = state

  if (disableAll || enableInstantRocks ) { return }

  const { rocks, nextNotifDateTime } = state.newRocks
  if (nextNotifDateTime && nextNotifDateTime > Date.now()) {
    const date = new Date(nextNotifDateTime)
    if (rocks.length === 1) {
      const rock = rocks[0]
      PushNotification.localNotificationSchedule({
        title: rock.fromDisplayName,
        message: rock.title,
        date: date,
        id: NEW_ROCKS_PUSH_ID,
        data: {
          type: 'new-rock',
          profileId: rock.toUserId,
          rockId: rock.id,
          local: true,
        },
        allowWhileIdle: true,
      })    
    } else if (rocks.length > 1) {
      PushNotification.localNotificationSchedule({
        title: `New rocks to explore!`,
        message: `"${trunc(rocks[0].title, 30)}" and ${rocks.length-1} more`,
        date: date,
        id: NEW_ROCKS_PUSH_ID,
        data: {
          type: 'new-rocks',
          local: true,
        },
        allowWhileIdle: true,
      })    
    }
  }
}

export const handleIncomingDataPush = (enableInstantRocks: boolean, dispatch: (action: any) => void, data: any) => {
  if (data.type === 'new-rock-data') {
    const { fromDisplayName, profileId, rockId, rockTitle } = data
    if (enableInstantRocks) {
      PushNotification.localNotification({
        title: data.fromDisplayName,
        message: data.rockTitle,
        data: {
          type: 'new-rock',
          profileId: data.profileId,
          rockId: data.rockId,
          local: true,
        },
        allowWhileIdle: true,
      })    
    } else {
      dispatch(queueNewRock({toUserId: profileId, id: rockId, title: rockTitle, fromDisplayName}))
    }
  }
}