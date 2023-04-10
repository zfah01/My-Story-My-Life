import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, ImageBackground, Image } from 'react-native';
import Loading from '../../utils/Loading';
import { styles } from './Styles';
import { auth, db }from '../../firebase/firebase';



// Checks if an uppercase, lowercase, number, special character is contained in the password 
export const passwordValid = (str) => {
    const passwordStrong = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return passwordStrong.test(str);
};

 //Check if the email is in a correct format 
export const emailValid = (str) => {
    const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validEmail.test(str);
};

export default function SignUp({ navigation }) {


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordCheck, setPasswordCheck] = useState(false);

    const RegisterToApp = () => {
        setLoading(true);
        
        if (!emailValid(email)) {
            setLoading(false);
            alert('Please ensure your email is valid.');
            return;
         }

        if (!passwordValid(password)) {
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
        // Use createUserWithEmailAndPassword API to create a new account 
        auth.
            createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid;
                const data = {
                    id: uid,
                    email,
                    name,
                };
                
                // if user account is created successfully their data is stored to firebase
                // and is directed to HomeScreen 

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
                <View style={{backgroundColor: '#AFEEEE', width: '100%', height: '100%'}}>
                <View style={styles.intro}>
                <Text style={styles.heading}>Welcome to My Story, My Life</Text>
                <Text>Register for an account below:</Text>
            </View><ScrollView>
                    <View style={styles.mainView}>
                        <Image style={styles.logo} source={require('../../assets/logo.png')} />

                        <TextInput
                            style={styles.textInput}
                            placeholder='enter your full name...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textName) => setName(textName)}
                            value={name}
                            autoCapitalize='none'
                            testID='inputName'
                             />

                        <TextInput
                            style={styles.textInput}
                            placeholder='enter your email address...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textEmail) => setEmail(textEmail)}
                            value={email}
                            autoCapitalize='none'
                            testID='inputEmail'
                             />

                        <TextInput
                            style={styles.textInput}
                            secureTextEntry
                            placeholder='enter a password...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textPass) => setPassword(textPass)}
                            value={password}
                            autoCapitalize='none'
                            testID='inputPassword'
                           />

                        <TextInput
                            style={styles.textInput}
                            secureTextEntry
                            placeholder='confirm your password...'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(textPass) => setConfirmPassword(textPass)}
                            value={confirmPassword}
                            autoCapitalize='none'
                            testID='inputConfirmPassword'
                             />

                        <Text style={passwordCheck ? [styles.passwordGuidelines, { color: 'red' }] : styles.passwordGuidelines}>Password must be 8 or more characters and contain an upper case letter, numbers and a special character {'(#?!@$%^&*-)'}. </Text>

                        <TouchableOpacity
                            style={styles.buttonLogin}
                            onPress={() => RegisterToApp()}
                            testID='signUpButton'
                            accessibilityLabel='Create Account Button'>
                            <Text style={styles.loginText}> Create Account </Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.accountText}> Already have an account? <Text testID='loginLink'onPress={() => navigation.navigate('Welcome')} style={styles.createLink}> Log In</Text> </Text>
                        </View>
                    </View>
                </ScrollView>
                </View>
        );
    
}