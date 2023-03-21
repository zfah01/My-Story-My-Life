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
        borderRadius: 21,
        width: 20,
        height: 20,
    },
    keyIndivContainer: {
        flexDirection: 'row',
        height: 40,
    },

    touchableMod: {
        backgroundColor: '#00e676',
        margin: 20,
        padding: 10,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: 80,
        //backgroundColor: '#FFFFFF',
        borderRadius: 25,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS

        elevation: 2, // Android
    }, 
    keyContainer: {
        marginTop: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 380,

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