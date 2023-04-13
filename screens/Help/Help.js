import React, { useState, useEffect, } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions, ActivityIndicator, Alert, SafeAreaView, TouchableOpacity, Linking, Image } from 'react-native';
import { auth, db } from '../../firebase/firebase';
import { LineChart } from "react-native-chart-kit";
import { addDoc, serverTimestamp, collection, query, doc, onSnapshot, where } from "firebase/firestore";
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { colors } from "../../utils/colors";
import {styles} from "./styles";
import { Ionicons } from '@expo/vector-icons';

export default function Help(props){
    //Prop to close Help screen 
    const returnContacts = props.closeHelp;

    return(
        <SafeAreaView style={{backgroundColor: '#AFEEEE', width: '100%', height: '100%'}}>
        <TouchableOpacity  onPress={returnContacts} >
        <Text style={[styles.buttonText, { color: '#448aff' }]}> {'>'} Back to Contacts</Text>
    </TouchableOpacity>

    <View style={styles.contentContainer}>
           <Text style={styles.blurb}>Find out how you could get help!</Text>
        </View>




    <View style={styles.rowContainer}>
    <View style={styles.rowTouchables}>
    <TouchableOpacity style={styles.touchableMod} onPress={() => Linking.openURL('https://www.barnardos.org.uk/what-we-do/supporting-young-people/leaving-care/young-person/finances')} >
             <Text style={styles.modHeader}>Financial Help</Text>
             <Image style={styles.images} source={require('../../assets/finance.png')} />
    </TouchableOpacity>
    <TouchableOpacity style={styles.touchableMod}onPress={() => Linking.openURL('https://mycovenant.org.uk/for-care-leavers/care-leaver-opportunities/')}>
             <Text style={styles.modHeader}>Employment Opportunities</Text>
             <Image style={styles.images} source={require('../../assets/employment.png')} />
    </TouchableOpacity>
    </View>

    <View style={styles.rowTouchables}>
    <TouchableOpacity style={styles.touchableMod} onPress={() => Linking.openURL('https://breathingspace.scot/')} >
             <Text style={styles.modHeader}>Breathing Space</Text>
             <Image style={styles.images3} source={require('../../assets/breathingspace.png')} />
    </TouchableOpacity>
    <TouchableOpacity style={styles.touchableMod}onPress={() => Linking.openURL('https://www.whocaresscotland.org/')}>
             <Text style={styles.modHeader}>Join a Community</Text>
             <Image style={styles.images4} source={require('../../assets/community.png')} />
    </TouchableOpacity>
    </View>

    
    <View style={styles.rowTouchables}>
    <TouchableOpacity style={styles.touchableMod} onPress={() => Linking.openURL('https://www.staf.scot/')} >
             <Text style={styles.modHeader}>Have your Voice Heard!</Text>
             <Image style={styles.images5} source={require('../../assets/raisevoice.png')} />
    </TouchableOpacity>
    <TouchableOpacity style={styles.touchableMod}onPress={() => Linking.openURL('https://www.mind.org.uk/')}>
             <Text style={styles.modHeader}>Mental Health Support</Text>
             <Image style={styles.images6} source={require('../../assets/mentalhealth.png')} />
    </TouchableOpacity>
    </View>
    </View>
    </SafeAreaView>
    )
  
};