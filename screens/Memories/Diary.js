import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { listStyles } from './Styles';
import { db }from '../../firebase/firebase';
import ViewSingleEntry from './ViewSingleEntry';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Video } from 'expo-av';

export default function Diary(props) {

    //Initialise States 
    const [allEntries, setAllEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedID, setSelectedID] = useState(null);

    const memoriesRef = db.collection('memories');
    const userID = props.extraData.id;

    //If the authorId matches the userID life events are displayed 
    useEffect(() => {
        memoriesRef
            .where('authorID', '==', userID)
            .orderBy('eventDateAt', 'asc')
            .onSnapshot(
                querySnapshot => {
                    const newMemories = [];
                    querySnapshot.forEach((doc) => {
                        const memory = doc.data();
                        memory.id = doc.id;
                        newMemories.push(memory);
                    });
                    setAllEntries(newMemories);
                },
                error => {
                    alert(error);
                }
            );
    }, []);

    //Allows user to search by title, event date, mood or story text 
    const search = (searchText) => {
        setSearchText(searchText);
        const filteredEntries = allEntries.filter(function (item) {
            // use title, mood, date to view entry 
            return item.titleText.toLowerCase().includes(searchText.toLowerCase()) || item.eventDate.includes(searchText) || item.storyText.toLowerCase().includes(searchText.toLowerCase())||item.moodSelected.toLowerCase().includes(searchText.toLowerCase());
        });
        setFilteredEntries(filteredEntries);
    };


   

    //Selected id set to back null once user returns from viewing a life event 
    const unsetCurrentEntry = () => {
        setSelectedID(null);
    };

    //Displays the ViewSingleEntry page if selected ID has been best 
    if (selectedID) {
        return (
            <View>
                <ViewSingleEntry {...props} extraData={userID} currentEntryID={selectedID} onBack={unsetCurrentEntry} />

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
                <View style={listStyles.contentContainer}>
                <FlatList
                    data={filteredEntries && filteredEntries.length > 0 ? filteredEntries : allEntries}
                    keyExtractor={(item) => item.id}

                    renderItem={({ item }) => <TouchableOpacity style={listStyles.listView} onPress={() => setSelectedID(item.eventDateAt)}>
                    <Text style={listStyles.entryDesc}>{item.eventDate}</Text>
                    <Text style={listStyles.entryDate}>{item.titleText}</Text>
                    <Text style={listStyles.entryDesc} numberOfLines={2} >{item.storyText}</Text>
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
                    <Text style={[listStyles.entryMood, { color: item.moodSelected === 'Happy' ? '#108206' : item.moodSelected === 'Meh' ? '#e38e07' : item.moodSelected === 'Sad' ? '#112dec' : '#f90505' }]}>Your mood: {item.moodSelected} </Text>
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
