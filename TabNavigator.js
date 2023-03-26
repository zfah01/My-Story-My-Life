import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import all Screens
import Home from './screens/Home/Home';
import AddLifeEvent from './screens/Memories/AddLifeEvent';
import Timeline from './screens/Memories/Timeline';
import MoodCalendar from './screens/MoodCalendar/MoodCalendar';
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
                        
                    },
                    null]
            }} >
            <Tab.Screen
                name='Home'
                options={{
                    headerShown: false,
                    tabBarLabel: ({ focused }) => {
                        let label;
                        return label = focused ? <Text style={{fontSize: 10, color: "#34A56F"}}>Home</Text> : null
                      },
                    tabBarIcon: ({ focused }) => (
                        
                            <MaterialCommunityIcons name='home' color={focused ? "#34A56F" : "#808080"} size={25} />
                        
                    )
                }} >
                {props => <Home {...props} extraData={userData} logout={logout} />}
            </Tab.Screen>

            <Tab.Screen
                name='Timeline' 
                style={styles.diary}
                options={{
                    tabBarLabel: ({ focused }) => {
                        let label;
                        return label = focused ? <Text style={{fontSize: 10, color: "#34A56F"}}>Timeline</Text> : null
                      },
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name='timeline-outline' color={focused ? "#34A56F" : "#808080"}  size={25} />) 
                }} >
                {/* Sets the component whilst parsing in the user data. */}
                {props => <Timeline {...props} extraData={userData} />}
            </Tab.Screen>

            <Tab.Screen
                name='Add an Entry'
                style={styles.add}
                options={{
                    headerShown: false,
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.addButton}>
                        <MaterialCommunityIcons name='plus-circle' color={"#34A56F"} size={63} />
                        </View>)
                }} >
                {props => <AddLifeEvent {...props} extraData={userData} />}
            </Tab.Screen>

          

            <Tab.Screen
                name='MoodCalendar'
                options={{
                    headerShown: false,
                    tabBarLabel: ({ focused }) => {
                        let label;
                        return label = focused ? <Text style={{fontSize: 10, color: "#34A56F"}}>Calendar</Text> : null
                      },
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name='calendar-multiselect' color={focused ? "#34A56F" : "#808080"}  size={25} />)
                }} >
                {props => <MoodCalendar {...props} extraData={userData} />}
            </Tab.Screen>

            <Tab.Screen
                name='Contacts'
                options={{
                    headerShown: false,
                    tabBarLabel: ({ focused }) => {
                        let label;
                        return label = focused ? <Text style={{fontSize: 10, color: "#34A56F"}}>Contacts</Text> : null
                      },
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name='email' color={focused ? "#34A56F" : "#808080"}  size={25} />)
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