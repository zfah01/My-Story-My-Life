import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Button, Platform } from 'react-native';
import { storyStyles } from './Styles';
import { db, st}from '../../firebase/firebase';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Video, Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ViewLifeEvent(props) {

    // Initialise States
    const [selectedMood, setSelectedMood] = useState('');
    const [storyEntry, setStoryEntry] = useState('');
    const [displayDate, setDisplayDate] = useState('');
    const [title, setTitle] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [eventDate, setEventDate]= useState('');
    const [voice, setVoice] = useState(null);

  
    const userID = props.extraData;
    const onBack = props.onBack;
    const entryID = props.currentEntryID;


    //Reference to memories collection in firebase 
    const memoriesRef = db.collection('memories');

    // Selects the life event where the user ID matches the idUser and eventDateAt  matches the current entry ID
    // and sets each variable to a field to display in each life event 
    useEffect(() => {
        memoriesRef
            .where('idUser', '==', userID)
            .where('eventDateAt', '==', entryID)
            .onSnapshot(
                querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        const memory = doc.data();
                        setSelectedMood(memory.moodSelected);
                        setStoryEntry(memory.storyText);
                        setDisplayDate(memory.dateOfEntry);
                        setTitle(memory.titleText);
                        setImages(memory.postImages);
                        setVideos(memory.postVideos);
                        setEventDate(memory.eventDate);
                        const reference = ref(st, `/${memory.voice}`);
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

    //Allows the user to play their voice recording set for current life story 
      async function playSound() {
        try {
          await new Audio.Sound.createAsync({ uri: voice }, { shouldPlay: true });
        } catch (error) {
          console.log("voice replaying error", error);
        }
      }

  //Allows the user to pause their voice recording set for current life story 
      async function pauseSound() {
        try {
          await playSound.stopAsync();
        } catch (error) {
          console.log("voice replaying error", error);
        }
      }
    

    return (
      <View style={styles.mainBody}>
      <SafeAreaView> 
    <Text style={styles.date}>Date of Event: {eventDate} </Text>
    </SafeAreaView>

        <View style={styles.contentContainerScroll}>
          
        <ScrollView style={styles.scroll}>
          
        <View style={storyStyles.moodSelections}>
                <View style={selectedMood === 'Happy' ? storyStyles.moodPicked : storyStyles.moodNotPicked} >
                <Image source={require('../../assets/emojiHappy.png')} style={storyStyles.moodChosenFaces} />
                       
                </View>
                <View style={selectedMood === 'Sad' ? storyStyles.moodPicked : storyStyles.moodNotPicked}>
                <Image source={require('../../assets/sadEmoji2.png')} style={storyStyles.moodChosenFaces} />
                        
                </View>
                <View style={selectedMood === 'Confused' ? storyStyles.moodPicked : storyStyles.moodNotPicked}>
                <Image source={require('../../assets/emojiConfused.png')} style={storyStyles.moodChosenFaces} />
                </View>
                <View style={selectedMood === 'Angry' ? storyStyles.moodPicked : storyStyles.moodNotPicked}>
                <Image source={require('../../assets/emojiAngry.png')} style={storyStyles.moodChosenFaces} />
                </View>
            </View>
        
        <Text style={styles.subHeaderTitle}>Title:</Text>
                <Text style={styles.title}>
                    {title}
                    </Text> 
              
         
        

 

  
            <View>
                <Text style={styles.storyHeader}>Your Story: </Text>
                <Text style={styles.story}>
                    {storyEntry}
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
                        <Text style={styles.returnText}>Back</Text>
                    </TouchableOpacity>
                </View>
            
        </ScrollView>
    </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      width: "90%",
    },
    playButton : {
      padding: 10
    },
    eventDate: {
      fontWeight: 'normal',
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
      paddingTop: "2%",
    },
  
    button: {
      backgroundColor: "#999DC3",
      borderColor: "white",
      borderWidth: 1,
      borderRadius: 5,
    },
    buttonText: {
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
    mainBody: {
      backgroundColor: '#AFEEEE',
      width: "100%",
      height: "100%",
      
      
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
      top: 33,
      color: '#000000',
  },

  storyHeader: {
    fontSize: 16,
    textAlign: 'left',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#000000',
    paddingTop: 20,
    marginTop: 20,
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
      fontSize: 25,
      top: 33,
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
      maxHeight: Platform.OS == "ios" ?'80%' : '85%',
  },

  });
