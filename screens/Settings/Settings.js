import React, { useState } from 'react';
import { Alert, Image, Linking, Text, TouchableOpacity, ScrollView, View, SafeAreaView } from 'react-native';
import { styles } from './Styles';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import {auth, st} from '../../firebase/firebase';


export default function Settings(props) {

    // Prop for logout funcion
    const logout = props.logout;
    
    //Get user details
    const user = auth.currentUser;

    // Prop to return back to Home
    const returnHome = props.closeSettings;

    // Initiate States 
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);


    //About Function 
    const aboutApp = () => {
      Alert.alert(
          // The alert title
          'How to use this app?',
          // The alert message
          'My Story, My Life is a platform where you can remember, reflect and record your life experiences.'+
          'It is a safe and personalised digital space for you to record and visualise time periods in your life where life-forming events may have occurred. See how far you have come in your journey by watching your tree grow as you grow.',
          // brackets are required or android will giv an error message.
          [
              {
                  text: 'OK', onPress: () => { }
              }
          ]);
    };



    //Allows user to take a photo for profile picture 
    const takePhotoFromCamera = async () => {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (granted) {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
            base64: true,
          });
          console.log(result);
    
          if (!result.canceled) {
            setImage(result?.assets[0].uri);
          }
        }
      };
    
      //Allows user to choose a photo from their devices to set for profile picture 
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
          setImage(result?.assets[0].uri);
        }
      };
  
      //Upload Image to firebase storage 
      const uploadImage = async () => {
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
          xhr.open("GET", image, true);
          xhr.send(null);
        });
        if (image == null) {
          return null;
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
    
        // Add timestamp to File Name
        const extension = filename.split(".").pop();
        const name = filename.split(".").slice(0, -1).join(".");
        filename = name + Date.now() + "." + extension;
    
        const profilePicName = filename;

        setUploading(true);
        setTransferred(0);
    
        const storageRef = st.ref('users/' + user.uid + '/profilePicture/' + filename);
        const task = storageRef.put(blob);
    
        // Set transferred state
        task.on("state_changed", (taskSnapshot) => {
          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    
          setTransferred(Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
        });
    
        try {
          await task;

          user.updateProfile({
            photoURL: profilePicName
        });

    
          setUploading(false);
          setImage(null);
          Alert.alert('Your profile picture has been set!');
        } catch (e) {
          console.log(e);
          return null;
        }
      };

    return (
        <View style={{backgroundColor: '#AFEEEE', width: '100%', height: '100%'}}>
            <SafeAreaView style={styles.settingsView}>
                <TouchableOpacity style={styles.homeReturn} onPress={returnHome} >
                    <Text style={[styles.settingButtonText, { color: '#448aff' }]}> {'>'} Return Home</Text>
                </TouchableOpacity>
                <ScrollView style={{marginLeft: 10}}>
                    <Text style={styles.settingTitle}>Profile Picture:</Text>
                    <Text style={styles.settingSubText}>Select a picture from your gallery or take a picture:</Text>
               
                    {image !== null ? (
                        <Image source={{ uri: image }} style={styles.profilePic} />
                    ) : null}
                    <TouchableOpacity style={styles.settingButton} onPress={takePhotoFromCamera} >
                        <Text style={styles.settingButtonText}>Take a picture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingButton} onPress={choosePhotoFromLibrary} >
                        <Text style={styles.settingButtonText}>Select a profile picture</Text>
                    </TouchableOpacity>
          
                    {uploading ? (
                        <View style={styles.progress}>
                            <Progress.Bar progress={transferred} width={300} />
                        </View>
                    ) : (
                        <View>
                            <TouchableOpacity style={styles.settingButton} onPress={uploadImage} >
                                <Text style={styles.settingButtonText}>Upload Image</Text>
                            </TouchableOpacity>
                        </ View>
                    )}
                       <Text style={styles.settingTitle}>About</Text>
                       <Text style={styles.titleText}>Learn how to use My Story, My Life:</Text>

                      <TouchableOpacity style={styles.settingButton} onPress={aboutApp} >
                          <Text style={styles.settingButtonText}>About</Text>
                      </TouchableOpacity>
                    <Text style={styles.settingTitle}>Other Settings:</Text>

                    <TouchableOpacity style={styles.buttonOut} onPress={logout} >
                        <Text style={styles.settingButtonText}>Logout</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}> My Story, My Life</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
            </View>
    );
}