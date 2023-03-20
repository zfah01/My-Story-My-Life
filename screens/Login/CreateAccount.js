import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, ImageBackground, Image } from 'react-native';
import Loading from '../../utils/Loading';

// Imports the documents styling.
import { loginStyles } from './Styles';

// Imports auth and firestore from the firebase console.
//import auth from '@react-native-firebase/auth';
//import firestore from '@react-native-firebase/firestore';
import { auth, db }from '../../firebase/firebase';


// Checks if password contains one uppercase, lowercase, number, special character present.
export const checkPassword = (str) => {
    const strongPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return strongPassword.test(str);
};

 // Checks if email is valid format.
export const checkEmail = (str) => {
    const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validEmail.test(str);
};

export default function CreateAccount({ navigation }) {


    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordCheck, setPasswordCheck] = useState(false);

    const onRegisterPress = () => {
        setLoading(true);
        
        if (!checkEmail(email)) {
            setLoading(false);
            alert('Please ensure your email is valid.');
            return;
         }

        if (!checkPassword(password)) {
            setLoading(false);
            setPasswordCheck(true);
            alert('Please ensure your password is 8 characters long and contains: \n One uppercase letter, a number and a special character (#?!@$%^&*-)');
            return;
         }

        if (password !== confirmPassword) {
            setLoading(false);
            alert('Please check your passwords are entered correctly as they dont match.');
            return;
        }
        // Calls the createUserWithEmailAndPassword API from Auth to create a new account in the Firebase Console.
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid;
                const data = {
                    id: uid,
                    email,
                    fullName,
                };
                // If account creation is successful, the user data is stored to Firestore (database)
                // to allow all data related to the account creation to be stored.
                // If data is successfully stored to Firestore, then the user is returned to the homescreen. 
                const usersRef = db.collection('users');
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                        setLoading(false);
                        navigation.navigate('HomeScreen');
                    })
                    .catch((error) => {
                        setLoading(false);
                        alert('Error: ' + error);
                    });
            })
            .catch((error) => {
                setLoading(false);
                alert('Error: ' + error);
            });
    };


   
        return (
                <>
                <View style={loginStyles.header}>
                <Text style={loginStyles.mainTitle}>Welcome to My Story, My Life</Text>
                <Text>Register for an account below:</Text>
            </View><ScrollView>
                    <View style={loginStyles.contentContainer}>
                        <Image style={loginStyles.logo} source={require('../../assets/logo.png')} />

                        <TextInput
                            style={loginStyles.textInput}
                            placeholder='enter your full name...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textName) => setFullName(textName)}
                            value={fullName}
                            autoCapitalize='none'
                            testID='fullNameInput' />

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
                            placeholder='enter a password...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textPass) => setPassword(textPass)}
                            value={password}
                            autoCapitalize='none'
                            testID='passwordInput' />

                        <TextInput
                            style={loginStyles.textInput}
                            secureTextEntry
                            placeholder='confirm your password...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textPass) => setConfirmPassword(textPass)}
                            value={confirmPassword}
                            autoCapitalize='none'
                            testID='confirmPasswordInput' />

                        <Text style={passwordCheck ? [loginStyles.contentText, { color: 'red' }] : loginStyles.contentText}>Password must be 8 or more characters and contain an upper case letter, numbers and a special character {'(#?!@$%^&*-)'}. </Text>

                        <TouchableOpacity
                            style={loginStyles.loginBTN}
                            onPress={() => onRegisterPress()}
                            testID='createAccountButton'
                            accessibilityLabel='Create Account Button'>
                            <Text style={loginStyles.loginText}> Create Account </Text>
                        </TouchableOpacity>

                        <View style={loginStyles.footer}>
                            <Text style={loginStyles.createAnAccountText}> Already have an account? <Text testID='welcomeLink' onPress={() => navigation.navigate('Welcome')} style={loginStyles.createAccountLink}> Log In</Text> </Text>
                        </View>
                    </View>
                </ScrollView>
                </>
        );
    
}