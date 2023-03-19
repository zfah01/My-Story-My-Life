import React, { useEffect, useState, useRef} from 'react';
import { Text, View, Button, Platform } from 'react-native';

//import from firebase
import { db, auth } from "../../firebase";
import { doc, getDoc, onSnapshot, query, where, getDocs, collection } from 'firebase/firestore';

//import push notifications
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

const PushNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const [reminderHour, setReminderHour] = useState('00');
    const [reminderMinutes, setReminderMinutes] = useState('00');

    const [isEnabled, setIsEnabled] = useState(false);
    //const [notifId, setNotifId] = useState('');

    const [hourString, setHourString] = useState('');
    const [minutesString, setMinutesString] = useState('');
  
    const [reminderId, setReminderId] = useState('reminder');

     //gets reminder on component mount
      useEffect(() => {
        const q = query(collection(db, "reminder"), where("reminderEmail", "==", auth.currentUser.email));

        console.log("working now");

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            querySnapshot.docChanges().forEach(change => {

              const docReminder = doc.data();

              //set time text
              setHourString(docReminder.hour);
              setMinutesString(docReminder.minutes);
    
              //set integer time
              const hourValue = parseInt(docReminder.hour);
              const minutesValue = parseInt(docReminder.minutes);
              
              setReminderHour(hourValue);
              setReminderMinutes(minutesValue);
              setIsEnabled(docReminder.isEnabled);
    
              if(isEnabled) {
                const notifyUser = schedulePushNotification(reminderHour, reminderMinutes, hourString, minutesString);
                console.log("Notification Scheduled: " + notifyUser);
               }
               if(!isEnabled) {
                Notifications.cancelAllScheduledNotificationsAsync()
               }

            });


        });
        return unsubscribe;
        });
    }, [])

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);



}

export default PushNotifications;

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
  
  //function to schedule daily reminder
  async function schedulePushNotification(hours, minutes, hourString, minutesString) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Reminder:" + hourString + ":" + minutesString,
        body: "Remember to log in your life stories",
        sound: 'default',
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
    console.log("notif id on scheduling",id)
    console.log("Hours: " + hours);
    console.log("Minutes: " + minutes);
    return id;
  }