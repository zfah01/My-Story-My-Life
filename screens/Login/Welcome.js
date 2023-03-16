import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, ScrollView, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import Loading from '../../utils/Loading';
import * as LocalAuthentication from 'expo-local-authentication';

// Imports the documents styling.
import { loginStyles } from './Styles';


import { auth, db } from '../../firebase/firebase';

// Checks if email is in a valid format.
export const checkEmail = (str) => {
    const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validEmail.test(str);
};

export default function Welcome({ navigation }) {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


        const getEnrollment = async () => {
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (isEnrolled) {
                const { success } = await LocalAuthentication.authenticateAsync({ promptMessage: 'Authenticate'});
                if (success) {
                    navigation.navigate('HomeScreen');
                } else {
                    Alert.alert('Uh Oh! Access Denied. Please try again.')
                    navigation.navigate('Welcome');
                    
                }
                
            }
        };



    const onLoginPress = () => {
        setLoading(true);
        // Calls the signInWithEmailAndPassword API from Auth to take the email and password entered and check if the user exists.
        // If successful, the user data is stored to the variable 'user' to be parsed through the application and the user
        // is signed in and taken to the home page.

        if (!checkEmail(email)) {
            setLoading(false);
            alert('Please ensure your email is valid.');
            return;
         }
         
        auth
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid;
                const usersRef = db.collection('users');
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert('User does not exist. Please check your credentials.');
                            return;
                        }
                        setLoading(false);
                        getEnrollment();
                        //navigation.navigate('Home');
                    })
                    .catch(error => {
                        setLoading(false);
                        alert(error);
                    });
            })
            .catch(error => {
                setLoading(false);
                alert(error);
            });
    };

  


    if (loading) {
        return (
            <Loading loading={loading} />
        );
    } else {
        return (
                <>
                <View style={loginStyles.header}>
                <Text style={loginStyles.mainTitle}>Welcome to My Story, My Life</Text>
                <Text>Log into your account below:</Text>
            </View><ScrollView>
                    <View style={loginStyles.contentContainer}>
                        <Image style={loginStyles.logo} source={require('../../assets/logo.png')} />

                        <TextInput
                            style={loginStyles.textInput}
                            placeholder='enter your email address...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textEmail) => setEmail(textEmail)}
                            value={email}
                            autoCapitalize='none'
                            testID='emailInput' />

                        <TextInput
                            style={loginStyles.textInput}
                            secureTextEntry
                            placeholder='enter your password...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textPass) => setPassword(textPass)}
                            value={password}
                            autoCapitalize='none'
                            testID='passwordInput' />

                        <TouchableOpacity
                            style={loginStyles.loginBTN}
                            onPress={() => onLoginPress()}
                            testID='loginButton'
                            accessibilityLabel='Log In button'>
                            <Text style={loginStyles.loginText}> Log In </Text>
                        </TouchableOpacity>

                        <View style={loginStyles.footer}>
                            <Text style={loginStyles.createAnAccountText}>Don&apos;t have an account yet?<Text testID='createAccountLink' onPress={() => navigation.navigate('CreateAccount')} style={loginStyles.createAccountLink}> Sign up</Text> </Text>
                        </View>
                    </View>
                </ScrollView>
                </>
        );
    }
}