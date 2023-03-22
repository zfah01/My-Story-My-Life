import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import all Screens
import Home from './screens/Home/Home';
import AddNewEntry from './screens/Memories/AddNewEntry';
import Diary from './screens/Memories/Diary';
import Timeline from './screens/Timeline/Timeline';
import Contacts from './screens/Contacts/Contacts';


// Set tab navigator 
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator(props) {

    // Prop for user data 
    const userData = props.extraData;

    // Prop to allow user to use logout
    const logout = props.logout;

    return (

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
                        <MaterialCommunityIcons name='book' color={color} size={size} />) 
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
                    headerShown: false,
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