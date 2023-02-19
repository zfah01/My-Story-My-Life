import React, { useState, useEffect } from 'react';
import { ImageBackground, TouchableOpacity, ScrollView, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

// Imports the documents styling.
import { journalStyles } from './Styles';

// Imports firestore from firebase to save user entries to the firstore database.
//import firestore from '@react-native-firebase/firestore';
import { db } from '../../firebase/firebase';

export default function Timeline(props) {
    // Gets all of the data currently stored in firebase for the speicifc user for use on the calnedar.
    const [allData, setAllData] = useState([]);
    // Creates a reference to the journals and hrList collections in firestore to read data.
    const journalRef = db.collection('journalList');
    // Gets the users ID from props passed in from App.js.
    const userID = props.extraData.id;

    // Generates a list of all the dates from allData.
    const allDates = [];
    // Generates a list of all the moods from allData.
    const allMoods = [];
    // Generates a list of all the obsessions from allData.
    const allObsessions = [];
    const [obsession, setObsession] = useState('');


    const [time, setTime] = useState('');
    const [desc, setDesc] = useState('');
    // Changes the render based on if a user has interacted with the calendar.
    const [entryPressed, setEntryPressed] = useState(false);

    // Gets and stores both journal and heart rate data.
    const getJournals = async () => {
        journalRef
            .where('authorID', '==', userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newData = [];
                    querySnapshot.forEach(doc => {
                        const userData = doc.data();
                        userData.id = doc.id;
                        newData.push(userData);
                    });
                    setAllData(newData);
                },
                error => {
                    console.error(error);
                });
    };
    

    // Gets all data from firebase where the signed in user ID matches the authorID and pushes the data to the allData array.
    useEffect(() => {
        getJournals();
    }, []);

    // For loop that adds the dates, moods and obsessions from allData to their own arrays.
    for (let i = 0; i < allData.length; i++) {
        allDates.push(allData[i].moodCalendarDate);
        allMoods.push(allData[i].moodSelected);
        allObsessions.push(allData[i].obsessionText);
    }

    // REFERENCE ACCESSED 08/12/2021 https://github.com/wix/react-native-calendars/issues/160#issuecomment-408405419
    // Used to learn how to make the calendar load a list of dates.

    // Turns dates into objects that can be used with the calendar to be displayed.
    let allDatesObject = {};
    // Variables that are used to display data to the user.
    let selectedMood = '';
    let selectedObsession = '';

    let selectedDesc = '';
    let selectedTime = '';

    // For each day in allDates array, cycle through the day, select the mood colour and add the current day to the calendar.
    allDates.forEach((day) => {
        // Checks if the day is the same as the date and then adds the mood for the date to the calendar.
        for (let i = 0; i < allMoods.length; i++) {
            if (day === allDates[i]) {
                selectedMood = allMoods[i];
            }
        }
        // Checks if the day is the same as the date and then adds the obsession for the date to the calendar.
        // Adds a mark to the calendar.
        for (let i = 0; i < allObsessions.length; i++) {
            if (day === allDates[i]) {
                selectedObsession = allObsessions[i];
            }
        }

        allDatesObject[day] = {
            selected: true,
            marked: selectedObsession === '' ? false : selectedObsession == null ? false : true,
            selectedColor: selectedMood === 'Happy' ? '#108206' : selectedMood === 'Meh' ? '#e38e07' : selectedMood === 'Sad' ? '#112dec' : selectedMood === 'Angry' ? '#f90505' : '#000000',
        };
    });
    // END REFERENCE

    const displayObsessionsAndHeartRate = (day) => {
        for (let i = 0; i < allObsessions.length; i++) {
            if (day.dateString === allDates[i]) {
                selectedObsession = allObsessions[i];
                    if (selectedDesc === '' || selectedDesc == null) {
                        setTime('');
                        setDesc('');
                        break;
                    } else {
                        setTime(selectedTime);
                        setDesc(selectedDesc);
                        break;
                    }
                }
                if (selectedObsession === '' || selectedObsession == null) {
                    setObsession('');
                    break;
                } else {
                    setObsession(selectedObsession);
                    break;
                }
            }
        setEntryPressed(true);
    };

    return (
        <View>
            {/* Checks if a user has pressed on a calendar entry to display the data. */}
            {entryPressed ? (
                <View style={journalStyles.popupMainContainer}>
                    <View style={[journalStyles.contentContainer, { padding: 25 }]}>
                        <Text style={journalStyles.popupTitle}>Your Daily Obsession: </Text>
                        <Text style={journalStyles.obsessionText}>{obsession} </Text>

                        <View style={journalStyles.popupContainer}>
                            <Text style={journalStyles.popupTitle}>Time of Entry: </Text>
                            <Text style={journalStyles.popupText}>{time} </Text>
                        </View>
                        <View style={journalStyles.popupContainer}>
                            <Text style={journalStyles.popupTitle}>Description: </Text>
                            <Text style={journalStyles.popupText}>{desc}</Text>
                        </View>

                        <TouchableOpacity onPress={() => setEntryPressed(false)} >
                            <Text style={journalStyles.buttonText}> {'>'} Return to Calendar </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={journalStyles.contentContainer}>
                    <ScrollView>
                        <Text style={journalStyles.title}> Your Mood Journal at a glance: </Text>

                        {/* REFERENCE ACCESSED 08/12/2021 https://github.com/wix/react-native-calendars 
                         Used third party calendar dependency to be able to highlight specific dates that correspond to a users mood.*/}
                        <Calendar
                            current={Date.current}
                            minDate={'2015-01-01'}
                            enableSwipeMonths={true}
                            markedDates={allDatesObject}
                            // When a specific day is pressed it dispays the obsession if it exists.
                            onDayPress={(day) => displayObsessionsAndHeartRate(day)}
                            testID='calendarID'
                        />
                        {/* END REFERENCE */}
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={journalStyles.keyContainer} >
                                <Text testID='keyID' style={journalStyles.keyTitle}>Mood Key:</Text>
                                <View style={journalStyles.keyContainer2}>
                                    <View style={[journalStyles.keyIndivContainer, { marginRight: 10 }]}>
                                        <Text style={journalStyles.contentText}>Happy:</Text>
                                        <Text style={[journalStyles.keyBackground, { backgroundColor: '#108206' }]} />
                                    </View>
                                    <View style={[journalStyles.keyIndivContainer, { marginRight: 20 }]}>
                                        <Text style={journalStyles.contentText}>Meh:</Text>
                                        <Text style={[journalStyles.keyBackground, { backgroundColor: '#e38e07' }]} />
                                    </View>
                                </View>
                                <View style={journalStyles.keyContainer2}>
                                    <View style={journalStyles.keyIndivContainer}>
                                        <Text style={journalStyles.contentText}> Sad: </Text>
                                        <Text style={[journalStyles.keyBackground, { backgroundColor: '#112dec', marginLeft: 8 }]} />
                                    </View>
                                    <View style={[journalStyles.keyIndivContainer, { paddingLeft: 10, paddingRight: 20 }]}>
                                        <Text style={journalStyles.contentText}>Angry:</Text>
                                        <Text style={[journalStyles.keyBackground, { backgroundColor: '#f90505' }]} />
                                    </View>
                                </View>
                            </View>
                            <Text style={journalStyles.contentText}>If a date is marked, then an obsession has been set. Press on the date to display it!</Text>
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}