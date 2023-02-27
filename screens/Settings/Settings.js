import React, { useState } from 'react';
import { Alert, Image, Linking, Text, TouchableOpacity, ScrollView, View } from 'react-native';
//import * as firebase from "firebase";
//import "firebase/storage";
// Imports the documents styling.
import { settingStyles } from './Styles';
// Imports the react-native-image-picker to allow access to a devices camera and photo library.
//import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// Imports a progress indicator to show the progress of the image upload.
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';

// Imports auth, firestore and storage from firebase to store the users profile picture and settings.
import {auth, st} from '../../firebase/firebase';


export default function Settings(props) {

    // Parsing the logout function from App.js
    const logout = props.logout;
    // Gets the current users details.
    const user = auth.currentUser;
    // Parsing the return home function from Home.js
    const returnHome = props.closeSettings;

    // Initialising the state to store the users profile picture.
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    // REFERENCE ACCESSED 16/12/2021 https://www.instamobile.io/mobile-development/react-native-firebase-storage/
    // Used to be able to use the camera and image library of the device to capture / select an image to use for the profile picture of the user and save that image to storage in firebase.

    // Sets how the image should be saved
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

            <View style={settingStyles.contentContainer}>
                <TouchableOpacity style={settingStyles.returnHomeButton} onPress={returnHome} >
                    <Text style={[settingStyles.buttonText, { color: '#448aff' }]}> {'>'} Return Home</Text>
                </TouchableOpacity>
                <ScrollView>
                    <Text style={settingStyles.subtitle}>Profile Picture:</Text>
                    <Text style={settingStyles.content}>Select a picture from your library or take a picture:</Text>
                    {/* Displays the profile picture if not null */}
                    {image !== null ? (
                        <Image source={{ uri: image }} style={settingStyles.imageBox} />
                    ) : null}
                    <TouchableOpacity style={settingStyles.pictureButton} onPress={takePhotoFromCamera} >
                        <Text style={settingStyles.buttonText}>Take a picture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={settingStyles.pictureButton} onPress={choosePhotoFromLibrary} >
                        <Text style={settingStyles.buttonText}>Select a profile picture</Text>
                    </TouchableOpacity>
                    {/* Changes the upload image button to a progress indicator upon image upload. */}
                    {uploading ? (
                        <View style={settingStyles.progress}>
                            <Progress.Bar progress={transferred} width={300} />
                        </View>
                    ) : (
                        <View>
                            <TouchableOpacity style={settingStyles.pictureButton} onPress={uploadImage} >
                                <Text style={settingStyles.buttonText}>Upload Image</Text>
                            </TouchableOpacity>
                        </ View>
                    )}
                    <Text style={settingStyles.subtitle}>Other Settings:</Text>

                    <TouchableOpacity style={settingStyles.logoutButton} onPress={logout} >
                        <Text style={settingStyles.buttonText}>Logout</Text>
                    </TouchableOpacity>

                    <View style={settingStyles.footer}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://zenquotes.io/')}>
                            <Text style={settingStyles.footerText}>Inspirational quotes provided by: </Text>
                            <Text style={settingStyles.hyperLink} onPress={() => Linking.openURL('https://zenquotes.io/')}>ZenQuotes API</Text>
                        </TouchableOpacity>

                        <Text style={settingStyles.footerText}> My Story, My Life</Text>
                    </View>
                </ScrollView>
            </View>
    );
}