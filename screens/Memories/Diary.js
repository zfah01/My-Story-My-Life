import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SearchBar } from '@rneui/themed';

// Imports the documents styling.
import { listStyles } from './Styles';

// Imports firestore from firebase to save user entries to the firstore database.
//import firestore from '@react-native-firebase/firestore';
import { db }from '../../firebase/firebase';

// Imports the View Single Entry component so when an entry is pressed the user is able to view the entry.
import ViewSingleEntry from './ViewSingleEntry';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

export default function Diary(props) {

    // All entries that are stored for a user.
    const [allEntries, setAllEntries] = useState([]);
    // The updated array that is displayed when a user does a search.
    const [filteredEntries, setFilteredEntries] = useState([]);
    // Will store the user-provided search term to filter through the journal lists and return results that contain the search term.
    const [searchText, setSearchText] = useState('');
    // Remembers the selected ID to load more data about the entry.
    const [selectedID, setSelectedID] = useState(null);

    // Makes a reference to load the journal list collection from firestore.
    const memoriesRef = db.collection('memories');
    // Gets the users ID from props passed in from App.js.
    const userID = props.extraData.id;

    // Selects all journal entries where the user ID matches the authorID and sorts the list by newest date first.
    useEffect(() => {
        memoriesRef
            .where('authorID', '==', userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newMemories = [];
                    querySnapshot.forEach((doc) => {
                        const memory = doc.data();
                        memory.id = doc.id;
                        newMemories.push(memory);
                    });
                    setAllEntries(newMemories);
                },
                error => {
                    alert(error);
                }
            );
    }, []);

    
    const search = (searchText) => {
        setSearchText(searchText);
        const filteredEntries = allEntries.filter(function (item) {
            // use title, mood, date to view entry 
            return item.titleText.toLowerCase().includes(searchText.toLowerCase()) || item.dateOfEntry.includes(searchText) || item.storyText.toLowerCase().includes(searchText.toLowerCase())||item.moodSelected.toLowerCase().includes(searchText.toLowerCase());
        });
        setFilteredEntries(filteredEntries);
    };


   

    // Sets the selectedID back to null when returning from the ViewSingleEntry page.
    const unsetCurrentEntry = () => {
        setSelectedID(null);
    };

    // Checks if the selectedID has been set and if so, displays the ViewSingleEntry page to view a users entry.
    if (selectedID) {
        return (
            <View>
                <ViewSingleEntry {...props} extraData={userID} currentEntryID={selectedID} onBack={unsetCurrentEntry} />

            </View>
        );
    }

    


    return (
        // Sets the background image to half opacity.
            <SafeAreaView style={styles.diaryView}>
            <SearchBar
                round={true}
                lightTheme={true}
                placeholder='Search by Title, Mood, Date or Story'
                autoCapitalize='none'
                onChangeText={search}
                value={searchText}
                 />
                <View style={listStyles.contentContainer}>
                <FlatList
                    data={filteredEntries && filteredEntries.length > 0 ? filteredEntries : allEntries}
                    keyExtractor={(item) => item.id}

                    renderItem={({ item }) => <TouchableOpacity style={listStyles.listView} onPress={() => setSelectedID(item.createdAt)}>
                    <Text style={listStyles.entryDesc}>{item.dateOfEntry}</Text>
                    <Text style={listStyles.entryDate}>{item.titleText}</Text>
                    <Text style={listStyles.entryDesc} numberOfLines={2} >{item.storyText}</Text>
                    <ScrollView horizontal={true}>
                    <View style={{flexDirection: "row"}}>
                    {item.postImages &&
                        item.postImages.map(image => 
                        <Image
                            key={image}
                            source={{ uri: image}} style={{ 
                            width: 300, 
                            marginLeft: 35,
                            height: 180,
                            borderRadius: 9,
                            alignSelf:'center',
                            marginTop:10
                            }}
                            resizeMode='cover' 
                        />
                        )
                    }
                    </View>
                    </ScrollView>
                    {/* Uses arrayed styles to set default styling and to set the colour of the text based on the mood. */}
                    <Text style={[listStyles.entryMood, { color: item.moodSelected === 'Happy' ? '#108206' : item.moodSelected === 'Meh' ? '#e38e07' : item.moodSelected === 'Sad' ? '#112dec' : '#f90505' }]}>Your mood: {item.moodSelected} </Text>
                </TouchableOpacity>
                } />
            </View>
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    diaryView: {
        backgroundColor: '#AFEEEE',
        flex: 1,
      

    },
});
