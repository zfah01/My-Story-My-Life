import { StyleSheet, Dimensions, Platform } from 'react-native';

const storyStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#AFEEEE',
       paddingBottom: 25
    },
    mainView: {
        margin: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000'
    },
    date: {
        fontSize: 16,
        marginTop: 20,
        marginBottom: Platform.OS === "ios" ? null : -10,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    moodModules: {
        flexDirection: 'row',
        marginLeft: Platform.OS === "ios" ? -4 : -9,
        paddingBottom: 50,
    },
    moodNotSelected: {
        marginTop: 10,
        marginLeft: 5,
        textAlign: 'center',
        paddingLeft: 10,
    },
    moodNotPicked: {
      display: 'none',
    },
    moodPicked: {
       
      marginLeft: Platform.OS === "ios" ? 320 : 310
      },
    moodChosenFaces: {
       height: 42,
       width:40,
       marginBottom: -9,
    
      
      },
    moodSelections: {
        flexDirection: 'row',
      
    },
    moodSelected: {
        marginTop: 10,
        marginLeft: 5,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#00e676',
        borderRadius: 9,
        paddingLeft:  Platform.OS === "ios" ? 10 : 1,
    },
    moodFaces: {
        marginTop: 10,
        height: 32,
        width: 35,
        alignItems: 'center',
    },
    moodConfused: {
        marginTop: 10,
        marginLeft: 10,
        height: 30,
        width: 35,
        alignItems: 'center',
    },
    storyEntry: {
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: '#ebebeb',
        borderRadius: 10,
        maxHeight: 250,
        height: 150,
    },
    storyTitle: {
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: '#ebebeb',
        borderRadius: 10,
        maxHeight: 40,
        height: 40,
    },
    subHeader: {
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#000000',
    },
    submitView: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: Platform.OS === "ios" ? 20 : 5,
    },
    submitButton: {
        padding: Platform.OS === "ios" ? 15 : 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00e676',
        borderRadius: 15,
        width: 150,
    },
    submitText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000000',
    },
    returnButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    returnButton: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange',
        borderRadius: 15,
        width: 150,
    },
    returnText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000000',
    },
    dateTitle: {
        padding: 15,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000000',
    }
});



const height = Dimensions.get('window').height;

const timelineStyles = StyleSheet.create({
    timelineContainer: {
        margin: 20,
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 25,
        height: height / 1.45,
    },
    timelineView: {
        borderBottomWidth: 1,
        borderRadius: 0.5,
        borderColor: 'rgba(215, 210, 210, 0.4)',
    },
    entryDesc: {
        paddingTop: 10,
        paddingLeft: 10,
        fontSize: 14,
        height: 44,
        color: '#000000',
    },
    entryDate: {
        paddingTop: 8,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        color: '#000000',
        fontWeight: 'bold',
    },
    chosenMood: {
        paddingLeft: 10,
        paddingBottom: 5,
        fontSize: 14,
        textAlign: 'right',
    }
});

export { timelineStyles, storyStyles };