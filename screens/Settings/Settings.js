import React, { useState } from 'react';
import { Alert, Image, Linking, Text, TouchableOpacity, ScrollView, View, SafeAreaView } from 'react-native';
import { settingStyles } from './Styles';
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

            <SafeAreaView style={settingStyles.contentContainer}>
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
                        <Text style={settingStyles.footerText}> My Story, My Life</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
    );
}