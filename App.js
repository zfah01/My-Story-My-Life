import React, { useState, useEffect } from 'react';

// Importing all of the different components for each different page.
import Welcome from './screens/Login/Welcome';
import CreateAccount from './screens/Login/CreateAccount';

//Imports auth and firestore from firebase.
//import auth from '@react-native-firebase/auth';
//import firestore from '@react-native-firebase/firestore';

import {auth, db} from './firebase/firebase';

// Importing Navigation Container to allow the navigation bar to function correctly.
import { NavigationContainer } from '@react-navigation/native';
// Imports the createStackNavigator from react navigation.
import { createStackNavigator } from '@react-navigation/stack';
// Imports the Tab Bar so that when a user logs in, they will be directed to the home page with the tab navigation.
import TabNavigator from './TabNavigator';

//Variable that is used to create a stack navigator to direct the user between the login screen and the rest of the application.
const Stack = createStackNavigator();

export default function App() {

    // Used to learn firebase authentication and keep a persistent user.
    const [user, setUser] = useState(null);

    // Checks to see if user is already logged in and if true, saves the users data to the state for use in rest of the application.
    // This then sets loading to false to display the page that should be returned.
    // If there is an error at anypoint within finding the user, loading is set to false and the user is returned to the welcome screen,
    // where they can reneter their login details.
    useEffect(() => {
        const usersRef = db.collection('users');
        auth.onAuthStateChanged(user => {
            if (user) {
                usersRef
                    .doc(user.uid)
                    .get()
                    .then((document) => {
                        const userData = document.data();
                        setUser(userData);
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            }
        });
    }, []);
    // END REFERENCE

    // Creates a log out function to log the user out of their account and return them to the welcome page.
    const logout = () => {
        auth.signOut().then(() => {
            setUser(null);
            alert('You have been logged out');
            return (
                <Welcome />
            );
        }).catch(() => {
            // 
        });
    };

    // If there is a user, take the user to the application else got to the welcome page.
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name='HomeScreen' >
                        {props => <TabNavigator {...props} extraData={user} logout={logout} />}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen name='Welcome' component={Welcome} />
                        <Stack.Screen name='CreateAccount' component={CreateAccount} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}