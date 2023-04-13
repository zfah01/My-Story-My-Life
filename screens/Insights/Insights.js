import React, { useState, useEffect, } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions, ActivityIndicator, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebase/firebase';
import { LineChart } from "react-native-chart-kit";
import { addDoc, serverTimestamp, collection, query, doc, onSnapshot, where } from "firebase/firestore";
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { styles } from './Styles';
import { colors } from "../../utils/colors";

export default function Insights(props){

    const userID = props.extraData;
    const returnCalendar = props.closeInsights;
    const memoriesRef = db.collection('memories');

    let [isHappy, setIsHappy] = useState();
    let [isSad, setIsSad] = useState();
    let [isConfused, setIsConfused] = useState();
    let [isAngry, setIsAngry] = useState();
    let [isLoved, setIsLoved] = useState();
    let [isScared, setIsScared] = useState();
    let [isFunny, setIsFunny] = useState();
    let [isLoading, setIsLoading] = useState(true);

    //Get Current Month
    let month = new Date().getMonth() + 1;
    let countHappy = 0;
    let countSad = 0;
    let countConfused = 0;
    let countAngry = 0;
    let countLoved = 0;
    let countScared = 0;
    let countFunny = 0;

    // The life event is selected where the user ID matches the idUser and monthLog timestamp matches the current month
    // Mood counter is incremented when user selects mood, used to show monthly insights
    useEffect(() => {
        memoriesRef
        .where('idUser', '==', userID)
            .where('monthLog', '==', month)
            .onSnapshot(
                querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        const memory = doc.data();
                        

                        if (memory.moodSelected === 'Happy') {
                          countHappy++;
                      }
          
                      if (memory.moodSelected === 'Confused') {
                          countConfused++;
                      }
          
                      if (memory.moodSelected === 'Sad') {
                          countSad++;
                      }
          
                      if (memory.moodSelected === 'Angry') {
                          countAngry++;
                      }

                      if (memory.moodSelected === 'Loved') {
                        countLoved++;
                    }

                    if (memory.moodSelected === 'Scared') {
                        countScared++;
                    }

                    if (memory.moodSelected === 'Funny') {
                        countFunny++;
                    }
                        
                    });
                    setIsHappy(countHappy);
                    setIsSad(countSad);
                    setIsConfused(countConfused);
                    setIsAngry(countAngry);
                    setIsLoved(countLoved);
                    setIsScared(countScared);
                    setIsFunny(countFunny);
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
                        <Text style={styles.headingTracker}>Mood Tracker</Text>

                        <View style={{ borderRadius: 30, paddingBottom: 50, alignSelf: "center", alignItems: "center", alignContent: "center", backgroundColor: "#243E36", marginTop: 20 }}>
                            <Text style={{ marginTop: 35, fontSize: 16, color: colors.white, }}>As of:</Text>
                            <View style={{ marginTop: 5 }}>

                                {(() => {
                                    if (month == 1) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>January</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 2) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>February</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 3) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>March</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 4) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>April</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 5) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>May</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 6) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>June</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 7) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>July</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 8) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>August</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 9) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>September</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 10) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>Ocotber</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 11) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>November</Text>
                                            </View>
                                        )
                                    }

                                    if (month == 12) {
                                        return (
                                            <View>
                                                <Text style={styles.months}>December</Text>
                                            </View>
                                        )
                                    }
                                })()}
                            </View>


                            <LineChart
                                data={{
                                    labels: ["😄", "😕", "😢","😡", "😍", "😖", "😂"],
                                    datasets: [
                                        {
                                            data: [
                                                isHappy,
                                                isConfused,
                                                isSad,
                                                isAngry,
                                                isLoved,
                                                isScared,
                                                isFunny
                                            ]
                                        }
                                    ],
                                }}
                                width={340} 
                                height={250}
                                yAxisInterval={1} 

                                chartConfig={{
                                    backgroundColor: colors.white,
                                    backgroundGradientFrom: colors.blue,
                                    backgroundGradientTo: colors.blue,
                                    decimalPlaces: 1, 
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

                                if (Math.max(isHappy, isSad, isConfused, isAngry) == 0) {
                                    return (
                                        <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                            <Text style={styles.heading}>Your mood tracker is empty.</Text>

                                        </View>
                                    )
                                }
                                else {
                                    if (Math.max(isHappy, isSad, isConfused, isAngry, isLoved, isScared, isFunny) == isHappy) {
                                        return (


                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.heading}>You have recorded many happy events this month!</Text>
                                                <Text style={styles.heading}>Check this out to maintain your happiness:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.healthshots.com/mind/happiness-hacks/become-a-happier-you-by-including-these-8-activities-in-your-daily-routine/' />
                                            </View>

                                        )
                                    }

                                    if (Math.max(isHappy, isSad, isConfused, isAngry, isLoved, isScared, isFunny) == isSad) {
                                        return (
                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.heading}>You have logged in many sad events this month. Find something fun to do!</Text>
                                                <Text style={styles.heading}>OR</Text>
                                                <Text style={styles.heading}>Check this out:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.nhs.uk/mental-health/self-help/tips-and-support/how-to-be-happier/#:~:text=Simple%20activities%20like%20watching%20sports,have%20a%20sense%20of%20achievement.' />
                                            </View>
                                        )
                                    }

                                    if (Math.max(isHappy, isSad, isConfused, isAngry, isLoved, isScared, isFunny) == isConfused) {
                                        return (
                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.heading}>You went through a lot of uncertainty this month. Why not do something fun?</Text>
                                                <Text style={styles.heading}>OR</Text>
                                                <Text style={styles.heading}>Learn to be happier:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.lifehack.org/articles/money/30-absolutely-free-activities-that-can-make-you-happy-today.html' />
                                            </View>
                                        )
                                    }

                                    if (Math.max(isHappy, isSad, isConfused, isAngry, isLoved, isScared, isFunny) == isAngry) {
                                        return (
                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.heading}>You have recorded many events this month that make you angry. Learn to overcome your anger.</Text>
                                                <Text style={styles.heading}>OR</Text>
                                                <Text style={styles.heading}>Get some help:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.mind.org.uk/information-support/types-of-mental-health-problems/anger/managing-outbursts/' />
                                            </View>
                                        )
                                    }
                                    if (Math.max(isHappy, isSad, isConfused, isAngry, isLoved, isScared, isFunny) == isLoved) {
                                        return (
                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.heading}>You have recorded many events this month that make you feel loved. Learn to grow your love!</Text>
                                                <Text style={styles.heading}>OR</Text>
                                                <Text style={styles.heading}>Get some help:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://psychcentral.com/blog/ways-to-love-yourself-more' />
                                            </View>
                                        )
                                    }
                                    if (Math.max(isHappy, isSad, isConfused, isAngry, isLoved, isScared, isFunny) == isScared) {
                                        return (
                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.heading}>You have recorded many events this month that make you feel scared. Learn to overcome your fear.</Text>
                                                <Text style={styles.heading}>OR</Text>
                                                <Text style={styles.heading}>Get some help:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.nhsinform.scot/healthy-living/mental-wellbeing/fears-and-phobias/10-ways-to-fight-your-fears' />
                                            </View>
                                        )
                                    }
                                    if (Math.max(isHappy, isSad, isConfused, isAngry, isLoved, isScared, isFunny) == isFunny) {
                                        return (
                                            <View style={{ backgroundColor: "#FFFDFD", marginBottom: 25, borderRadius: 30, marginTop: 20, paddingBottom: 40, marginHorizontal: 10 }}>
                                                <Text style={styles.heading}>You have recorded many events this month that you have found funny. Learn how laughter can be beneficial for you!</Text>
                                                <Text style={styles.heading}>OR</Text>
                                                <Text style={styles.heading}>Get some help:</Text>
                                                <LinkPreview style={{ color: colors.blue }} text='https://www.verywellmind.com/the-stress-management-and-health-benefits-of-laughter-3145084' />
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