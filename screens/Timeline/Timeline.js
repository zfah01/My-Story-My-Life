import React, { useState, useEffect } from 'react';
import { ImageBackground, TouchableOpacity, ScrollView, Text, View, Image, StyleSheet , Button} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Audio, Video } from 'expo-av';
import { journalStyles } from './Styles';
import { db, st } from '../../firebase/firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Ionicons } from '@expo/vector-icons';

export default function Timeline(props) {
    
    const [allData, setAllData] = useState([]);
   
    const journalRef = db.collection('journalList');
    
    const userID = props.extraData.id;

   
    const allDates = [];
    const allMoods = [];
    
    const allJournals = [];
    const allTitles = [];
    const allImages = [];
    const allVideos = [];
    const recording = [];

    const [journalEntry, setJournalEntry] = useState('');
    const [title, setTitle] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [voice, setVoice] = useState(null);

 
    const [entryPressed, setEntryPressed] = useState(false);

    
    const getJournals = async () => {
        journalRef
            .where('authorID', '==', userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newData = [];
                    querySnapshot.forEach(doc => {
                        const userData = doc.data();
                        const reference = ref(st, `/${userData.voice}`);
                        getDownloadURL(reference).then((x) => {
                          setVoice(x);
                        });
                        userData.id = doc.id;
                        newData.push(userData);
                    });
                    setAllData(newData);
                },
                error => {
                    console.error(error);
                });
    };
    
    useEffect(() => {
        const func = async () => {
          journalRef
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

    // Gets all data from firebase where the signed in user ID matches the authorID and pushes the data to the allData array.
    useEffect(() => {
        getJournals();
    }, []);

   


    // For loop that adds the dates, moods and obsessions from allData to their own arrays.
    for (let i = 0; i < allData.length; i++) {
        allDates.push(allData[i].moodCalendarDate);
        allMoods.push(allData[i].moodSelected);
        allJournals.push(allData[i].journalText);
        allImages.push(allData[i].postImages);
        allTitles.push(allData[i].titleText);
        allVideos.push(allData[i].postVideos);
        recording.push(allData[i].voice);
  
    }


    // Turns dates into objects that can be used with the calendar to be displayed.
    let allDatesObject = {};
    // Variables that are used to display data to the user.
    let selectedMood = '';
    let selectedJournalText = '';
    let chosentitleText = '';
    let chosenImages = [];
    let chosenVideos = [];
    let inputAudio = null;

    // For each day in allDates array, cycle through the day, select the mood colour and add the current day to the calendar.
    allDates.forEach((day) => {
        // Checks if the day is the same as the date and then adds the mood for the date to the calendar.
        for (let i = 0; i < allMoods.length; i++) {
            if (day === allDates[i]) {
                selectedMood = allMoods[i];
            }
        }
      
        for (let i = 0; i < allTitles.length; i++) {
            if (day === allDates[i]) {
                chosentitleText = allTitles[i];
            }
        }
        for (let i = 0; i < allJournals.length; i++) {
            if (day === allDates[i]) {
                selectedJournalText = allJournals[i];
            }
        }

        for (let i = 0; i < allImages.length; i++) {
            if (day === allDates[i]) {
                chosenImages = allImages[i];
            }
        }

        for (let i = 0; i < allVideos.length; i++) {
            if (day === allDates[i]) {
                chosenVideos = allVideos[i];
            }
        }
        for (let i = 0; i < recording.length; i++) {
            if (day === allDates[i]) {
                inputAudio = recording[i];
            }
        }
        


        allDatesObject[day] = {
            selected: true,
            marked: selectedJournalText === '' ? false : selectedJournalText == null ? false : true,
            textT: chosentitleText === '' ? false : chosentitleText == null ? false : true,
            imageT:  chosenImages === [] ? false : true,
            videoT:  chosenVideos === [] ? false : true,
            audioT:  inputAudio === null ? false : true,
            selectedColor: selectedMood === 'Happy' ? '#108206' : selectedMood === 'Meh' ? '#e38e07' : selectedMood === 'Sad' ? '#112dec' : selectedMood === 'Angry' ? '#f90505' : '#000000',
        };
    });

    async function playSound() {
        try {
          await new Audio.Sound.createAsync({ uri: voice }, { shouldPlay: true });
        } catch (error) {
          console.log("voice replaying error", error);
        }
      }

      async function pauseSound() {
        try {
          await playSound.pauseAsync();
        } catch (error) {
          console.log("voice replaying error", error);
        }
      }
  

        const displayMemory = (day) => {
            for (let i = 0; i < allTitles.length; i++) {
                if (day.dateString === allDates[i]) {
                    chosentitleText = allTitles[i];
                    for (let i = 0; i < allJournals.length; i++) {
                        if (day.dateString === allDates[i]) {
                            selectedJournalText = allJournals[i]
                         
                        }
                
                    }  for (let i = 0; i < allImages.length; i++) {
                        if (day.dateString === allDates[i]) {
                            chosenImages = allImages[i]
                         
                        }
                
                    }for (let i = 0; i < allVideos.length; i++) {
                        if (day.dateString === allDates[i]) {
                            chosenVideos = allVideos[i]
                         
                        }
                
                    }
                    for (let i = 0; i < recording.length; i++) {
                        if (day.dateString === allDates[i]) {
                            inputAudio = recording[i]
                         
                        }
                
                    }
                
                    
                    if (selectedJournalText === '' || selectedJournalText == null) {
                        setJournalEntry('');
                        break;
                    } else if(chosentitleText === '' || chosentitleText == null){
                        setTitle('');
                        break;

                    } else if(chosenImages === []){
                        setImages([]);
                        break;

                    }else if(chosenVideos === []){
                        setVideos([]);
                        break;

                    }else if(inputAudio === null){
                        setVoice(null);
                        break;

                    }
                    else {
                        setJournalEntry(selectedJournalText);
                        setTitle(chosentitleText);
                        setImages(chosenImages);
                        setVideos(chosenVideos);
                        setVoice(inputAudio);
                        break;
                    }
                }
            }
            setEntryPressed(true);
        };

    return (
        <View>
            {entryPressed ? (
                <View style={journalStyles.popupMainContainer}>
                    <View style={[journalStyles.contentContainer, { margin: 5, marginTop: 50, width: 400, height: 600 }]}>
                    <Text style={journalStyles.popupTitle}>Title: </Text>
                        <Text style={journalStyles.titleText}>{title} </Text>
                        <Text style={journalStyles.popupTitle}>Your Story: </Text>
                        <Text style={journalStyles.obsessionText}>{journalEntry} </Text>

                        <View style={styles.container}>
                    <ScrollView horizontal={true}>
                    <View style={{flexDirection: "row", marginTop:30}}>
                   
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
                                  
                                    <Button
                                      style={styles.voiceButton}
                                      onPress={playSound}
                                      title= "PLAY"
                                    >
                                      <Ionicons name="play" size={15} color="#999DC3" />
                                    </Button>
                                   
                                    <Button 
                                      style={styles.voiceButton}
                                      title= "PAUSE"
                                      onPress={pauseSound}
                                    >
                                      <Ionicons name="pause" size={15} color="#999DC3" />
                                    </Button>
                                    
                                  </View>
                                )}

                        
                      </View>
                   

                        <TouchableOpacity onPress={() => setEntryPressed(false)} >
                            <Text style={journalStyles.buttonText}> {'>'} Back to Calendar </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={journalStyles.contentContainer}>
                    <ScrollView>
                        <Text style={journalStyles.title}> View your memories on a specific day:  </Text>

                        <Calendar
                            current={Date.current}
                            minDate={'2015-01-01'}
                            enableSwipeMonths={true}
                            markedDates={allDatesObject}
                            
                            onDayPress={(day) => displayMemory(day)}
                        />
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 30,
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
