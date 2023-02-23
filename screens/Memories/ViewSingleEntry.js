import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Button } from 'react-native';

// Imports the documents styling.
import { entryStyles } from './Styles';

// Imports firestore from firebase to display the selected user entry.
//import firestore from '@react-native-firebase/firestore';
import { db }from '../../firebase/firebase';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import { inMemoryPersistence } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";

export default function ViewSingleEntry(props) {

    // Initializing the state to save firestore fields to their corresponding variables for display.
    const [selectedMood, setSelectedMood] = useState('');
    const [journalEntry, setJournalEntry] = useState('');
    const [displayDate, setDisplayDate] = useState('');
    const [title, setTitle] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const memory = props.memory || "";
    const [url, setUrl] = useState();
    const [voice, setVoice] = useState();

    const [voiceInfo, setVoiceInfo] = useState(null);
    const [imageInfo, setimageInfo] = useState(null);
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
                        setTitle(journal.titleText);
                        setimageInfo(journal.photo);
                        setVoiceInfo(journal.voice);
                    });
                },
                error => {
                    console.error(error);
                }
            );
    }, []);

    useEffect(() => {
        const func = async () => {
          const storage = getStorage();
          const reference = ref(storage, `/${memory.photo}`);
          await getDownloadURL(reference).then((x) => {
            setUrl(x);
          });
        };
        func();
      }, []);
    
      useEffect(() => {
        const func = async () => {
          const storage = getStorage();
          const reference = ref(storage, `/${memory.voice}`);
          await getDownloadURL(reference).then((x) => {
            setVoice(x);
          });
        };
        func();
      }, []);
    
      async function playSound() {
        try {
          await new Audio.Sound.createAsync({ uri: voice }, { shouldPlay: true });
        } catch (error) {
          console.log("voice replaying error", error);
        }
      }
    
      const handleClick = () => {
        setIsClicked(!isClicked);
      };

    return (
        <View style={entryStyles.contentContainer}>
        <ScrollView>
        <Text style={entryStyles.dateTitle}>Date of Entry: {displayDate} </Text>
        <Text style={entryStyles.subHeader}>Title</Text>
                <TextInput style={entryStyles.obsessionEntry}
                    placeholder='Title'
                    numberOfLines={1}
                    multiline={true}
                    value={title}
                />
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
                <Text style={entryStyles.subHeader}>Your Story: </Text>
                <TextInput style={entryStyles.journalEntry}
                    placeholder='Write your story here! '
                    numberOfLines={5}
                    multiline
                    editable={false}
                    value={journalEntry}
                />

            <Button
                   
                    style={styles.memoryButton}
                    onPress={handleClick}
                   title={memory.title}
                >
                    
                </Button>

                {isClicked ? (
                    <View>
                    {url && (
                        <Image
                        source={{ uri: url }}
                        style={{ width: "100%", height: 300 }}
                        />
                    )}

                    {voice && (
                        <View style={styles.headerBox}>
                        <Button
                            style={styles.voiceButton}
                            onPress={playSound}
                            title="play"
                        >
                            <Ionicons name="play" size={15} color="#999DC3" />
                        </Button>
                        <Button
                        
                            style={styles.voiceButton}
                            title=""
                        >
                            <Ionicons name="pause" size={15} color="#999DC3" />
                        </Button>
                        </View>
                    )}
                    
                    <Button
                        style={styles.deleteButton}
                        title="edit"

                    >
                        <Ionicons name="pencil" size={15} color="white" />
                    </Button>
                    </View>
                ) : null}

                

            
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

const styles = StyleSheet.create({
    container: {
      width: "90%",
    },
    headerBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 10,
      alignItems: "baseline",
    },
    header: {
      fontSize: 25,
      fontFamily: "Jaldi_700Bold",
      paddingTop: "2%",
    },
  
    button: {
      backgroundColor: "#999DC3",
      borderColor: "white",
      borderWidth: 1,
      borderRadius: 5,
    },
    buttonText: {
      fontFamily: "Jaldi_400Regular",
      fontSize: 18,
    },
    memoryButton: {
      backgroundColor: "rgba(255, 255, 255, 0.77)",
      marginBottom: 6,
      borderColor: "white",
      borderWidth: 1,
      borderRadius: 5,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    deleteButton: {
      backgroundColor: "rgb(182, 182, 182)",
      width: "20%",
    },
    voiceButton: {
      marginVertical: "2%",
      marginHorizontal: "1%",
    },
  });