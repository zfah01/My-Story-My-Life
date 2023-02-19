import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';

// Imports the documents styling.
import { entryStyles } from './Styles';

// Imports firestore from firebase to display the selected user entry.
//import firestore from '@react-native-firebase/firestore';
import { db }from '../../firebase/firebase';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ViewSingleEntry(props) {

    // Initializing the state to save firestore fields to their corresponding variables for display.
    const [selectedMood, setSelectedMood] = useState('');
    const [journalEntry, setJournalEntry] = useState('');
    const [displayDate, setDisplayDate] = useState('');
    const [obsession, setObsession] = useState('');

    // Parses the userID from the entries list.
    const userID = props.extraData;
    // Parses the onBack method to return the user to the entries list when the back button is pressed.
    const onBack = props.onBack;
    //  Parses the entryID of the selected journal to ensure the correct image is displayed.
    const entryID = props.currentEntryID;


    // Creates a reference to the journal list collection in firestore to save data.
    const journalsRef = db.collection('journalList');

    // Selects the journal entry where the user ID matches the authorID and createdAt timestamp matches the current entry ID
    // and saves each field to its respectable variable to be displayed to the user when they select an entry to display.
    useEffect(() => {
        journalsRef
            .where('authorID', '==', userID)
            .where('createdAt', '==', entryID)
            .onSnapshot(
                querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        const journal = doc.data();
                        setSelectedMood(journal.moodSelected);
                        setJournalEntry(journal.journalText);
                        setDisplayDate(journal.dateOfEntry);
                        setObsession(journal.obsessionText);
                    });
                },
                error => {
                    console.error(error);
                }
            );
    }, []);

    return (
        <View style={entryStyles.contentContainer}>
        <ScrollView>
            <Text style={entryStyles.dateTitle}>Date of Entry: {displayDate} </Text>
            <Text style={entryStyles.header}>How you were feeling: </Text>

            <View style={entryStyles.moodModules}>
                <View style={selectedMood === 'Angry' ? entryStyles.moodModSelected : entryStyles.moodModUnselected} >
                <FontAwesome5 name="angry" style={entryStyles.moodFaces} />
                    <Text>Angry</Text>
                </View>
                <View style={selectedMood === 'Sad' ? entryStyles.moodModSelected : entryStyles.moodModUnselected}>
                <FontAwesome5 name="sad-tear" style={entryStyles.moodFaces} />
                    <Text>Sad</Text>
                </View>
                <View style={selectedMood === 'Meh' ? entryStyles.moodModSelected : entryStyles.moodModUnselected}>
                <FontAwesome5 name="meh" style={entryStyles.moodFaces} />
                    <Text>Meh</Text>
                </View>
                <View style={selectedMood === 'Happy' ? entryStyles.moodModSelected : entryStyles.moodModUnselected}>
                <FontAwesome5 name="smile" style={entryStyles.moodFaces} />
                    <Text>Happy</Text>
                </View>
            </View>

            <Text style={[{ textAlign: 'center' }, { color: selectedMood === 'Happy' ? '#108206' : selectedMood === 'Meh' ? '#e38e07' : selectedMood === 'Sad' ? '#112dec' : '#f90505' }]}>
                You were feeling: {selectedMood}
            </Text>
            <View>
                <Text style={entryStyles.subHeader}>Your comments for the day: </Text>
                <TextInput style={entryStyles.journalEntry}
                    placeholder='Feel free to dump as much or as little information in here as you want. We wont judge you at all. We promise! '
                    numberOfLines={5}
                    multiline
                    editable={false}
                    value={journalEntry}
                />

                <Text style={entryStyles.subHeader}>Obsession of the day?</Text>
                <TextInput style={entryStyles.obsessionEntry}
                    placeholder='Enter your random obsession here!'
                    numberOfLines={1}
                    multiline={true}
                    value={obsession}
                />
                <View style={entryStyles.returnButtonContainer}>
                    <TouchableOpacity style={entryStyles.returnButton} onPress={onBack}>
                        <Text style={entryStyles.returnText}>Return to Entries</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </View>
    );
}