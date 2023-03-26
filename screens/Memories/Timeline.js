import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { timelineStyles } from './Styles';
import { db }from '../../firebase/firebase';
import ViewLifeEvent from './ViewLifeEvent';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Video } from 'expo-av';

export default function Timeline(props) {

    //Initialise States 
    const [allStories, setallStories] = useState([]);
    const [filteredStories, setfilteredStories] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedID, setSelectedID] = useState(null);

    const memoriesRef = db.collection('memories');
    const userID = props.extraData.id;

    //If the idUser matches the userID life events are displayed 
    useEffect(() => {
        memoriesRef
            .where('idUser', '==', userID)
            .orderBy('eventDateAt', 'asc')
            .onSnapshot(
                querySnapshot => {
                    const newMemories = [];
                    querySnapshot.forEach((doc) => {
                        const memory = doc.data();
                        memory.id = doc.id;
                        newMemories.push(memory);
                    });
                    setallStories(newMemories);
                },
                error => {
                    alert(error);
                }
            );
    }, []);

    //Allows user to search by title, event date, mood or story text 
    const search = (searchText) => {
        setSearchText(searchText);
        const filteredStories = allStories.filter(function (item) {
            // use title, mood, date to view entry 
            return item.titleText.toLowerCase().includes(searchText.toLowerCase()) || item.eventDate.includes(searchText) || item.storyText.toLowerCase().includes(searchText.toLowerCase())||item.moodSelected.toLowerCase().includes(searchText.toLowerCase());
        });
        setfilteredStories(filteredStories);
    };


   

    //Selected id set to back null once user returns from viewing a life event 
    const unsetCurrentEntry = () => {
        setSelectedID(null);
    };

    //Displays the ViewLifeEvent page if selected ID has been best 
    if (selectedID) {
        return (
            <View>
                <ViewLifeEvent {...props} extraData={userID} currentEntryID={selectedID} onBack={unsetCurrentEntry} />

            </View>
        );
    }

    


    return (
            <SafeAreaView style={styles.diaryView}>
            <SearchBar
                round={true}
                lightTheme={true}
                placeholder='Search by Title, Mood, Date or Story'
                autoCapitalize='none'
                onChangeText={search}
                value={searchText}
                 />
                <View style={timelineStyles.timelineContainer}>
                <FlatList
                    data={filteredStories && filteredStories.length > 0 ? filteredStories : allStories}
                    keyExtractor={(item) => item.id}

                    renderItem={({ item }) => <TouchableOpacity style={timelineStyles.timelineView} onPress={() => setSelectedID(item.eventDateAt)}>
                    <Text style={timelineStyles.entryDesc}>{item.eventDate}</Text>
                    <Text style={timelineStyles.entryDate}>{item.titleText}</Text>
                    <Text style={timelineStyles.entryDesc} numberOfLines={2} >{item.storyText}</Text>
                    <ScrollView horizontal={true}>
                    <View style={{flexDirection: "row"}}>
                    {item.postImages &&
                        item.postImages.map(image => 
                        <Image
                            key={image}
                            source={{ uri: image}} style={{ 
                            width: 300, 
                            marginLeft: 35,
                            height: 180,
                            borderRadius: 9,
                            alignSelf:'center',
                            marginTop:10
                            }}
                            resizeMode='cover' 
                        />
                        )
                    }

                    {item.postVideos &&
                        item.postVideos.map(video => 
                        <Video
                        key={video}
                        source={{uri: video}}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                        style={{ 
                            width: 300, 
                            marginLeft: 35,
                            height: 180,
                            borderRadius: 9,
                            alignSelf:'center',
                            marginTop:10
                            }}
                      
                      />
                        )
                    }

                    </View>
                    </ScrollView>
                    <Text style={[timelineStyles.entryMood, { color: item.moodSelected === 'Happy' ? '#108206' : item.moodSelected === 'Meh' ? '#e38e07' : item.moodSelected === 'Sad' ? '#112dec' : '#f90505' }]}>Your mood: {item.moodSelected} </Text>
                </TouchableOpacity>
                } />
            </View>
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    diaryView: {
        backgroundColor: '#AFEEEE',
        flex: 1,
      

    },
});
