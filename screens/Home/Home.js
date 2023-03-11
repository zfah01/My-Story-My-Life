import React, { useState, useEffect } from 'react';
import { Alert, Modal, Button, Image, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, View, } from 'react-native';
import Loading from '../../utils/Loading';

// Imports the documents styling.
import { homeStyles } from './Styles';


import Settings from '../Settings/Settings';

// Imports firestore and storage from firebase to save the days used and retrieve image data relating to the bonsai tree.

import  { auth, db, st } from '../../firebase/firebase';
import { Ionicons } from '@expo/vector-icons';


export default function Home(props) {
    // Parsing logout function for Settings from App.js
    const logout = props.logout;
    // Gets all information regarding the current user.
    const username = props.extraData.fullName;
    const userID = props.extraData.id;
    const user = auth.currentUser;

    // Initialising the state so that if a new user logs in they are set to the default values.
   
    const [dailyStreak, setDailyStreak] = useState(0);
    const [dailyStreakText, setDailyStreakText] = useState('🔥: ');
    const [profilePicUrl, setProfilePicUrl] = useState(null);
   
    const [settingsPressed, setSettingsPressed] = useState(false);
    const [loading, setLoading] = useState(true);

    const [past, setPast] = useState('');
    const [present, setPresent] = useState('');
    const [future, setFuture] = useState('');
    const [dob, setDob] = useState('');
    const [skills, setSkills] = useState('');
    const [tenseModal, setTenseModal] = useState(false);
    const [aboutModal, setAboutModal] = useState(false);

    const[days, setDays] = useState(0);
    const[growTree, setGrowTree]  = useState(null);
    const tree0 = st.ref('tree/tree0.png');
    const tree1 = st.ref('tree/tree1.png');
    const tree2 = st.ref('tree/tree2.png');
    const tree3 = st.ref('tree/tree3.png');
    const tree4 = st.ref('tree/tree4.png');
    const tree5 = st.ref('tree/tree5.png');
    


    // Creates references to firebase objects to get the user collection and profile picture. 
    const userCounterRef = db.collection('userCounter');
    const profilePicRef = st.ref('users/' + user.uid + '/profilePicture/' + user.photoURL);

    // Gets the current day on the device.
    const date = new Date();
    const currentDay = date.toISOString().split('T')[0];

    // Initiates all data on the home page. Called in useEffect.
    const setHomeScreenData = async () => {
  
        userCounterRef.doc(userID).get().then((doc) => {
            if (doc.exists) {
                const storedDate = doc.data().currentDay;
                const storedStreak = doc.data().dailyStreak;
                const daysUsed = doc.data().numDaysUsed;

                setTree(daysUsed);


                if (currentDay === storedDate) {
                    setDays(daysUsed);
                    setDailyStreak(storedStreak);
                    setLoading(false);
                } else {
                    const userStoredDate = new Date(storedDate).setUTCHours(0, 0, 0, 0);
                    // Used to get the previous date.
                    const previousDateFromCurrent = new Date(new Date().setDate(new Date().getDate() - 1)).setUTCHours(0, 0, 0, 0);
                    // END REFERENCE
                    if (previousDateFromCurrent === userStoredDate) {
                        userCounterRef
                            .doc(userID)
                            .set({
                                authorID: userID,
                                currentDay: currentDay,
                                numDaysUsed: (daysUsed + 1),
                                dailyStreak: (storedStreak + 1),
                            })
                            .then(() => {
                                setDays(daysUsed + 1);
                                setDailyStreak(storedStreak + 1);
                                setLoading(false);
                            });
                    } else {
                        userCounterRef
                            .doc(userID)
                            .set({
                                authorID: userID,
                                currentDay: currentDay,
                                numDaysUsed: (daysUsed + 1),
                                dailyStreak: 0,
                            })
                            .then(() => {
                                setDays(daysUsed + 1);
                                setDailyStreak(0);
                                setLoading(false);
                            });
                    }
                }
            } else {
                const data = {
                    authorID: userID,
                    currentDay: currentDay,
                    numDaysUsed: days,
                    dailyStreak: dailyStreak,
                };
                userCounterRef
                    .doc(userID)
                    .set(data)
                    .catch((error) => {
                        alert(error.message);
                    });
                setTree(0);
                setLoading(false);
            }
        });

    };


    // Sets the users profile picture, called in useEffect.
    const setProfilePic = async () => {
        // Sets the profile picture, if not available, sets to a default image.
        profilePicRef
            .getDownloadURL()
            .then((downloadURL) => {
                setProfilePicUrl(downloadURL);
            }).catch(() => {
                setProfilePicUrl('https://upload.wikimedia.org/wikipedia/commons/a/aa/Sin_cara.png');
            });
    };

    const setTree = (days) => {
    
        try {
          if (days >= 60) {
            tree5.getDownloadURL()
            .then((downloadURL) => {
                setGrowTree(downloadURL);
            })
            .catch((error) => {
                console.error(error);
            });
            } else if (days >= 30) {
                tree4.getDownloadURL()
                .then((downloadURL) => {
                    setGrowTree(downloadURL);
                })
                .catch((error) => {
                    console.error(error);
                });
            } else if (days >= 15) {
                tree3.getDownloadURL()
                .then((downloadURL) => {
                    setGrowTree(downloadURL);
                })
                .catch((error) => {
                    console.error(error);
                });
            } else if (days >= 6) {
                tree2.getDownloadURL()
                .then((downloadURL) => {
                    setGrowTree(downloadURL);
                })
                .catch((error) => {
                    console.error(error);
                });
            } else if (days >= 1) {
                tree1.getDownloadURL()
                .then((downloadURL) => {
                    setGrowTree(downloadURL);
                })
                .catch((error) => {
                    console.error(error);
                });
            } else if (days == 0) {
                tree0.getDownloadURL()
                .then((downloadURL) => {
                    setGrowTree(downloadURL);
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        
               
        }
        catch (error) {
            console.error(error);
        }
    };
  
    // Parsed into the settings page so when the close settings button is pressed the user is returned to home.
    const closeSettings = () => {
        setProfilePic();
        setSettingsPressed(false);
    };
    // React hook that sets up the home page on component load.
    useEffect(() => {
        setHomeScreenData();
        setProfilePic();
    }, []);

    if (loading) {
        return (
            <Loading loading={loading} />
        );
        // Renders the page if settings pressed is false, else renders the settings page.
    } else if (settingsPressed == false) {
        return (
                <ScrollView>
                    <View style={homeStyles.mainContainer}>
                        <View style={homeStyles.heading} >
                            <Text testID='userGreeting' style={homeStyles.title}>Hello, {username}! </Text>
                            <TouchableOpacity onPress={() => setSettingsPressed(true)} >
                                <Image style={homeStyles.profilePic} source={{ uri: profilePicUrl }} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={homeStyles.dailyStreak} onPress={() => {
                                setDailyStreakText('Daily Streak: ');
                                setTimeout(() => { setDailyStreakText('🔥: '); }, 1000);
                            }}>
                                <Text style={homeStyles.dailyStreakCounter} > {dailyStreakText} {dailyStreak}</Text>
                            </TouchableOpacity>
                        </View>
                <View style={styles.modals}>
                        <TouchableOpacity
                                style={styles.touchableMod}
                                onPress={() => setAboutModal(true)}>
                                    <Text style={styles.modHeader}>About Me</Text>
                                    <Image style={styles.pic} source={{ uri: profilePicUrl }} />
                         </TouchableOpacity>

                        <Modal
                        animationType='fade'
                        visible={aboutModal}
                        transparent={true}
                        backgroundOpacity={0.5}
                        backgroundColor={'#000'}
                        onRequestClose={()=> setAboutModal(!aboutModal)}>
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                            <View style={styles.selfEnd}>
                            <TouchableOpacity
                            onPress={()=>{
                                setAboutModal(!aboutModal);
                            }}
                            >
                                <Ionicons
                                style={{paddingRight: 270}}
                                name='close'
                                size={30}/>
                            </TouchableOpacity>
                            </View>
                            <Text style={styles.modHead}>About Me:</Text>
                            <View>
                            <View>
                                <Text style={styles.tenseHeader}>Name:</Text>
                                    <TextInput
                                        style={styles.contentContainer}
                                        multiline={true}
                                        editable={false}
                                        value={username}
                                    />
                             </View>

                             <View>
                                <Text style={styles.tenseHeader}>Date of Birth</Text>
                                    <TextInput 
                                        style={styles.contentContainer}
                                        placeholder='Please enter your date of birth'
                                        multiline={true}
                                        onChangeText={(text) => setDob(text)}
                                        value={dob}
                                    />
                                    </View>

                                
                                    <View>
                                    <Text style={styles.tenseHeader}>Skills and Hobbies</Text>
                                    <TextInput 
                                        style={styles.contentContainer}
                                        placeholder='What are your skills and hobbies?'
                                        multiline={true}
                                        onChangeText={(text) => setSkills(text)}
                                        value={skills}
                                    />
                                    </View>


                            </View>
                                <Button
                                title='Save'
                                //containerStyle={{width:'30%',borderRadius:30}}
                                style={styles.modButton}
                                onPress={() => setAboutModal(!aboutModal)}
                                />
                        </View>
                        </View>
                        </Modal>

                        <TouchableOpacity
                                style={styles.touchableMod}
                                onPress={() => setTenseModal(true)}>
                                    <Text style={styles.modHeader}>Life Journey {'\n'} and Aspirations</Text>
                         </TouchableOpacity>

                        <Modal
                        animationType='fade'
                        visible={tenseModal}
                        transparent={true}
                        backgroundOpacity={0.5}
                        backgroundColor={'#000'}
                        onRequestClose={()=> setTenseModal(!tenseModal)}>
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                            <View style={styles.selfEnd}>
                            <TouchableOpacity
                            onPress={()=>{
                                setTenseModal(!tenseModal);
                            }}
                            >
                                <Ionicons
                                style={{paddingRight: 270}}
                                name='close'
                                size={30}/>
                            </TouchableOpacity>
                            </View>
                            <Text style={styles.modHead}>Your Life Journey:</Text>
                            <View>
                            <View>
                                <Text style={styles.tenseHeader}>Past</Text>
                                    <TextInput
                                        style={styles.contentContainer}
                                        placeholder='Please enter information about your past'
                                        multiline={true}
                                        onChangeText={(text) => setPast(text)}
                                        value={past}
                                    />
                             </View>

                             <View>
                                <Text style={styles.tenseHeader}>Present</Text>
                                    <TextInput 
                                        style={styles.contentContainer}
                                        placeholder='How are you currently getting on in life?'
                                        multiline={true}
                                        onChangeText={(text) => setPresent(text)}
                                        value={present}
                                    />
                                    </View>

                                
                                    <View>
                                    <Text style={styles.tenseHeader}>Future</Text>
                                    <TextInput 
                                        style={styles.contentContainer}
                                        placeholder='What are your future aspirations?'
                                        multiline={true}
                                        onChangeText={(text) => setFuture(text)}
                                        value={future}
                                    />
                                    </View>


                            </View>
                                <Button
                                title='Save'
                                //containerStyle={{width:'30%',borderRadius:30}}
                                style={styles.modButton}
                                onPress={() => setTenseModal(!tenseModal)}
                                />
                        </View>
                        </View>
                        </Modal>
                        </View>

                        <View style={homeStyles.treeFrame}>
                            <Text style={styles.treeHeader}>Watch your tree grow as you grow</Text>
                        <Image source={{ uri: growTree }} style={homeStyles.tree} />
                            <Button style={homeStyles.detailsBTN}
                                onPress={showDailyUseDetails}
                                title="Find Out More"
                                accessibilityLabel='Find out more about how many used days affects the application' />
                        </View>
                    </View>
                </ScrollView>
        );
    } else {
        return (
            <Settings {...props} closeSettings={closeSettings} logout={logout} />
        );
    }
}

// Function that creates an alert to explain why the application should be used daily.
const showDailyUseDetails = () => {
    Alert.alert(
        // The alert title
        'Why use this app daily?',
        // The alert message
        'By using the application daily, you increase your days used counter! This has a direct link to the growth of the tree, which grows whilst you grow. ' +
        'Watch the tree grow overtime and see how far you have come on your own journey.',
        // brackets are required or android will giv an error message.
        [
            {
                text: 'OK', onPress: () => { }
            }
        ]);
};

const styles = StyleSheet.create({
    tenseHeader: {
        textAlign: 'left', 
        
       
    },
    contentContainer: {
        flexWrap: 'wrap',
        height: 80,
        margin: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        alignSelf: 'flex-start',
       
    },
    treeHeader: {
        fontSize: 17,
        fontStyle: 'italic',
        
    },

    questions: {
        margin: 10,
        marginTop: 30,
    },

    centerView:{
        flex:1,
        justifyContent: 'center',
        allignItems: 'center',
        //marginTop:56,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'relative'
      },
      modalView:{
        width: '88%',
        height: 550,
        backgroundColor: '#FFF', 
        margin:28,
        shadowColor:'#3E4985',
        shadowRadius:10,
        shadowOffset:10,
        borderRadius:10,
        padding:20,
        alignItems:'center',
        shadowColor:'#000',
      },
  

    selfEnd: {

    },

    modHeader: {
        fontSize: 20,
        margin: 30,
        textAlign: 'center',
        fontStyle: 'italic' 
    }, 
    modHead: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    }, 
    modButton: {
        backgroundColor: 'green', 
        width:'30%',
        borderRadius:30,
        
    },
    touchableMod: {
        backgroundColor: '#00e676',
        width: 170,
        height: 150,
        margin: 20,
        marginTop: 30,
        borderRadius: 9,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS

        elevation: 2, // Android
    },
    modals: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pic: {
        position: 'absolute',
        margin: 60,
        marginLeft: 45,
        width: 80,
        height: 80,
        borderRadius: 40,

    },

});