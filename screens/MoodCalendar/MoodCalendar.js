import React, { useState, useEffect } from 'react';
import { ImageBackground, TouchableOpacity, ScrollView, Text, View, Image, StyleSheet , SafeAreaView} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Audio, Video } from 'expo-av';
import { styles } from './Styles';
import { db, st } from '../../firebase/firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Ionicons } from '@expo/vector-icons';
import Insights from '../Insights/Insights';

export default function MoodCalendar(props) {

    //Initiate state to set all data
    const [allData, setAllData] = useState([]);
   
    //Reference to memories collection in firebase 
    const memoriesRef = db.collection('memories');
    
    //Prop for userID
    const userID = props.extraData.id;
    const entryID = props.currentEntryID;

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
    const [pressedDate, setPressedDate] = useState(false);

    //Get all memories for a user saved in firebase 
    const getMemories = async () => {
        memoriesRef
            .where('idUser', '==', userID)
            .orderBy('eventDateAt', 'asc')
            .onSnapshot(
                querySnapshot => {
                    const newData = [];
                    querySnapshot.forEach(doc => {
                        const memory = doc.data();
                        const reference = ref(st, `/${memory.voice}`);
                        getDownloadURL(reference).then((x) => {
                          setVoice(x);
                        });
                        memory.id = doc.id;
                        newData.push(memory);
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
          .where('idUser', '==', userID)
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
            selectedColor: selectedMood === 'Happy' ? '#108206' : selectedMood === 'Confused' ? '#e38e07' : selectedMood === 'Sad' ? '#112dec' : selectedMood === 'Angry' ? '#f90505' : '#000000',
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
        setPressedDate(true);
    };
    if (insightsPressed == false) {
    return (
        <SafeAreaView style={styles.lookView}>
            {pressedDate ? (
                <View style={styles.popupMainContainer}>
                    <TouchableOpacity onPress={() => setPressedDate(false)} >
                            <Text style={styles.buttonText}> {'>'} Back to Calendar </Text>
                        </TouchableOpacity>
                    <View style={[styles.mainView, { margin: 5, marginTop: 50, width: 400, height: 600 }]}>
                      <ScrollView>
                    <Text style={styles.popupTitle}>Title: </Text>
                        <Text style={styles.titleText}>{title} </Text>
                        <Text style={styles.storyHeader}>Your Story: </Text>
                        <Text style={styles.story}>{storyEntry} </Text>

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
                   

                      
                        </ScrollView>
                    </View>
                </View>
            ) : (
              <><View style={styles.mainView}>
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={styles.keyContainer} >
                                <Text testID='calendarKeyID' style={styles.keyTitle}>Mood Key:</Text>
                                <View style={styles.keyContainer2}>
                                    <View style={[styles.moodContainer, { marginRight: 10 }]}>
                                        <Text style={styles.moodText}>Happy:</Text>
                                        <Text style={[styles.moodBackground, { backgroundColor: '#108206' }]} />
                                    </View>
                                    <View style={[styles.moodContainer, { marginRight: 20 }]}>
                                        <Text style={styles.moodText}>Confused:</Text>
                                        <Text style={[styles.moodBackground, { backgroundColor: '#e38e07' }]} />
                                    </View>
                                    <View style={styles.moodContainer}>
                                        <Text style={styles.moodText}> Sad: </Text>
                                        <Text style={[styles.moodBackground, { backgroundColor: '#112dec', marginLeft: 8 }]} />
                                    </View>
                                    <View style={[styles.moodContainer, { paddingLeft: 10, paddingRight: 20 }]}>
                                        <Text style={styles.moodText}>Angry:</Text>
                                        <Text style={[styles.moodBackground, { backgroundColor: '#f90505' }]} />
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.moodText}>If a date has been marked then a life story has been set. Press on the date to display it!</Text>
                        </View>
                </View>
                <View style={styles.mainView}>

              <ScrollView>
                <Text style={styles.moodTitle}> Keep Track of Your Moods:  </Text>

                <Calendar
                  current={Date.current}
                  minDate={'1950-01-01'}
                  enableSwipeMonths={true}
                  markedDates={allDatesObject}
                  testID='idMoodCalendar'
                  onDayPress={(day) => displayMemory(day)} />
                  
                  

               
              </ScrollView>



            </View>
            
            <TouchableOpacity style={styles.touchableMod} onPress={() => setInsightsPressed(true)}>
                  <Text style={styles.keyTitle}> Monthly Mood Insights</Text>
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





