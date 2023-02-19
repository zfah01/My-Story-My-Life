import React, { useState } from 'react';
import { Alert, Image, ImageBackground, Linking, Text, TouchableOpacity, ScrollView, View } from 'react-native';

// Imports the documents styling.
import { settingStyles } from './Styles';

// Imports the react-native-image-picker to allow access to a devices camera and photo library.
//import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// Imports a progress indicator to show the progress of the image upload.
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
// Imports auth, firestore and storage from firebase to store the users profile picture and settings.
//import storage from '@react-native-firebase/storage';
//import auth from '@react-native-firebase/auth';
import { auth, st } from '../../firebase/firebase';


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
    const options = {
        maxWidth: 2000,
        maxHeight: 2000,
    };

    /*const selectImage = () => {
        // Launch the image library for the device and if the image was selected, then set the image to the image uri.
        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.info('User cancelled image picker');
            } else if (response.error) {
                console.info('ImagePicker Error: ', response.error);
            } else {
                const source = { uri: response.assets[0].uri };
                setImage(source);
            }
        });
    };*/

    const takeImage = async() => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
          });

          console.log(result);
      
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
      
    };

     const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    
  };

    const uploadImage = async () => {

        // Gets the image uri and preps the image for saving. 
        const { uri } = image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const profilePicName = filename;
        // eslint-disable-next-line no-undef
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        //enables the progress bar to render.
        setUploading(true);
        setTransferred(0);

        // Creates a reference to where to save the profile picture.
        const storageRef = st.ref('users/' + user.uid + '/profilePicture/' + filename);
        const task = storageRef.putFile(uploadUri);

        // Increments the progress bar for photo upload.
        task.on('state_changed', snapshot => {
            try{
                setTransferred(
                    snapshot.Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
                );
            } catch(e){
                //
            }
            
        });

        // Waits for the profile picture to upload then sets the users photo url to the image.
        try {
            await task;
            user.updateProfile({
                photoURL: profilePicName
            });
        } catch (error) {
            console.error(error);
        }

        // Removes the progress indicator and sets the image back to null
        setUploading(false);
        setImage(null);
        Alert.alert('Your profile picture has been set!');
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
                        <Image source={{ uri: image.uri }} style={settingStyles.imageBox} />
                    ) : null}
                    <TouchableOpacity style={settingStyles.pictureButton} onPress={takeImage} >
                        <Text style={settingStyles.buttonText}>Take a picture</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={settingStyles.pictureButton} onPress={pickImage} >
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

                        <Text style={settingStyles.footerText}> My Story, My Life v1.1.0 2022</Text>
                    </View>
                </ScrollView>
            </View>

    );
}