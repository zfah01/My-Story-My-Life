import React, { useState, useEffect } from 'react';
import { Alert, Modal, Button, Image, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, View, SafeAreaView, Keyboard } from 'react-native';
import Loading from '../../utils/Loading';
import { styles } from './Styles';
import Settings from '../Settings/Settings';
import  { auth, db, st } from '../../firebase/firebase';
import { Ionicons } from '@expo/vector-icons';


export default function Home(props) {

    // Get logout function for Settings
    const logout = props.logout;

    //Retrieve information of user 
    const username = props.extraData.name;
    const userID = props.extraData.id;
    const user = auth.currentUser;

    //Initialise states 
   
    const [numStreakDaily, setNumStreakDaily] = useState(0);
    const [streakStats, setStreakStats] = useState('🔥: ');
    const [urlProfilePic, setUrlProfilePic] = useState(null);
   
    const [settings, setSettings] = useState(false);
    const [loading, setLoading] = useState(true);

    const [past, setPast] = useState('');
    const [present, setPresent] = useState('');
    const [future, setFuture] = useState('');
    const [dob, setDob] = useState('');
    const [skills, setSkills] = useState('');
    const [tenseModal, setTenseModal] = useState(false);
    const [aboutModal, setAboutModal] = useState(false);
    const [activitiesModal, setActivitiesModal] = useState(false);
    const [act1Modal, setAct1Modal] = useState(false);
    const [act2Modal, setAct2Modal] = useState(false);
    const [act3Modal, setAct3Modal] = useState(false);
    const [act4Modal, setAct4Modal] = useState(false);
    const [act5Modal, setAct5Modal] = useState(false);
    

    const[days, setDays] = useState(0);
    const[growTree, setGrowTree]  = useState(null);


    //Retrieve life tree images from firebase storage 
    const tree0 = st.ref('tree/tree0.png');
    const tree1 = st.ref('tree/tree1.png');
    const tree2 = st.ref('tree/tree2.png');
    const tree3 = st.ref('tree/tree3.png');
    const tree4 = st.ref('tree/tree4.png');
    const tree5 = st.ref('tree/tree5.png');
    


    //References to firebase collections
    const userStatsRef = db.collection('userStats');
    const userDataRef = db.collection('userData');
    const lifeJourneyRef = db.collection('lifeJourney');
    const profilePicRef = st.ref('users/' + user.uid + '/profilePicture/' + user.photoURL);

    //Get current day 
    const date = new Date();
    const currentDay = date.toISOString().split('T')[0];

    //Set all data for home page 
    const setHome = async () => {
  
        userStatsRef.doc(userID).get().then((doc) => {
            if (doc.exists) {
                const dateStored = doc.data().currentDay;
                const streak = doc.data().numStreakDaily;
                const daysUsed = doc.data().numDaysUsed;

                setTree(daysUsed);


                if (currentDay === dateStored) {
                    setDays(daysUsed);
                    setNumStreakDaily(streak);
                    setLoading(false);
                } else {
                    const storedUserDate = new Date(dateStored).setUTCHours(0, 0, 0, 0);
                    // Used to get the previous date.
                    const dateBeforeCurrent = new Date(new Date().setDate(new Date().getDate() - 1)).setUTCHours(0, 0, 0, 0);
                    
                    if (dateBeforeCurrent === storedUserDate) {
                        userStatsRef
                            .doc(userID)
                            .set({
                                idUser: userID,
                                currentDay: currentDay,
                                numDaysUsed: (daysUsed + 1),
                                numStreakDaily: (streak + 1),
                            })
                            .then(() => {
                                setDays(daysUsed + 1);
                                setNumStreakDaily(streak + 1);
                                setLoading(false);
                            });
                    } else {
                        userStatsRef
                            .doc(userID)
                            .set({
                                idUser: userID,
                                currentDay: currentDay,
                                numDaysUsed: (daysUsed + 1),
                                numStreakDaily: 0,
                            })
                            .then(() => {
                                setDays(daysUsed + 1);
                                setNumStreakDaily(0);
                                setLoading(false);
                            });
                    }
                }
            } else {
                const data = {
                    idUser: userID,
                    currentDay: currentDay,
                    numDaysUsed: days,
                    numStreakDaily: numStreakDaily,

                };
                userStatsRef
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

    //Add data about user to firebase 

    const onSaveAboutMe = async() => {
        
        if ((dob && dob.length) || (skills && skills.length) > 0) {
            const data = {
               idUser: userID,
               dateOfBirth: dob,
               skills: skills,
            };
            userDataRef
                .add(data)
                .then(() => {
                    setAboutModal(!aboutModal) 
                    Keyboard.dismiss();
                    
  

                })
                .catch((error) => {
                    alert('Error: ' + error);
                });
        }
        
    };

    //Add data regarding user's life journey and goals 

    const onSaveGoals = async() => {
        
        if ((past && past.length) || (present && present.length) || (future && future.length) > 0) {
            const data = {
               idUser: userID,
               pastInfo: past,
               presentInfo: present,
               futureInfo: future,
            };
            lifeJourneyRef
                .add(data)
                .then(() => {
                    setTenseModal(!tenseModal) 
                    Keyboard.dismiss();
                    
  

                })
                .catch((error) => {
                    alert('Error: ' + error);
                });
        }
        
    };

    //Get user's date of birth and skills from firebase 

    useEffect(() => {
        userDataRef
            .where('idUser', '==', userID)
            .onSnapshot(
                querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        const userData = doc.data();
                        setDob(userData.dateOfBirth);
                        setSkills(userData.skills);
                        
                        
                    });
                },
                error => {
                    console.error(error);
                }
            );
    }, []);

    //Get user's life journey date from firebase 

    useEffect(() => {
        lifeJourneyRef
            .where('idUser', '==', userID)
            .onSnapshot(
                querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        const lifeJourney = doc.data();
                        setPast(lifeJourney.pastInfo);
                        setPresent(lifeJourney.presentInfo);
                        setFuture(lifeJourney.futureInfo);
                        
                    });
                },
                error => {
                    console.error(error);
                }
            );
    }, []);

    


    //Set user's profile picture

    const setProfilePic = async () => {
        //Allows the user to set their profile picture
        profilePicRef
            .getDownloadURL()
            .then((downloadURL) => {
                setUrlProfilePic(downloadURL);
            }).catch(() => {
                setUrlProfilePic('https://upload.wikimedia.org/wikipedia/commons/a/aa/Sin_cara.png');
            });
    };

    // set user's tree depending on days used 
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
  
    //Close settings to return to Home 
    const closeSettings = () => {
        setProfilePic();
        setSettings(false);
    };
    
    //Sets up home page when component loads 
    useEffect(() => {
        setHome();
        setProfilePic();
    }, []);

    if (loading) {
        return (
            <Loading loading={loading} />
        );
        
    } else if (settings == false) {
        return (
            <SafeAreaView style={styles.mainView}>
                <ScrollView>
                    <View>
                        <View style={styles.heading} >
                            <Text style={styles.homeTitle}>Hello, {username}! </Text>
                            <TouchableOpacity onPress={() => setSettings(true)} >
                                <Image style={styles.profilePic} source={{ uri: urlProfilePic }} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.streakDisplay} onPress={() => {
                                setStreakStats('Daily Streak: ');
                                setTimeout(() => { setStreakStats('🔥: '); }, 1000);
                            }}>
                                <Text style={styles.streakCount} > {streakStats} {numStreakDaily}</Text>
                            </TouchableOpacity>
                        </View>
                <View style={styles.modals}>
                        <TouchableOpacity
                                style={styles.touchableMod}
                                onPress={() => setAboutModal(true)}>
                                    <Text style={styles.modHeader}>About Me</Text>
                                    <Image style={styles.pic} source={{ uri: urlProfilePic}} />
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
                                onPress={onSaveAboutMe}
                                
                                />
                        </View>
                        </View>
                        </Modal>

                        <TouchableOpacity
                                style={styles.touchableMod}
                                onPress={() => setTenseModal(true)}>
                                    <Text style={styles.modHeader}>Life Journey and Goals</Text>
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
                                style={styles.modButton}
                                onPress={onSaveGoals}
                                />
                        </View>
                        </View>
                        </Modal>
                        </View>
                        <TouchableOpacity
                                style={styles.touchableM}
                                onPress={() => setActivitiesModal(true)}>
                                    <Text style={styles.modHHeader}>Activities</Text>
                         </TouchableOpacity>

                        <Modal
                        animationType='fade'
                        visible={activitiesModal}
                        transparent={true}
                        backgroundOpacity={0.5}
                        backgroundColor={'#000'}
                        onRequestClose={()=> setActivitiesModal(!activitiesModal)}>
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                            <View style={styles.selfEnd}>
                            <TouchableOpacity
                            onPress={()=>{
                                setActivitiesModal(!activitiesModal);
                            }}
                            >
                                <Ionicons
                                style={{paddingRight: 270}}
                                name='close'
                                size={30}/>
                            </TouchableOpacity>
                            </View>
                            <Text style={styles.modHead}>Activities:</Text>
                            <Text style={styles.actHeader}>Carry out these activities to help you come up with your life stories</Text>
                            <TouchableOpacity
                                style={styles.touchableActs}
                                onPress={() => setAct1Modal(true)}>
                                    <Text style={styles.actHead}>Shields</Text>
                         </TouchableOpacity>

                         <Modal
                        animationType='fade'
                        visible={act1Modal}
                        transparent={true}
                        backgroundOpacity={0.5}
                        backgroundColor={'#000'}
                        onRequestClose={()=> setAct1Modal(!act1Modal)}>
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                            <View style={styles.selfEnd}>
                            <TouchableOpacity
                            onPress={()=>{
                                setAct1Modal(!act1Modal);
                            }}
                            >
                                <Ionicons
                                style={{paddingRight: 270}}
                                name='close'
                                size={30}/>
                            </TouchableOpacity>
                            </View>
                            <Text style={styles.modActHead}>Shields</Text>
                            <View>
                                 <Text style={styles.AimHeader}>Aim</Text>
                                 <Text style={styles.aimDesc}>To evaluate your ability to communicate and acknowledge your emotions towards individuals or situations in your life</Text>
                                 <Text style={styles.materialsHeader}>Materials</Text>
                                 <Text style={styles.materialsDesc}>Paper, pens and/or Coat of Arms template</Text>
                                 <Text style={styles.activityHeader}>Activity</Text>
                                 <Text style={styles.activityDesc}>Either draw a coat of arms or use a template and split it into 4 sections “Happy, Sad, Meh and Angry”. In each section draw or write something which represents each feeling. Once you are done, use each section to create a new story in your digital passport. Take photos of your drawings and/or include your descriptions of each feeling.  </Text>
                     
                                    

                            </View>
                                
                        </View>
                        </View>
                        </Modal>

                         <TouchableOpacity
                                style={styles.touchableActs}
                                onPress={() => setAct2Modal(true)}>
                                    <Text style={styles.actHead}>How I Make Myself {'\n'} Feel Better</Text>
                         </TouchableOpacity>

                         <Modal
                        animationType='fade'
                        visible={act2Modal}
                        transparent={true}
                        backgroundOpacity={0.5}
                        backgroundColor={'#000'}
                        onRequestClose={()=> setAct2Modal(!act2Modal)}>
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                            <View style={styles.selfEnd}>
                            <TouchableOpacity
                            onPress={()=>{
                                setAct2Modal(!act2Modal);
                            }}
                            >
                                <Ionicons
                                style={{paddingRight: 270}}
                                name='close'
                                size={30}/>
                            </TouchableOpacity>
                            </View>
                            <Text style={styles.modActHead}>How I Make Myself Feel Better</Text>
                            <View>
                                 <Text style={styles.AimHeader}>Aim</Text>
                                 <Text style={styles.aimDesc}>To help you discover that you have coping skills which you can use in difficult situations</Text>
                                 <Text style={styles.materialsHeader}>Materials</Text>
                                 <Text style={styles.materialsDesc}>Paper, pens. Optional: magazine or clip-art/Google images.</Text>
                                 <Text style={styles.activityHeader}>Activity</Text>
                                 <Text style={styles.activityDesc}>Create a list of what you do to make yourself feel better when things are going bad. You might start by thinking about what might happen that makes you feel bad, and how you would solve it. When you discover something that soothes you, record it in some way by writing it down or drawing what you do. Depending on the list you have, you might want to go on and explore other things that you could do in future difficult situations. </Text>
                     
                                    

                            </View>
                                
                        </View>
                        </View>
                        </Modal>

                         <TouchableOpacity
                                style={styles.touchableActs}
                                onPress={() => setAct3Modal(true)}>
                                    <Text style={styles.actHead}>Life Graph/Map</Text>
                         </TouchableOpacity>

                         <Modal
                        animationType='fade'
                        visible={act3Modal}
                        transparent={true}
                        backgroundOpacity={0.5}
                        backgroundColor={'#000'}
                        onRequestClose={()=> setAct3Modal(!act3Modal)}>
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                            <View style={styles.selfEnd}>
                            <TouchableOpacity
                            onPress={()=>{
                                setAct3Modal(!act3Modal);
                            }}
                            >
                                <Ionicons
                                style={{paddingRight: 270}}
                                name='close'
                                size={30}/>
                            </TouchableOpacity>
                            </View>
                            <Text style={styles.modActHead}>Life Graph/Map</Text>
                            <View>
                                 <Text style={styles.AimHeader}>Aim</Text>
                                 <Text style={styles.aimDesc}>To explore your successes and accomplishments in life as well as any difficulties you have experienced along the way. </Text>
                                 <Text style={styles.materialsHeader}>Materials</Text>
                                 <Text style={styles.materialsDesc}>Large piece of drawing paper and pens. Optional: photos, magazines, craft materials and clip-art images</Text>
                                 <Text style={styles.activityHeader}>Activity</Text>
                                 <Text style={styles.activityDesc}>Design an image that represents your life story, reflecting your own experiences – both highs and lows – and different life stages. You can write dates, names and places or use pictures, photographs or symbols to illustrate your story.
The image can be as creative or simple as you choose, once you have completed creating your map/graph talk about your experiences in greater detail by creating stories in your digital passport. Take photos of your memorable possessions, narrate your stories via audio or video and enter how you feel. 
</Text>
                     
                                    

                            </View>
                                
                        </View>
                        </View>
                        </Modal>

                         <TouchableOpacity
                                style={styles.touchableActs}
                                onPress={() => setAct4Modal(true)}>
                                    <Text style={styles.actHead}>Moving Calendar</Text>
                         </TouchableOpacity>

                         <Modal
                        animationType='fade'
                        visible={act4Modal}
                        transparent={true}
                        backgroundOpacity={0.5}
                        backgroundColor={'#000'}
                        onRequestClose={()=> setAct4Modal(!act4Modal)}>
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                            <View style={styles.selfEnd}>
                            <TouchableOpacity
                            onPress={()=>{
                                setAct4Modal(!act4Modal);
                            }}
                            >
                                <Ionicons
                                style={{paddingRight: 270}}
                                name='close'
                                size={30}/>
                            </TouchableOpacity>
                            </View>
                            <Text style={styles.modActHead}>Moving Calendar</Text>
                            <View>
                                 <Text style={styles.AimHeader}>Aim</Text>
                                 <Text style={styles.aimDesc}>To make a visual representation of your movement since birth to the present time.</Text>
                                 <Text style={styles.materialsHeader}>Materials</Text>
                                 <Text style={styles.materialsDesc}>Large sheet of paper, pens. Optional: templates of houses/cars/whatever you find interesting.</Text>
                                 <Text style={styles.activityHeader}>Activity</Text>
                                 <Text style={styles.activityDesc}>Create a movement chart by drawing squares with an arrow going from one to the next. In each square describe the different places where you have stayed, include who you lived with and the dates you stayed there, and why you had to move. Don’t worry if you aren’t sure about anything, describe as much as you know. Try starting off by describing where you first stayed and end with where you stay now.  </Text>
                     
                                    

                            </View>
                                
                        </View>
                        </View>
                        </Modal>

                         <TouchableOpacity
                                style={styles.touchableActs}
                                onPress={() => setAct5Modal(true)}>
                                    <Text style={styles.actHead}>Moving On</Text>
                         </TouchableOpacity>

                         <Modal
                        animationType='fade'
                        visible={act5Modal}
                        transparent={true}
                        backgroundOpacity={0.5}
                        backgroundColor={'#000'}
                        onRequestClose={()=> setAct5Modal(!act5Modal)}>
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                            <View style={styles.selfEnd}>
                            <TouchableOpacity
                            onPress={()=>{
                                setAct5Modal(!act5Modal);
                            }}
                            >
                                <Ionicons
                                style={{paddingRight: 270}}
                                name='close'
                                size={30}/>
                            </TouchableOpacity>
                            </View>
                            <Text style={styles.modActHead}>Moving On</Text>
                            <View>
                                 <Text style={styles.AimHeader}>Aim</Text>
                                 <Text style={styles.aimDesc}>To learn about what items or people are most important to you in order to feel safe and secure in the future.</Text>
                                 <Text style={styles.materialsHeader}>Materials</Text>
                                 <Text style={styles.materialsDesc}>A box that you can open and close, objects, photographs etc. </Text>
                                 <Text style={styles.activityHeader}>Activity</Text>
                                 <Text style={styles.activityDesc}>Gather your prized possessions and store them safely in a box. You may decorate the box if you like. Consider the people who you would want to be a part of your future. Upload photos of those special possessions/people to the digital passport, discuss in greater detail as to why you want these possessions/ people to be a part of your future i.e. why are they special to you? </Text>
                     
                                    

                            </View>
                                
                        </View>
                        </View>
                        </Modal>

                        
   
                        </View>
                        </View>
                        </Modal>

                        <View style={styles.treeBody}>
                            <Text style={styles.treeHeader}>Watch your tree grow as you grow</Text>
                        <Image source={{ uri: growTree }} style={styles.tree} />
                        </View>
                    </View>
                </ScrollView>
                </SafeAreaView>
        );
    } else {
        return (
            <Settings {...props} closeSettings={closeSettings} logout={logout} />
        );
    }
}

