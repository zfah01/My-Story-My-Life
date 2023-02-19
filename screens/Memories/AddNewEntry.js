import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TextInput, TouchableOpacity, ScrollView, Image, Keyboard } from 'react-native';

// Imports the documents styling.
import { entryStyles } from './Styles';

// Imports firestore from firebase to save user entries to the firstore database.
//import firestore from '@react-native-firebase/firestore';
import { db, timestamp } from '../../firebase/firebase';
import { FontAwesome5 } from '@expo/vector-icons';


export default function AddNewEntry(props) {

    // Initializing the state so that when a user selects a mood, it is outlined to show they have selected it.
    const [angry, setAngry] = useState(false);
    const [sad, setSad] = useState(false);
    const [meh, setMeh] = useState(false);
    const [happy, setHappy] = useState(false);

    // Initializing the state so that once a user has entered all of their details it can be stored to the firestore database.
    const [journalEntry, setJournalEntry] = useState('');
    const [usefulDate, setUsefulDate] = useState(null);
    const [displayDate, setDisplayDate] = useState(null);
    const [entryMood, setEntryMood] = useState('');
    const [obsession, setObsession] = useState('');

    // Creates a reference to the journal list collection in firestore to save data.
    const journalsRef = db.collection('journalList');
    // Gets the users ID from props passed in from App.js.
    const userID = props.extraData.id;

    useEffect(() => {
        // Gets the current date and creates an object on how to display the date.
        const date = new Date();
        const displayOptions = { day: 'numeric', month: 'long', year: 'numeric' };

        // Displays the date on the component in a nice format.
        const displayDateOfEntry = date.toLocaleDateString('en-US', displayOptions);
        setDisplayDate(displayDateOfEntry);

        // Takes the date in ISO format to be saved to the firestore databse and be displayed on the mood calendar.
        const usefulDateOfEntry = date.toISOString().split('T')[0];
        setUsefulDate(usefulDateOfEntry);

    }, []);


    // On submission, checks if there is an input for journal entry, then creates a timestamp and collects the userID,
    // mood, date, and jorunal entry to be stored in the firestore databse, then clears the fields and notifies the user if
    // the upload was successful or if an error occurs.
    const onSubmitButtonPress = () => {

        if (journalEntry && journalEntry.length > 0) {
            const data = {
                authorID: userID,
                moodSelected: entryMood,
                journalText: journalEntry,
                obsessionText: obsession,
                moodCalendarDate: usefulDate,
                dateOfEntry: displayDate,
                createdAt: timestamp
            };
            journalsRef
                .add(data)
                .then(() => {
                    Keyboard.dismiss();

                    setJournalEntry('');
                    setEntryMood('');
                    setObsession('');
                    setAngry(false);
                    setSad(false);
                    setMeh(false);
                    setHappy(false);

                    alert('Entry Successfully Added');

                })
                .catch((error) => {
                    alert('Error: ' + error);
                });
        }
        //END REFERENCE
    };

    // ---------- Functions to set the user mood ----------
    // Used to highlight the users mood as well as set the mood to the state.
    const isAngry = () => {
        if (!angry) {
            setAngry(true);
            setSad(false);
            setMeh(false);
            setHappy(false);
            setEntryMood('Angry');
        }
    };
    const isSad = () => {
        if (!sad) {
            setAngry(false);
            setSad(true);
            setMeh(false);
            setHappy(false);
            setEntryMood('Sad');
        }
    };
    const isMeh = () => {
        if (!meh) {
            setAngry(false);
            setSad(false);
            setMeh(true);
            setHappy(false);
            setEntryMood('Meh');
        }
    };
    const isHappy = () => {
        if (!happy) {
            setAngry(false);
            setSad(false);
            setMeh(false);
            setHappy(true);
            setEntryMood('Happy');
        }
    };

    return (
        <View style={entryStyles.mainContainer}>
        <View style={entryStyles.contentContainer}>
            <ScrollView>
                <Text style={entryStyles.header}>How are you feeling today?</Text>

                <View style={entryStyles.moodModules}>

                    <TouchableOpacity style={angry ? entryStyles.moodModSelected : entryStyles.moodModUnselected} onPress={isAngry} >
                     <FontAwesome5 name="angry" style={entryStyles.moodFaces} />
                        <Text>Angry</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={sad ? entryStyles.moodModSelected : entryStyles.moodModUnselected} onPress={isSad}>
                    <FontAwesome5 name="sad-tear" style={entryStyles.moodFaces} />
                        <Text>Sad</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={meh ? entryStyles.moodModSelected : entryStyles.moodModUnselected} onPress={isMeh}>
                    <FontAwesome5 name="meh" style={entryStyles.moodFaces} />
                        <Text>Meh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={happy ? entryStyles.moodModSelected : entryStyles.moodModUnselected} onPress={isHappy}>
                     <FontAwesome5 name="smile" style={entryStyles.moodFaces} />
                        <Text>Happy</Text>

                    </TouchableOpacity>
                </View>

                <View>
                    <Text style={entryStyles.subHeader}>Any comments for the day? </Text>
                    <TextInput style={entryStyles.journalEntry}
                        placeholder='Feel free to dump as much or as little information in here as you want. We wont judge you. We promise! '
                        numberOfLines={10}
                        multiline={true}
                        onChangeText={(text) => setJournalEntry(text)}
                        value={journalEntry}
                        testID='journalInput'
                    />
                    <Text style={entryStyles.subHeader}>Obsession of the day?</Text>
                    <TextInput style={entryStyles.obsessionEntry}
                        placeholder='Enter your random obsession here!'
                        numberOfLines={1}
                        multiline={true}
                        onChangeText={(text) => setObsession(text)}
                        value={obsession}
                        testID='obsessionInput'
                    />
                    <Text testID='dateID' style={entryStyles.date}>Todays Date: {displayDate}</Text>
                    <View style={entryStyles.submitButtonContainer}>
                        <TouchableOpacity style={entryStyles.submitButton} onPress={onSubmitButtonPress} accessibilityLabel='Submit Button' testID='submitBTN' >
                            <Text style={entryStyles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    </View>
    );
}