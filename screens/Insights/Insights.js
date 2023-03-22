import React, { useState, useEffect, } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions, ActivityIndicator, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebase/firebase';
import { LineChart } from "react-native-chart-kit";
import { addDoc, serverTimestamp, collection, query, doc, onSnapshot, where } from "firebase/firestore";
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { styles } from './Styles';
import { colors } from "../../utils/colors";

export default function Insights(props){

    //Get the current userID of the user 
    const userID = props.extraData;

    //Prop to get back to calendar page 
    const returnCalendar = props.closeInsights;


    // Creates a reference to the journal list collection in firestore to save data.
    const memoriesRef = db.collection('memories');

    let [isHappy, setIsHappy] = useState();
    let [isSad, setIsSad] = useState();
    let [isMeh, setIsMeh] = useState();
    let [isAngry, setIsAngry] = useState();
    let [isLoading, setIsLoading] = useState(true);

    //Get Current Month
    let month = new Date().getMonth() + 1;
    let countHappy = 0;
    let countSad = 0;
    let countMeh = 0;
    let countAngry = 0;

    // Selects the journal entry where the user ID matches the authorID and createdAt timestamp matches the current entry ID
    // and saves each field to its respectable variable to be displayed to the user when they select an entry to display.
    useEffect(() => {
        memoriesRef
        .where('authorID', '==', userID)
            .where('monthLog', '==', month)
            .onSnapshot(
                querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        const memory = doc.data();
                        

                        if (memory.moodSelected === 'Happy') {
                          countHappy++;
                      }
          
                      if (memory.moodSelected === 'Meh') {
                          countMeh++;
                      }
          
                      if (memory.moodSelected === 'Sad') {
                          countSad++;
                      }
          
                      if (memory.moodSelected === 'Angry') {
                          countAngry++;
                      }
                        
                    });
                    setIsHappy(countHappy);
                    setIsSad(countSad);
                    setIsMeh(countMeh);
                    setIsAngry(countAngry);
                    setIsLoading(false);
                },
              
                error => {
                    console.error(error);
                }
            );
    }, []);



    return (
      <SafeAreaView>
        <ScrollView>
        
                {isLoading ?

                    <View style={{ marginTop: 30, justifyContent: "center", alignItems: "center", }}>
                        <ActivityIndicator size="large" color={colors.white} />
                        <Text style={{ color: colors.white, marginTop: 10 }}>Fetching mood...</Text>
                        <Text style={{ fontWeight: "500", fontSize: 18, color: colors.white, marginTop: 5, marginBottom: 35 }}>It will take a few seconds</Text>
                    </View>

                    :

                    <View style={{ width: Dimensions.get('screen').width, backgroundColor: '#00e676', borderRadius: 40, marginTop: 20, paddingTop: 20 }}>
                        <TouchableOpacity  onPress={returnCalendar} >
                    <Text style={[styles.buttonText, { color: '#448aff' }]}> {'>'} Back to Calendar</Text>
                </TouchableOpacity>
                        <Text style={styles.SHtitle}>Mood Tracker</Text>

                        <View style={{ borderRadius: 30, paddingBottom: 50, alignSelf: "center", alignItems: "center", alignContent: "center", backgroundColor: "#243E36", marginTop: 20 }}>
                            <Text style={{ marginTop: 35, fontSize: 16, color: colors.white, }}>As of:</Text>
                            <View style={{ marginTop: 5 }}>

                                {(() => {
                                    if (month == 1) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>January</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 2) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>February</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 3) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>March</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 4) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>April</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 5) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>May</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 6) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>June</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 7) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>July</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 8) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>August</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 9) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>September</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 10) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>Ocotber</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 11) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>November</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 12) {
                                        return (
                                            <View>
                                                <Text style={styles.SHtitle3}>December</Text>
                                            </View>
                                        )
                                    }
                                })()}
                            </View>


                            <LineChart
                                data={{
                                    labels: ["🥳", "🥱", "😰","😡"],
                                    datasets: [
                                        {
                                            data: [
                                                isHappy,
                                                isMeh,
                                                isSad,
                                                isAngry
                                            ]
                                        }
                                    ],
                                }}
                                width={340} // from react-native
                                height={250}
                                yAxisInterval={1} // optional, defaults to 1

                                chartConfig={{
                                    backgroundColor: colors.white,
                                    backgroundGradientFrom: colors.blue,
                                    backgroundGradientTo: colors.blue,
                                    decimalPlaces: 1, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    propsForDots: {
                                        r: "4",
                                        strokeWidth: "4",
                                        stroke: "white"
                                    }
                                }}
                                bezier
                                style={{


                                    borderRadius: 10,
                                    padding: 5, alignSelf: "center",
                                    alignContent: "center",
                                    alignItems: "center",

                                }}
                            />
                        </View>

                        <View style={{ marginTop: 10, marginBottom: 5 }}>
                            {(() => {

                                if (Math.max(isHappy, isSad, isMeh, isAngry) == 0) {
                                    return (
                                        <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                            <Text style={styles.title}>Your mood tracker is empty.</Text>

                                        </View>
                                    )
                                }
                                else {
                                    if (Math.max(isHappy, isSad, isMeh, isAngry) == isHappy) {
                                        return (


                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.title}>We're glad to see you happy this month!</Text>
                                                <Text style={styles.title}>You may want to continue the progress by:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.lifehack.org/articles/money/30-absolutely-free-activities-that-can-make-you-happy-today.html' />
                                            </View>

                                        )
                                    }

                                    if (Math.max(isHappy, isSad, isMeh, isAngry) == isSad) {
                                        return (
                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.title}>You went through a lot of sadness this month. You should find something fun!</Text>
                                                <Text style={styles.title}>OR</Text>
                                                <Text style={styles.title}>You may use this test for further help:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.ramlimusa.com/questionnaires/depression-anxiety-stress-scale-dass-21-bahasa-malaysia/' />
                                            </View>
                                        )
                                    }

                                    if (Math.max(isHappy, isSad, isMeh, isAngry) == isMeh) {
                                        return (
                                            <View style={{ bbackgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.title}>You went through a lot of boringness this month. You should find something fun!</Text>
                                                <Text style={styles.title}>OR</Text>
                                                <Text style={styles.title}>For further help:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.lifehack.org/articles/money/30-absolutely-free-activities-that-can-make-you-happy-today.html' />
                                            </View>
                                        )
                                    }

                                    if (Math.max(isHappy, isSad, isMeh, isAngry) == isAngry) {
                                        return (
                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.title}>You went through a lot this month. You should find something fun to overcome!</Text>
                                                <Text style={styles.title}>OR</Text>
                                                <Text style={styles.title}>For further help:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434' />
                                            </View>
                                        )
                                    }


                                }

                            })()}
                        </View>
                    </View>
                }
        
        </ScrollView>
        </SafeAreaView>
    )
}