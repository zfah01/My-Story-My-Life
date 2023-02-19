import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    mainTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentContainer: {
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
    loginBTN: {
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
    createAnAccountText: {
        fontSize: 16,
    },
    createAccountLink: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6db8bf',
    }, 
    contentText:{
        textAlign: 'center',
        color: '#8f8f8f',
        fontSize: 14,
        fontStyle: 'italic',
    }
});