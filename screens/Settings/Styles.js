import { StyleSheet, Dimensions } from 'react-native';

const height = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    settingsView: {
        marginTop: 80,
        margin: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        height: height / 1.35,
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 150,
        alignSelf: 'center',
        marginBottom: 10,
    },
    progress: {
        alignSelf: 'center',
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        paddingTop: 15,
    },
    settingSubText: {
        fontSize: 14,
        color: '#000000',
        paddingBottom: 10,
    },
    settingButton: {
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
    buttonOut: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff3333',
        borderRadius: 15,
        width: 250,
        alignSelf: 'center',
        marginTop: 10,
    },
    homeReturn: {
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'flex-start',
    },
    settingButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',
    },
    footerText: {
        paddingTop: 30,
        textAlign: 'center',
        color: '#bababa',
    }
});
