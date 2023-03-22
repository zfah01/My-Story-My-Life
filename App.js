import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Welcome from './screens/Login/Welcome';
import CreateAccount from './screens/Login/CreateAccount';
import OnboardingScreen from './screens/Login/OnboardingScreen';
import {auth, db} from './firebase/firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default function App() {

    //Initiate States
    const [user, setUser] = useState(null);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    let routeName = "Onboarding";

   //If user is logged in then their data is saved to the state to be used throughout the application 
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
    

    //Log out function to log user out of their account
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

    //Checks to see if it is the first time that a user is launching the app
    useEffect(() => {
		AsyncStorage.getItem("alreadyLaunched").then((value) => {
			if (value == null) {
				AsyncStorage.setItem("alreadyLaunched", "true");
				setIsFirstLaunch(true);
			} else {
				setIsFirstLaunch(false);
			}
		});
	}, []);

	if (isFirstLaunch === null) {
		return null;
	} else if (isFirstLaunch === true) {
		routeName = "Onboarding";
	} else {
		routeName = "Welcome";
	}

    //User is taken to the application if they exist else they are taken to Welcome Page 
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
        <>
                    <Stack.Screen name='HomeScreen' >
                        {props => <TabNavigator {...props} extraData={user} logout={logout} />}
                    </Stack.Screen>
            <Stack.Screen name='Welcome' component={Welcome} />
            </>
                ) : (
                    <> 
                        <Stack.Screen name='Onboarding' component={OnboardingScreen} />
                        <Stack.Screen name='Welcome' component={Welcome} />
                        <Stack.Screen name='CreateAccount' component={CreateAccount} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
