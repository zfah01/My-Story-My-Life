import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, ScrollView, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import Loading from '../../utils/Loading';
import * as LocalAuthentication from 'expo-local-authentication';
import { styles } from './Styles';


import { auth, db } from '../../firebase/firebase';

//Check if email is in a suitable format 
export const emailValid = (str) => {
    const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validEmail.test(str);
};

export default function Welcome({ navigation }) {
    
    //Initiate states 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    //Add 2FA, prompts the user to enter with their Local Authentication (Biometrics, Passcode etc)
    // if success directs user to HomeScreen else error message displayed

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
        //Checks if email and password exists if it does it directs user to Home 

        if (!emailValid(email)) {
            setLoading(false);
            alert('Please ensure your email is valid.');
            return;
         }
         
        auth.
        signInWithEmailAndPassword(email, password)
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
                <View style={{backgroundColor: '#AFEEEE', width: '100%', height: '100%'}}>
                <View style={styles.intro}>
                <Text style={styles.heading}>Welcome to My Story, My Life</Text>
                <Text>Log into your account below:</Text>
            </View><ScrollView>
                    <View style={styles.mainView}>
                        <Image style={styles.logo} source={require('../../assets/logo.png')} />

                        <TextInput
                            style={styles.textInput}
                            placeholder='enter your email address...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textEmail) => setEmail(textEmail)}
                            value={email}
                            autoCapitalize='none'
                            testID='inputEmail' />

                        <TextInput
                            style={styles.textInput}
                            secureTextEntry
                            placeholder='enter your password...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textPass) => setPassword(textPass)}
                            value={password}
                            autoCapitalize='none'
                            testID='inputPassword' />

                        <TouchableOpacity
                            style={styles.buttonLogin}
                            onPress={() => onLoginPress()}
                            testID='buttonLogin'
                            accessibilityLabel='Log In button'>
                            <Text style={styles.loginText}> Log In </Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.accountText}>Don&apos;t have an account yet?<Text testID='signUpLink' onPress={() => navigation.navigate('SignUp')} style={styles.createLink}> Sign up</Text> </Text>
                        </View>
                    </View>
                </ScrollView>
                </View>
        );
    }
}