import React, { useState, useEffect } from 'react';
import { Text, View,  StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Button, Alert, Platform, Keyboard } from 'react-native';
import * as ImagePicker from "expo-image-picker";
//import {launchCameraAsync, useCameraPermissions, PermissionStatus, launchImageLibraryAsync} from 'expo-image-picker'
import { storyStyles } from './Styles';
import { st, db, timestamp, auth, stamp } from '../../firebase/firebase';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Audio, Video } from "expo-av";
import { useNavigation } from '@react-navigation/native';
import "react-native-get-random-values";
import DateTimePicker from '@react-native-community/datetimepicker';


export default function AddLifeEvent(props) {

    // Initiate states
 
    const [happyMood, setHappyMood] = useState(false);
    const [angryMood, setAngryMood] = useState(false);
    const [sadMood, setSadMood] = useState(false);
    const [mehMood, setMehMood] = useState(false);

    const [title, setTitle] = useState('');
    const [storyEntry, setStoryEntry] = useState('');
    
    const [usefulDate, setUsefulDate] = useState(null);
    const [displayDate, setDisplayDate] = useState(null);
    const [entryMood, setEntryMood] = useState('');

    const [eventDate, setEventDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [display,setDisplay] = useState("default");

    
      const [images, setImages] = useState([]);
      const [urls, setUrls] = useState([]);
      const [progress, setProgress] = useState(0);

      const [videos, setVideos] = useState([]);
      const [vidUrls, setVidUrls] = useState([]);

      const [uploading, setUploading] = useState(false);
      const [transferred, setTransferred] = useState(0);
      const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState("");
  const [voiceInfo, setVoiceInfo] = useState(null);

  const [change, setChange] = useState(false);
  const ChangeColour = () => {
    setChange(!change);
  };

  const navigation = useNavigation();

    const memoriesRef = db.collection('memories');
    const userID = props.extraData.id;
    const user = auth.currentUser;

    //Get current date and display it in a nice format 
    useEffect(() => {

        const date = new Date();
        const displayOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const displayDateOfEntry = date.toLocaleDateString('en-US', displayOptions);
        setDisplayDate(displayDateOfEntry);


    }, []);

    //Change current date to event date 
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || eventDate;
      setShow(Platform.OS === 'ios');
      setEventDate(currentDate);
      const usefulDateOfEntry = currentDate.toISOString().split('T')[0];
      setUsefulDate(usefulDateOfEntry);
    };

    //Helper function to show date picker
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    //Function to display date picker 
    const showDatepicker = () => {
      setDisplay('default');
      showMode('date');
    };

    //Lets user to take a photo or video from their device 
    const takePhotoFromCamera = async () => {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (granted) {

        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.1,
          base64: true,
        });
        console.log(result);
  
        if (!result.canceled) {
          if (result.assets[0].type === 'image') {
          setImages([...images, result?.assets[0].uri] );
          } else if(result.assets[0].type === 'video'){
            setVideos([...videos, result?.assets[0].uri] );
          }
        }
      }
    };
  
    //Lets user choose photos or videos from their device 
    const choosePhotoFromLibrary = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
        base64: true,
      });
      console.log(result);
  
      if (!result.canceled) {
        if (result.assets[0].type === 'image') {
          setImages([...images, result?.assets[0].uri] );
        } else if(result.assets[0].type === 'video'){
          setVideos([...videos, result?.assets[0].uri])
        }
      }
    };

    //Function to upload images to storage in firebase 
    const uploadImage =  () => {
      const promises = [];
      images.map((image) => {

      const uploadUri = image;
      let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
  
      // Add timestamp to File Name
      const extension = filename.split(".").pop();
      const name = filename.split(".").slice(0, -1).join(".");
      filename = name + Date.now() + "." + extension;
        const uploadTask = st.ref('users/' + user.uid + '/images/' + filename).put(image);
        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            console.log(error);
          },
          async () => {
            await st
              .ref('users/' + user.uid + '/images/')
              .child(filename)
              .getDownloadURL()
              .then((urls) => {
                setUrls((prevState) => [...prevState, urls]);
              });
          }
        );
      });
  
      Promise.all(promises)
        .then(() => console.log("All images uploaded"))
        .catch((err) => console.log(err));
    };

    //console.log("images: ", images);
    //console.log("urls", urls)

    //Function to upload video to firebase storage

    const uploadVideo =  () => {
      const promises = [];
      videos.map((video) => {

      const uploadUri = video;
      let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
  
      // Add timestamp to File Name
      const extension = filename.split(".").pop();
      const name = filename.split(".").slice(0, -1).join(".");
      filename = name + Date.now() + "." + extension;
        const uploadTask = st.ref('users/' + user.uid + '/videos/' + filename).put(video);
        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            console.log(error);
          },
          async () => {
            await st
              .ref('users/' + user.uid + '/videos/')
              .child(filename)
              .getDownloadURL()
              .then((vidUrls) => {
                setVidUrls((prevState) => [...prevState, vidUrls]);
              });
          }
        );
      });
  
      Promise.all(promises)
        .then(() => console.log("All images uploaded"))
        .catch((err) => console.log(err));
    };

    //console.log("videos: ", videos);
    //console.log("urls", vidUrls)



  //Settings for IOS and Android voice recording
  const RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
    isMeteringEnabled: true,
    android: {
      extension: ".m4a",
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".m4a",
      outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  //Allows user to create a voice recording 
  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (error) {
      console.log("Failed to start recording", error);
    }
  }

  //Function to stop recording 
  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    audioUpload();
  }

  //Function to upload audio to firebase storage 
    const audioUpload = async () => {
      if (recording) {
        const voiceName = uuidv4();
        const path = `audio/${userID}/${voiceName}`;
        const ref_con = ref(st, path);
        setVoiceInfo(path);
        const voiceFile = await fetch(recording._uri);
        const bytes = await voiceFile.blob();
        await uploadBytes(ref_con, bytes);
      }
  };

  //Get duration of voice recording 
  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  //Retrieve recording lines from voice recording
  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.playButton}
            onPress={() => recordingLine.sound.replayAsync()}
            title="PLAY"
          >
            <Ionicons name="play" size={15} color="#999DC3" />
          </Button>
        </View>
      );
    });
  }


  //Validate user's input for creating life event 
  const validateInput = () => {

    const emptyvals = []
    if(title == '') {
      emptyvals.push('a title')
    }
    if(mehMood == false && happyMood == false  && sadMood == false  && angryMood == false) {
      emptyvals.push('a mood')
    }
     if(storyEntry == '') {
      emptyvals.push('a description of your story')
    }
    
     if(emptyvals.length == 0) {
      onSubmitButtonPress();
    }
    else {
      Alert.alert("Please enter " + emptyvals.join(", "))
    }

  }

  //Variables to display event date in nice format 
  const displayEventDate = { day: 'numeric', month: 'long', year: 'numeric' };
  const stringEventDate = eventDate.toLocaleDateString('en-US', displayEventDate);
  const eventTime = stamp.fromDate(eventDate);

    //Get Current Month for Mood Insights 
    let month = new Date().getMonth() + 1;

    //Submit Button
    const onSubmitButtonPress = async() => {
      
        if (validateInput) {
            const data = {
                idUser: userID,
                titleText: title,
                eventDate: stringEventDate,
                moodSelected: entryMood,
                postImages: images,
                postVideos: videos,
                voice: voiceInfo || null,
                storyText: storyEntry,
                timelineDate: usefulDate,
                dateOfEntry: displayDate,
                eventDateAt: eventTime,
                monthLog: month,
                createdAt: timestamp
            };
            memoriesRef
                .add(data)
                .then(() => {
                    Keyboard.dismiss();

                    setTitle('');
                    setShow(false);
                    setStoryEntry('');
                    setEntryMood('');
                    setAngryMood(false);
                    setImages([]);
                    setVideos([]);
                    setVoiceInfo(null);
                    setRecording(null);
                    setSadMood(false);
                    setMehMood(false);
                    setHappyMood(false);
           

                    alert('Your memory has successfully been added to diary!');
                    navigation.navigate('Timeline');
                    

                })
                .catch((error) => {
                    alert('Error: ' + error);
                });
        }
        
    };

    //Sets entry mood to Angry
    const isAngry = () => {
        if (!angryMood) {
            setAngryMood(true);
            setSadMood(false);
            setMehMood(false);
            setHappyMood(false);
            setEntryMood('Angry');
        }
    };

    //Sets entry mood to Sad
    const isSad = () => {
        if (!sadMood) {
            setAngryMood(false);
            setSadMood(true);
            setMehMood(false);
            setHappyMood(false);
            setEntryMood('Sad');
        }
    };

    //Sets entry mood to Meh
    const isMeh = () => {
        if (!mehMood) {
            setAngryMood(false);
            setSadMood(false);
            setMehMood(true);
            setHappyMood(false);
            setEntryMood('Meh');
        }
    };

    //Sets entry mood to Happy
    const isHappy = () => {
        if (!happyMood) {
            setAngryMood(false);
            setSadMood(false);
            setMehMood(false);
            setHappyMood(true);
            setEntryMood('Happy');
        }
    };

    return (
        <View style={storyStyles.mainContainer}>
          <Text style={storyStyles.date}>Today's Date: {displayDate}</Text>
        <View style={storyStyles.mainView}>
 
            <ScrollView>
           
                
                <Text style={storyStyles.subHeader}>Title</Text>
                    <TextInput style={storyStyles.obsessionEntry}
                        placeholder='Title'
                        numberOfLines={1}
                        multiline={true}
                        onChangeText={(text) => setTitle(text)}
                        value={title}
                    />

            <View style={styles.dateContainer}>
            <Text style={storyStyles.subHeader}>Event Date: {Platform.OS === 'android' ? stringEventDate : null}</Text>
            <TouchableOpacity style={styles.pickerBtn} onPress={showDatepicker}>
          <Text style={styles.pickerBtnTxt}>Set Date</Text>
        </TouchableOpacity>
       {show && (
          <DateTimePicker
          value={eventDate}
          mode={mode}
          minimumDate={new Date(1950,1,1)}
          maximumDate={new Date()}
          display = {display}
          onChange={onChange}
        />
      )}
        </View>
          <Text style={storyStyles.subHeader}>How are you feeling?</Text>
          <View style={storyStyles.moodModules}>
                  
                    <TouchableOpacity style={happyMood ? storyStyles.moodSelected : storyStyles.moodNotSelected} onPress={isHappy}>
                    <Image source={require('../../assets/emojiHappy.png')} style={storyStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Happy</Text>

                    </TouchableOpacity>
                    

                    <TouchableOpacity style={sadMood ? storyStyles.moodSelected : storyStyles.moodNotSelected} onPress={isSad}>
                    <Image source={require('../../assets/sadEmoji2.png')} style={storyStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Sad</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={mehMood ? storyStyles.moodSelected : storyStyles.moodNotSelected} onPress={isMeh}>
                    <Image source={require('../../assets/emojiMeh.png')} style={storyStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Meh</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={angryMood ? storyStyles.moodSelected : storyStyles.moodNotSelected} onPress={isAngry} >
                     <Image source={require('../../assets/emojiAngry.png')} style={storyStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Angry</Text>
                    </TouchableOpacity>

                    
                </View>

            <View>
                    <Text style={storyStyles.subHeader}>Your Story: </Text>
                    
                    <TextInput style={storyStyles.journalEntry}
                        placeholder='Write your story here! '
                        numberOfLines={10}
                        multiline={true}
                        onChangeText={(text) => setStoryEntry(text)}
                        value={storyEntry}
                    />

                

            <View style={styles.recordUploadContainer}>
                    <Text>{message}</Text>
                    <TouchableOpacity>

                     <FontAwesome5 name="microphone" size={22} color={recording ? 'red' : 'grey'} onPress={recording ? stopRecording : startRecording} />
                        
                    
                        
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <FontAwesome5 name="photo-video" color={ "grey"} size={20} style={styles.mediaButtons} onPress={choosePhotoFromLibrary} />
                      
                        </TouchableOpacity>

                        <TouchableOpacity>
                        <MaterialIcons name="add-a-photo" color={ "grey"} size={20} style={styles.mediaButtons} onPress={takePhotoFromCamera} />
                    </TouchableOpacity>

                    </View>

                    <View style={styles.container}>
                    
                    
                    {getRecordingLines()}
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
                        //onPlaybackStatusUpdate={status => setStatus(() => status)}

                                            
                                            />
                                          ))}

                </View>
                </ScrollView>
                    </View>
                    
                        
                    <View style={storyStyles.submitView}>
                        <TouchableOpacity style={storyStyles.submitButton} onPress={validateInput} accessibilityLabel='Submit Button'  >
                            <Text style={storyStyles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    
                    
                </View>
            </ScrollView>
        </View>
    </View>
    );
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        width:"50%",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius:5,
        backgroundColor: "rgba(255, 255, 255, 0.77)",
        marginBottom:10,
      },
      heading: {
        fontFamily: "GiveYouGlory_400Regular",
        fontSize: 40,
        paddingTop: "10%",
      },
      title: {
        textAlign: "left",
        fontSize: 20,
        fontWeight: "bold",
      },
      dateContainer: {
        flex : 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
       },
       label: {
        margin: 10,
        color: 'black',
        fontSize: 14,
        fontFamily:'Century Gothic'
      },
      datePickerStyle: {
        width: 230,
      },
      pickerBtn: {
        borderColor: "#2e64e5",
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
        width:100,
        marginBottom:10
      },
      pickerBtnTxt: {
        color: "#2e64e5",
        alignItems: "center",
      },
      text: {
        textAlign: "left",
        width: 230,
        fontSize: 16,
        color: "#000",
        backgroundColor: "rgba(255, 255, 255, 0.77)",
    
      },
      elevationLow: {
        ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,    
        },
        android: {
            elevation: 5,
        },
        }),
    },
      subtitle: {
        alignItems: "center",
        fontSize: 16,
      },
      recordUploadContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: "3%",
      },
      buttons: {
        marginRight: "2%",
        backgroundColor: "#999DC3",
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
      },
      playButton: {
        width: 200,
        marginBottom: "3%",
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      fill: {
        flex: 1,
        margin: 16,
      },
      button: {
        margin: 16,
      },
      video: {
        width: 100, height: 100,
        marginLeft: 10,
        borderRadius: 9,
      },
      image: {
        width: 100, height: 100,
        marginLeft: 10,
        borderRadius: 9,

      }, 
      emojiLabels: {
        textAlign: 'center',
        marginTop: 5,
      },
      
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 40,
        flexDirection: 'row',


    }, 

    mediaButtons: {
      marginLeft: 20,
      activeColor: 'tomato',
      inactiveColor: 'gray',
      
    }
      
   
    });
