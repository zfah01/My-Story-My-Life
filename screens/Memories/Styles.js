import { StyleSheet, Dimensions, } from 'react-native';

const entryStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#AFEEEE',
    },
    contentContainer: {
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
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    moodModules: {
        flexDirection: 'row',
        paddingBottom: 50,
    },
    moodModUnselected: {
        marginTop: 10,
        marginLeft: 5,
        textAlign: 'center',
        paddingLeft: 10,
    },
    moodModSelected: {
        marginTop: 10,
        marginLeft: 5,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#00e676',
        borderRadius: 9,
        paddingLeft: 10,
    },
    moodFaces: {
        marginTop: 10,
        height: 50,
        width: 66,
        alignItems: 'center',
    },
    journalEntry: {
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: '#ebebeb',
        borderRadius: 10,
        maxHeight: 250,
        height: 150,
    },
    obsessionEntry: {
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
    submitButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 20,
    },
    submitButton: {
        padding: 15,
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


// Function used to store height of device being used for responsive design on the homescreen.
const height = Dimensions.get('window').height;

const listStyles = StyleSheet.create({
    contentContainer: {
        margin: 20,
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 25,
        height: height / 1.45,
    },
    listView: {
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
    entryMood: {
        paddingLeft: 10,
        paddingBottom: 5,
        fontSize: 14,
        textAlign: 'right',
    }
});

export { listStyles, entryStyles };