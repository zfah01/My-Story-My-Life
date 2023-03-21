import React, { useState, useEffect } from 'react';
import { ImageBackground, SafeAreaView, Button, TouchableOpacity, Platform, ScrollView, StyleSheet, Text, TextInput, View, Image, Alert, Linking } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import Help from '../Help/Help';

// Imports the documents styling.

// Imports firestore from firebase to save user entries to the firstore database.
//import firestore from '@react-native-firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { Link } from '@react-navigation/native';

export default function Contacts(props) {
    const [isAvailable, setIsAvailable] = useState(false);
    const [recipients, setRecipients] = useState([]);
    const [subject, setSubject] = useState(undefined);
    const [body, setBody] = useState(undefined);
    const [email, setEmail] = useState(undefined);

    const [helpPressed, setHelpPressed] = useState(false);

    const contactsRef = db.collection('Contacts');
    // Gets the users ID from props passed in from App.js.
    const userID = props.extraData.id;
    const user = auth.currentUser;

    const closeHelp = () => {
      setHelpPressed(false);
  };

    useEffect(() =>{
        async function checkAvailability(){
            const isMailAvailable = await MailComposer.isAvailableAsync();
            setIsAvailable(isMailAvailable);
        }
        checkAvailability();
    }, []);

    const sendMail = ()=> {
      
      if(recipients.length !== 0){
        MailComposer.composeAsync({
          subject: subject,
          body: body,
          recipients: recipients
        });
       
      } else {
        Alert.alert("Please enter a recipient");
      }




      setSubject(undefined);
      setBody(undefined);
      setRecipients([]);

    };

    

     // Checks if email is valid format.
  const checkEmail = (str) => {

  const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return validEmail.test(str);
};

    const addRecipient= ()=> {
      let newRecipients = [...recipients];
      if (!checkEmail(email)) {
        alert('Please ensure email is valid.');
        return;
     }

      newRecipients.push(email);

      setRecipients(newRecipients);
      setEmail(undefined);
    }

    const showRecipients = ()=> {
      if(recipients.length === 0){
        return <Text> No recipients added</Text>
      }
      
      return recipients.map((recipient, index)=>{
        return <Text key={index}>{recipient}</Text>;
      })
    }
    if (helpPressed == false) {
    return(
        <SafeAreaView style={styles.topView}>
            <Text style={styles.topSent}>Stay in touch with your Carer, Family or Friends</Text>
            <Text style={styles.bottomSent}>Rediscover your lost memories or get any help</Text>
            <View style={styles.contentContainer}>
              {showRecipients()}
              <View style={styles.addRec}>
            <TextInput value={email} onChangeText={setEmail} placeholder="Email"/>
            <Button title="Add Recipient" onPress={addRecipient}/>
            </View>
            
            </View>
            <View style={styles.contentContainer}>
            <TextInput value={subject} onChangeText={setSubject} placeholder="Subject"/>
           
            <View style={styles.bod}>
            <TextInput value={body} multiline={true} style={styles.bodText} onChangeText={setBody} placeholder="Body"/>
             </View>
             {isAvailable ? <Button title='Send Mail' onPress={sendMail}/> : <Text>Email not available</Text>}
        </View>

        <TouchableOpacity style={styles.GoProBox} onPress={() => setHelpPressed(true)}>
            <ImageBackground source={require('../../assets/faqs-customer-service-icon-concept.jpg')} resizeMode='cover' style={styles.goProBgImage}>
            <View style={styles.overlayView}/>
            <Text style={styles.goProText}> Help and Advice</Text>
            </ImageBackground>
            </TouchableOpacity>
        </SafeAreaView>
    );
  }else {
    return (
        <Help {...props}  extraData={userID} closeHelp={closeHelp} />
    );
  }
   
}

const styles = StyleSheet.create({
  contentContainer: {
    margin: 35,
    padding: Platform.OS === 'ios'? 10: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginBottom: Platform.OS === 'ios'? null: 15,
},


  topSent: {
    fontSize : 20,
    textAlign : 'center',
    fontWeight : 'bold',
    paddingBottom: 10
  },
  bottomSent: {
    fontSize : 15,
    textAlign : 'center',
    fontStyle: 'italic',
 
  }, 
  bod: {
    alignItems: 'center',
  },
  addRec: {
    alignItems: 'flex-end',
  },
  bodText: {
    flexWrap: 'wrap',
    height: 80,
    margin: 20,
    padding: 10,

  },
 
  titleH: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingBottom: 10,
    fontSize: 18
  },
  links :{
    color: 'red',
    paddingBottom: 2,
    fontSize: 15

  },
  topView: {
    paddingTop: Platform.OS === 'ios'? 80: 7,
    backgroundColor: '#AFEEEE',
    flex: 1, 
    
  },
  GoProBox: {
    width: '85%',
    height: 200,
    margin: 35,
    backgroundColor: '#00cc00',
    borderRadius: 25,
    alignSelf: 'center',
    overflow: 'hidden'

},
goProBgImage: {
    width: '100%', height: '100%',


},

goProText: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 140,
    fontWeight: 'bold',
    padding: 10,
    color: 'white'

},

overlayView: {
    height: "100%",
    width: "100%",
    position: 'absolute',
    backgroundColor: 'rgba(0, 204, 0, 0.5)',

}


});