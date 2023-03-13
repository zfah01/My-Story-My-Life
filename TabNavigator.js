import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';

// The icon package for the tab bar.
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Importing all of the different components for each different page.
import Home from './screens/Home/Home';
import AddNewEntry from './screens/Memories/AddNewEntry';
import Diary from './screens/Memories/Diary';
import Timeline from './screens/Timeline/Timeline';
import Contacts from './screens/Contacts/Contacts';


// Variable that is used to create all of the tabs required for the navigation bar.
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator(props) {

    // Creates a variable of the current user data to parse through each component.
    const userData = props.extraData;
    // Parses the logout function for use within the settings page.
    const logout = props.logout;

    return (
        // The Navigation bar creation tag that sets the default tab to 'home', adds tint styling for when an
        // option is selected and returns the user to the home tab if back is pressed from any tab other than home,
        // where the application will close. 


        <Tab.Navigator
            initialRouteName='Home'
            backBehavior='initialRoute'
            screenOptions={{
                'tabBarStyle': [
                    {
                        'display': 'flex',
                        'tabBarActiveTintColor': '#448aff',
                    },
                    null]
            }} >
            <Tab.Screen
                name='Home'
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        {/* Adds custom styling for center button to be bigger and circular. */ },
                        
                            <MaterialCommunityIcons name='home' color={color} size={size} />
                        
                    )
                }} >
                {props => <Home {...props} extraData={userData} logout={logout} />}
            </Tab.Screen>

            <Tab.Screen
                name='Diary' 
                style={styles.diary}
                options={{
                    tabBarLabel: 'Diary',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='book' color={color} size={size} />) // Sets the icon to the default color and size.
                }} >
                {/* Sets the component whilst parsing in the user data. */}
                {props => <Diary {...props} extraData={userData} />}
            </Tab.Screen>

            <Tab.Screen
                name='Add an Entry'
                style={styles.add}
                options={{
                    headerShown: false,
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size }) => (
                        <View style={styles.addButton}>
                        <MaterialCommunityIcons name='plus-circle' color={"#34A56F"} size={63} />
                        </View>)
                }} >
                {props => <AddNewEntry {...props} extraData={userData} />}
            </Tab.Screen>

          

            <Tab.Screen
                name='Timeline'
                options={{
                    tabBarLabel: 'Timeline',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='calendar-multiselect' color={color} size={size} />)
                }} >
                {props => <Timeline {...props} extraData={userData} />}
            </Tab.Screen>

            <Tab.Screen
                name='Contacts'
                options={{
                    headerShown: false,
                    tabBarLabel: 'Contacts',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='email' color={color} size={size} />)
                }} >
                {props => <Contacts {...props} extraData={userData} />}
            </Tab.Screen>

        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        bottom: 5,
        height: 58,
        width: 58,
        borderRadius: 58,
        justifyContent: 'center',
        alignItems: 'center',
    },
    add: {
        marginTop: 2,

    },
});