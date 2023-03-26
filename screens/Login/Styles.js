import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    intro: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === "ios" ? 70 :30,
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mainView: {
        margin: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        justifyContent: 'center',
    },
    logo: {
        marginTop: 20,
        marginBottom: 10,
        height: 100,
        width: 134,
        alignSelf: 'center',
    },
    textInput: {
        height: 50,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#f0efed',
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 10,
    },
    buttonLogin: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00e676',
        borderRadius: 15,
        width: 150,
        alignSelf: 'center',
        marginTop: 20,
    },
    loginText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000000',
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    accountText: {
        fontSize: 16,
    },
    createLink: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6db8bf',
    }, 
    passwordGuidelines:{
        textAlign: 'center',
        color: '#8f8f8f',
        fontSize: 14,
        fontStyle: 'italic',
    }
});