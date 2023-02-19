import { StyleSheet, Dimensions } from 'react-native';

// Function used to store height of device being used for responsive design on the homescreen.
const height = Dimensions.get('window').height;

export const settingStyles = StyleSheet.create({
    contentContainer: {
        margin: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        height: height / 1.35,
    },
    imageBox: {
        width: 150,
        height: 150,
        borderRadius: 150,
        alignSelf: 'center',
        marginBottom: 10,
    },
    progress: {
        alignSelf: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        paddingTop: 15,
    },
    content: {
        fontSize: 14,
        color: '#000000',
        paddingBottom: 10,
    },
    pictureButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00e676',
        borderRadius: 15,
        width: 250,
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 5,
    },
    logoutButton: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f57367',
        borderRadius: 15,
        width: 250,
        alignSelf: 'center',
        marginTop: 10,
    },
    returnHomeButton: {
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'flex-start',
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',
    },
    footerText: {
        paddingTop: 30,
        textAlign: 'center',
        color: '#bababa',
    },
    hyperLink: {
        textDecorationLine: 'underline',
        color: 'blue',
        textAlign: 'center',
    },
});
