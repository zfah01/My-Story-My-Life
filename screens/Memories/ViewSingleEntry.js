import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Button, Platform } from 'react-native';

// Imports the documents styling.
import { entryStyles } from './Styles';

// Imports firestore from firebase to display the selected user entry.
//import firestore from '@react-native-firebase/firestore';
import { db, st}from '../../firebase/firebase';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import { inMemoryPersistence } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Video, Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ViewSingleEntry(props) {

    // Initializing the state to save firestore fields to their corresponding variables for display.
    const [selectedMood, setSelectedMood] = useState('');
    const [journalEntry, setJournalEntry] = useState('');
    const [displayDate, setDisplayDate] = useState('');
    const [title, setTitle] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);

    const [isClicked, setIsClicked] = useState(false);
    const memory = props.memory || "";
    const [url, setUrl] = useState();
    const [voice, setVoice] = useState(null);

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
                        setImages(journal.postImages);
                        setVideos(journal.postVideos);
                        //setVoice(journal.voice);
                        const reference = ref(st, `/${journal.voice}`);
                        getDownloadURL(reference).then((x) => {
                          setVoice(x);
                        });
                    });
                },
                error => {
                    console.error(error);
                }
            );
    }, []);


    useEffect(() => {
      const func = async () => {
        journalsRef
        .where('authorID', '==', userID)
        .where('createdAt', '==', entryID)
        .onSnapshot(
            querySnapshot => {
                querySnapshot.forEach((doc) => {
                    const journal = doc.data();
                    const reference = ref(st, `/${journal.voice}`);
                    getDownloadURL(reference).then((x) => {
                      setVoice(x);
                    });
                });
                func();
            },
            error => {
                console.error(error);
            }
        );

      }

  }, []);


 



    
      async function playSound() {
        try {
          await new Audio.Sound.createAsync({ uri: voice }, { shouldPlay: true });
        } catch (error) {
          console.log("voice replaying error", error);
        }
      }

      async function pauseSound() {
        try {
          await playSound.stopAsync();
        } catch (error) {
          console.log("voice replaying error", error);
        }
      }
    

    return (
      <>
      <SafeAreaView> 
    <Text style={styles.date}>Date of Entry: {displayDate} </Text>
    </SafeAreaView>

        <View style={styles.contentContainerScroll}>
          
        <ScrollView style={styles.scroll}>
        
        <Text style={styles.subHeaderTitle}>Title:</Text>
                <Text style={styles.title}>
                    {title}
                    </Text> 
            <Text style={styles.moodHeader}>How you were feeling: </Text>

            <View style={entryStyles.moodModules}>
                <View style={selectedMood === 'Happy' ? entryStyles.moodModSelected : entryStyles.moodModUnselected} >
                <Image source={require('../../assets/emojiHappy.png')} style={entryStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Happy</Text>
                </View>
                <View style={selectedMood === 'Sad' ? entryStyles.moodModSelected : entryStyles.moodModUnselected}>
                <Image source={require('../../assets/sadEmoji2.png')} style={entryStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Sad</Text>
                </View>
                <View style={selectedMood === 'Meh' ? entryStyles.moodModSelected : entryStyles.moodModUnselected}>
                <Image source={require('../../assets/emojiMeh.png')} style={entryStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Meh</Text>
                </View>
                <View style={selectedMood === 'Angry' ? entryStyles.moodModSelected : entryStyles.moodModUnselected}>
                <Image source={require('../../assets/emojiAngry.png')} style={entryStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Angry </Text>
                </View>
            </View>

            <Text style={[{ textAlign: 'center' }, { color: selectedMood === 'Happy' ? '#108206' : selectedMood === 'Meh' ? '#e38e07' : selectedMood === 'Sad' ? '#112dec' : '#f90505' }]}>
                You were feeling: {selectedMood}
            </Text>
            <View>
                <Text style={styles.storyHeader}>Your Story: </Text>
                <Text style={styles.story}>
                    {journalEntry}
                </Text>
                </View>


                    <View style={styles.container}>
                    <ScrollView horizontal={true}>
                    <View style={{flexDirection: "row"}}>
                   
                    {images.map((item) => (
                      <Image
                        key={item}
                        style={styles.image}
                        source={{uri: item}}
                      
                      />
                    ))}

                    {videos.map((item) => (
                      <Video
                        key={item}
                        style={styles.video}
                        source={{uri: item}}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                      
                      />
                    ))}

                    </View>
                    </ScrollView>
                    

                      {voice && (
                                  <View style={styles.headerBox}>
                                  
                                    <TouchableOpacity
                                      style={styles.voiceButton}
                                      onPress={playSound}
                                    >
                                     
                                      <Text style={styles.playText}><Ionicons name="play" size={15} style={styles.playButton}color="#999DC3" />PLAY RECORDING</Text>
                                    </TouchableOpacity>
                          
                                    
                                  </View>
                                )}

                        
                      </View>
                   

                    
                

            
                <View style={styles.returnButtonContainer}>
                    <TouchableOpacity style={styles.returnButton} onPress={onBack}>
                        <Text style={styles.returnText}>Back to Diary</Text>
                    </TouchableOpacity>
                </View>
            
        </ScrollView>
    </View>
    </>
    );
}

const styles = StyleSheet.create({
    container: {
      width: "90%",
    },
    playButton : {
      padding: 10
    },
    playText: {
      color: 'white',
      textAlign: 'center',
      alignSelf: 'center',
      margin: 8,
      marginLeft: 20,
    },

    headerBox: {
      display: "flex",
      flexDirection: "row",
      marginVertical: 10,
      height: 40,
      width: 180,
      backgroundColor: '#2e2eff',
      borderRadius: 10,
      
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

    returnButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      paddingTop: 10
  },
  returnButton: {
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'orange',
      borderRadius: 15,
      width: 150,
  },
  returnText: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18,
      color: '#000000',
  },

    date: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000000',
      marginTop: Platform.OS== "android" ? 40 : null,
      textAlign: 'center',
  
      
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
    video: {
      width: 330, height: 240,
      borderRadius: 9,
      marginLeft: 10,

    },

    image: {
      width: 330, height: 240,
      borderRadius: 9,
      marginLeft: 20,
      

    },
    subHeaderTitle: {
      fontSize: 16,
      textAlign: 'center',
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: '#000000',
  },

  storyHeader: {
    fontSize: 16,
    textAlign: 'left',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#000000',
    paddingTop: 20
  },
    emojiLabels: {
      textAlign: 'center',
      marginTop: 5,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      
  },
    title: {
      textAlign: 'center',
      fontSize: 30,
      paddingBottom: 10,
    },

    story: {
      paddingBottom: 12,
      paddingTop: 10,
      fontSize: 16
    },
    moodHeader: {
    fontSize: 16,
    textAlign: 'left',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#000000',
    paddingTop: 20
    },
    
    contentContainerScroll: {
      margin: 20,
      padding: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 25,
      maxHeight: '80%',
  },

  });
