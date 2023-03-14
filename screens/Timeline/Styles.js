import { StyleSheet } from 'react-native';


export const journalStyles = StyleSheet.create({
    contentContainer: {
        margin: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 20,
        paddingTop: 20,
        color: '#000000'
    },
    keyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
        color: '#000000',
        textAlign: 'center'
    },
    contentText: {
        paddingLeft: 10,
        padding: 5,
        fontSize: 14,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000000',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    keyBackground: {
        borderRadius: 7,
        width: 30,
        height: 30,
    },
    keyIndivContainer: {
        flexDirection: 'row',
        height: 40,
    },
    keyContainer: {
        marginTop: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,

    },
    keyContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 20,
        color: '#000000'
    },
    popupText: {
        color: '#000000',
        marginTop: 20,
        fontSize: 18,
        marginRight: 50,
    },
    popupContainer: {
        flexDirection: 'row',
        paddingRight: 10,
    },
    titleText: {
        fontSize: 16, 
        paddingTop: 5,
        width: 180,
        color: '#000000',
    },
    popupMainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 40,
        marginRight: 40,


    },
    buttonText: {
        color: '#448aff',
        paddingTop: 25,
        textAlign: 'center',
        fontSize: 20,
    }
});