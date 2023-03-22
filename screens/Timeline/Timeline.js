import React, { useState, useEffect } from 'react';
import { ImageBackground, TouchableOpacity, ScrollView, Text, View, Image, StyleSheet , SafeAreaView} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Audio, Video } from 'expo-av';
import { journalStyles } from './Styles';
import { db, st } from '../../firebase/firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Ionicons } from '@expo/vector-icons';
import Insights from '../Insights/Insights';

export default function Timeline(props) {

    //Initiate state to set all data
    const [allData, setAllData] = useState([]);
   
    //Reference to memories collection in firebase 
    const memoriesRef = db.collection('memories');
    
    //Prop for userID
    const userID = props.extraData.id;

   //Create arrays for each component in life stories 
    const allDates = [];
    const allMoods = [];
    const allStories = [];
    const allTitles = [];
    const allImages = [];
    const allVideos = [];
    const recording = [];

    //Initiate states to display each component of a life story 
    const [storyEntry, setStoryEntry] = useState('');
    const [title, setTitle] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [voice, setVoice] = useState(null);
   

    const [insightsPressed, setInsightsPressed] = useState(false);
    const [entryPressed, setEntryPressed] = useState(false);

    //Get all memories for a user saved in firebase 
    const getMemories = async () => {
        memoriesRef
            .where('authorID', '==', userID)
            .orderBy('eventDateAt', 'asc')
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
          memoriesRef
          .where('authorID', '==', userID)
          .where('eventDateAt', '==', entryID)
          .onSnapshot(
              querySnapshot => {
                  querySnapshot.forEach((doc) => {
                      const memory = doc.data();
                      const reference = ref(st, `/${memory.voice}`);
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

  
    useEffect(() => {
        getMemories();
    }, []);


    const closeInsights = () => {
      setInsightsPressed(false);
  };
   


    // For loop to push dates, moods, stories, images, vieos and recordings to allData
    for (let i = 0; i < allData.length; i++) {
        allDates.push(allData[i].timelineDate);
        allMoods.push(allData[i].moodSelected);
        allStories.push(allData[i].storyText);
        allImages.push(allData[i].postImages);
        allTitles.push(allData[i].titleText);
        allVideos.push(allData[i].postVideos);
        recording.push(allData[i].voice);
  
    }


    //Create dates into objects to be used for Calendar 
    let allDatesObject = {};

    // Initialise variables to be used for displaying each life event to user
    let selectedMood = '';
    let selectedStoryText = '';
    let chosentitleText = '';
    let chosenImages = [];
    let chosenVideos = [];
    let inputAudio = null;

    // Goes throught the allDates array and sets the colour mood and current day to calendar 
    allDates.forEach((day) => {
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
        for (let i = 0; i < allStories.length; i++) {
            if (day === allDates[i]) {
                selectedStoryText = allStories[i];
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
            marked: selectedStoryText === '' ? false : selectedStoryText == null ? false : true,
            textT: chosentitleText === '' ? false : chosentitleText == null ? false : true,
            imageT:  chosenImages === [] ? false : true,
            videoT:  chosenVideos === [] ? false : true,
            audioT:  inputAudio === null ? false : true,
            selectedColor: selectedMood === 'Happy' ? '#108206' : selectedMood === 'Meh' ? '#e38e07' : selectedMood === 'Sad' ? '#112dec' : selectedMood === 'Angry' ? '#f90505' : '#000000',
        };
    });

    //Play sound of voice recording
    async function playSound() {
        try {
          await new Audio.Sound.createAsync({ uri: voice }, { shouldPlay: true });
        } catch (error) {
          console.log("voice replaying error", error);
        }
      }

    //Pause sound of voice recording
      async function pauseSound() {
        try {
          await playSound.pauseAsync();
        } catch (error) {
          console.log("voice replaying error", error);
        }
      }
      //Display each memory with data saved on firbase 

        const displayMemory = (day) => {
          for (let i = 0; i < allTitles.length; i++) {
            if (day.dateString === allDates[i]) {
                chosentitleText= allTitles[i];
                for (let i = 0; i < allStories.length; i++) {
                    if (day.dateString === allDates[i]) {
                        selectedStoryText = allStories[i];
                    }
                    if (selectedStoryText === '' || selectedStoryText == null) {
                        setStoryEntry('');
                        break;
                    } else {
                        setStoryEntry(selectedStoryText);
                        break;
                    }
                }
                for (let i = 0; i < allImages.length; i++) {
                  if (day.dateString === allDates[i]) {
                      chosenImages = allImages[i];
                  }
                  if (chosenImages === []) {
                      setImages([]);
                      break;
                  } else {
                      setImages(chosenImages);
                      break;
                  }
              }
              for (let i = 0; i < allVideos.length; i++) {
                if (day.dateString === allDates[i]) {
                    chosenVideos = allVideos[i];
                }
                if (chosenVideos === []) {
                    setVideos([]);
                    break;
                } else {
                    setVideos(chosenVideos);
                    break;
                }
            }
            for (let i = 0; i < recording.length; i++) {
              if (day.dateString === allDates[i]) {
                  inputAudio = recording[i];
              }
              if (inputAudio === null) {
                  setVoice(null);
                  break;
              } else {
                  setVoice(inputAudio);
                  break;
              }
          }
                if (chosentitleText === '' || chosentitleText == null) {
                    setTitle('');
                    break;
                } else {
                    setTitle(chosentitleText);
                    break;
                }
            }
        }
        setEntryPressed(true);
    };
    if (insightsPressed == false) {
    return (
        <SafeAreaView style={styles.lookView}>
            {entryPressed ? (
                <View style={journalStyles.popupMainContainer}>
                    <View style={[journalStyles.contentContainer, { margin: 5, marginTop: 50, width: 400, height: 600 }]}>
                      <ScrollView>
                    <Text style={journalStyles.popupTitle}>Title: </Text>
                        <Text style={journalStyles.titleText}>{title} </Text>
                        <Text style={journalStyles.popupTitle}>Your Story: </Text>
                        <Text style={journalStyles.obsessionText}>{storyEntry} </Text>

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
                                  
                                    <TouchableOpacity
                                      style={styles.voiceButton}
                                      onPress={playSound}
                                    >
                                     
                                      <Text style={styles.playText}><Ionicons name="play" size={15} style={styles.playButton}color="#999DC3" />PLAY RECORDING</Text>
                                    </TouchableOpacity>
                          
                                    
                                  </View>
                                )}

                        
                      </View>
                   

                        <TouchableOpacity onPress={() => setEntryPressed(false)} >
                            <Text style={journalStyles.buttonText}> {'>'} Back to Calendar </Text>
                        </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            ) : (
              <><View style={journalStyles.contentContainer}>
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
                            <Text style={journalStyles.contentText}>If a date has been marked then a life story has been set. Press on the date to display it!</Text>
                        </View>
                </View>
                <View style={journalStyles.contentContainer}>

              <ScrollView>
                <Text style={journalStyles.title}> Keep Track of Your Moods:  </Text>

                <Calendar
                  current={Date.current}
                  minDate={'1950-01-01'}
                  enableSwipeMonths={true}
                  markedDates={allDatesObject}

                  onDayPress={(day) => displayMemory(day)} />

               
              </ScrollView>



            </View>
            
            <TouchableOpacity style={journalStyles.touchableMod} onPress={() => setInsightsPressed(true)}>
                  <Text style={journalStyles.keyTitle}> Monthly Mood Insights</Text>
                </TouchableOpacity>
            
            </>
                
                

                
                
            )}
        </SafeAreaView>
    );
}else {
  return (
      <Insights {...props}  extraData={userID} closeInsights={closeInsights} />
  );
}
}

const styles = StyleSheet.create({
    container: {
      marginTop: 30,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
    }, 
    lookView: {
      backgroundColor: '#AFEEEE',
      flex: 1
      
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
