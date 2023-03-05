import React, { useState, useEffect } from 'react';
import { Text, View,  StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Button, Keyboard } from 'react-native';
import * as ImagePicker from "expo-image-picker";
//import {launchCameraAsync, useCameraPermissions, PermissionStatus, launchImageLibraryAsync} from 'expo-image-picker'
import { entryStyles } from './Styles';
import { st, db, timestamp, auth } from '../../firebase/firebase';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Audio, Video } from "expo-av";


export default function AddNewEntry(props, {navigation}) {

    // Initializing the state so that when a user selects a mood, it is outlined to show they have selected it.
    const [angry, setAngry] = useState(false);
    const [sad, setSad] = useState(false);
    const [meh, setMeh] = useState(false);
    const [happy, setHappy] = useState(false);

    const [title, setTitle] = useState('');
    const [journalEntry, setJournalEntry] = useState('');
    
    const [usefulDate, setUsefulDate] = useState(null);
    const [displayDate, setDisplayDate] = useState(null);
    const [entryMood, setEntryMood] = useState('');

      //photo
      const [images, setImages] = useState([]);
      const [urls, setUrls] = useState([]);
      const [progress, setProgress] = useState(0);

      const [videos, setVideos] = useState([]);
      const [vidUrls, setVidUrls] = useState([]);

      const [uploading, setUploading] = useState(false);
      const [transferred, setTransferred] = useState(0);
      const [status, requestPermission] = ImagePicker.useCameraPermissions();

  //voice
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState("");
  const [voiceInfo, setVoiceInfo] = useState(null);

  const [change, setChange] = useState(false);
  const ChangeColour = () => {
    setChange(!change);
  };

    

    const journalsRef = db.collection('journalList');
    // Gets the users ID from props passed in from App.js.
    const userID = props.extraData.id;
    const user = auth.currentUser;

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
          
          //else if (result.assets[0].type === 'video') {
           // setVideo( result?.assets[0].uri)
        //}
        }
      }
    };
  
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

    console.log("images: ", images);
    console.log("urls", urls)

    //upload video(s) to firebase 

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

    console.log("videos: ", videos);
    console.log("urls", vidUrls)

    /*const uploadVideo = async () => {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", video, true);
        xhr.send(null);
      });
      if (video == null) {
        return null;
      }
      const uploadUri = video;
      let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
  
      // Add timestamp to File Name
      const extension = filename.split(".").pop();
      const name = filename.split(".").slice(0, -1).join(".");
      filename = name + Date.now() + "." + extension;
  
      setUploading(true);
      setTransferred(0);
  
      const storageRef = st.ref('users/' + user.uid + '/videos/' + filename);
      const task = storageRef.put(blob);
  
      // Set transferred state
      task.on("state_changed", (taskSnapshot) => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
  
        setTransferred(Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
      });
  
      try {
        await task;
  
        const url = await storageRef.getDownloadURL();

  
        setUploading(false);
        setVideo(null);
        return url;
      } catch (e) {
        console.log(e);
        return null;
      }
    };*/

   
  

    

      //VOICE RECORDING
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
  

   const audioUpload = async () => {
    const uri = recording.getURI();
    let filename = uri.substring(uri.lastIndexOf("/") + 1);
    // Add timestamp to File Name
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0, -1).join(".");
    filename = name + Date.now() + "." + extension;

    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          try {
            resolve(xhr.response);
          } catch (error) {
            console.log("error:", error);
          }
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      if (blob != null) {
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
     
          st.ref()
          .child('users/' + user.uid + '/recordings/' + filename)
          .put(blob, {
            contentType: `audio/${fileType}`,
          })
          .then(() => {
            console.log("Sent!");
          })
          .catch((e) => console.log("error:", e));
      } else {
        console.log("erroor with blob");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const downloadAudio = async () => {
    const uri = await st.ref('users/' + user.uid + '/recordings/' + filename).getDownloadURL();

    console.log("uri:", uri);

    // The rest of this plays the audio
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri });
      await soundObject.playAsync();
    } catch (error) {
      console.log("error:", error);
    }
  };

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            size="xs"
            variant="outline"
            colorScheme="indigo"
            style={styles.playButton}
            onPress={() => recordingLine.sound.replayAsync()}
          >
            <Ionicons name="play" size={15} color="#999DC3" />
          </Button>
        </View>
      );
    });
  }


    const onSubmitButtonPress = async() => {
     // const imageUrl =  uploadImage();
      //const vidUrl = await uploadVideo();
      //const audioUrl = await downloadAudio();
      //console.log("Image Url: ", imageUrl);
      //console.log("Video Url: ", vidUrl);
      //console.log("Voice Url: ", audioUrl);
        if (journalEntry && journalEntry.length > 0) {
            const data = {
                authorID: userID,
                titleText: title,
                moodSelected: entryMood,
                postImages: images,
                postVideos: videos,
                //postVid: vidUrl ,
                //postAudio: audioUrl,
                journalText: journalEntry,
                moodCalendarDate: usefulDate,
                dateOfEntry: displayDate,
                createdAt: timestamp
            };
            journalsRef
                .add(data)
                .then(() => {
                    Keyboard.dismiss();

                    setTitle('');
                    setJournalEntry('');
                    setEntryMood('');
                    setAngry(false);
                    setImages([]);
                    setVideos([]);
                    setRecording(null);
                    setSad(false);
                    setMeh(false);
                    setHappy(false);
           

                    alert('Your memory has successfully been added to diary!');
                    //navigation.navigate('Diary');
                    

                })
                .catch((error) => {
                    alert('Error: ' + error);
                });
        }
        //END REFERENCE
    };


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
          <Text testID='dateID' style={entryStyles.date}>Today's Date: {displayDate}</Text>
        <View style={entryStyles.contentContainer}>
 
            <ScrollView>
           
                
                <Text style={entryStyles.subHeader}>Title</Text>
                    <TextInput style={entryStyles.obsessionEntry}
                        placeholder='Title'
                        numberOfLines={1}
                        multiline={true}
                        onChangeText={(text) => setTitle(text)}
                        value={title}
                    />
          <Text style={entryStyles.subHeader}>How are you feeling?</Text>
          <View style={entryStyles.moodModules}>
                  
                    <TouchableOpacity style={happy ? entryStyles.moodModSelected : entryStyles.moodModUnselected} onPress={isHappy}>
                    <Image source={require('../../assets/1F600_color.png')} style={entryStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Happy</Text>

                    </TouchableOpacity>
                    

                    <TouchableOpacity style={sad ? entryStyles.moodModSelected : entryStyles.moodModUnselected} onPress={isSad}>
                    <Image source={require('../../assets/1F625_color.png')} style={entryStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Sad</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={meh ? entryStyles.moodModSelected : entryStyles.moodModUnselected} onPress={isMeh}>
                    <Image source={require('../../assets/1F610_color.png')} style={entryStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Meh</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={angry ? entryStyles.moodModSelected : entryStyles.moodModUnselected} onPress={isAngry} >
                     <Image source={require('../../assets/1F620_color.png')} style={entryStyles.moodFaces} />
                        <Text style={styles.emojiLabels}>Angry</Text>
                    </TouchableOpacity>

                    
                </View>

            <View>
                    <Text style={entryStyles.subHeader}>Your Story: </Text>
                    
                    <TextInput style={entryStyles.journalEntry}
                        placeholder='Write your story here! '
                        numberOfLines={10}
                        multiline={true}
                        onChangeText={(text) => setJournalEntry(text)}
                        value={journalEntry}
                        testID='journalInput'
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
      datePickerStyle: {
        width: 230,
      },
      text: {
        textAlign: "left",
        width: 230,
        fontSize: 16,
        fontFamily: "Jaldi_400Regular",
        color: "#000",
        backgroundColor: "rgba(255, 255, 255, 0.77)",
    
      },
      subtitle: {
        alignItems: "center",
        fontSize: 16,
        fontFamily: "Jaldi_400Regular",
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
