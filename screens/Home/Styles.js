import {Dimensions, StyleSheet, Platform } from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export const  styles = StyleSheet.create({
    mainView: {
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#AFEEEE',
        flex: 1,
        paddingTop:Platform.OS === 'ios'? null: 10,
    
    },
    background: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    heading: {
        flexDirection: 'row',
        paddingTop: 4,
    },
    homeTitle: {
        paddingTop: 5,
        paddingLeft: 5,
        paddingRight: 20,
        textAlign: 'left',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
        width: width / 1
    },
    profilePic: {
        position: 'absolute',
        top: 5,
        right: 15,
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    tree: {
        alignSelf: 'center',
        height: 400,
        width: 200,
        resizeMode: 'contain',
    },
    treeBody: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 4,
    },

    daysUsed: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingTop: 15,
        color: '#000000',
        marginBottom: 20,
    },
   
    streakCount: {
        backgroundColor: '#00e676',
        borderRadius: 12,
        overflow: 'hidden',
        padding: 10,
        color: '#000000',

    },
    streakDisplay: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingTop: 5,
        paddingLeft: 10,
    },
    tenseHeader: {
        textAlign: 'left', 
        
       
    },
    contentContainer: {
        flexWrap: 'wrap',
        height: 80,
        width: 270,
        margin: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        alignSelf: 'flex-start',
       
    },
    treeHeader: {
        fontSize: 17,
        fontStyle: 'italic',
        
    },
    actHeader: {
        fontSize: 17,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingBottom: 5,
        
    },

    questions: {
        margin: 10,
        marginTop: 30,
    },

    centerView:{
        flex:1,
        justifyContent: 'center',
        allignItems: 'center',
        //marginTop:56,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'relative'
      },
      modalView:{
        width: '88%',
        height: Platform.OS == "ios" ? '65%' : '88%',
        backgroundColor: '#FFF', 
        margin:28,
        shadowColor:'#3E4985',
        shadowRadius:10,
        shadowOffset:10,
        borderRadius:10,
        padding:20,
        alignItems:'center',
        shadowColor:'#000',
      },
  


    modHeader: {
        fontSize: Platform.OS == "ios" ? 20 : 18,
        margin: 30,
        textAlign: 'center',
        fontStyle: 'italic' 
    }, 

    actHead: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 15, 
    }, 
    modHHeader: {
        fontSize: 20,
        margin: 30,
        textAlign: 'center',
        fontStyle: 'italic' 
    }, 
    modHead: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    }, 

    modActHead: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    }, 
    modButton: {
        backgroundColor: 'green', 
        width:'30%',
        borderRadius:30,
        
    },
    touchableMod: {
        backgroundColor: '#00e676',
        width: 170,
        height: 130,
        margin: 10,
        marginTop: 30,
        borderRadius: 9,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS

        elevation: 2, // Android
    }, 

    touchableActs: {
        backgroundColor: '#00e676',
        width: 180,
        height: 60,
        margin: 8,
        borderRadius: 9,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS

        elevation: 2, // Android
    }, 
    touchableM: {
        backgroundColor: '#00e676',
        width: 170,
        height: 100,
        margin: 10,
        alignSelf: 'center',
        
        borderRadius: 9,
        shadowColor: 'rgba(0,0,0, .4)', 
        shadowOffset: { height: 1, width: 1 }, 
        shadowOpacity: 1, 
        shadowRadius: 1, 

        elevation: 2, 
    },
    modals: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pic: {
        position: 'absolute',
        margin: 60,
        marginLeft: 54,
        width: 60,
        height: 60,
        borderRadius: 40,

    },
    AimHeader :{
        textAlign: 'left',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        paddingBottom: 5,
        marginTop: 20,
    },
    aimDesc : {
        fontStyle: 'italic',
        fontSize: 15,
    },
    materialsHeader: {
        textAlign: 'left',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        paddingBottom: 5,
        paddingTop: 20,
    },
    materialsDesc : {
        fontStyle: 'italic',
        fontSize: 15,
    },
    activityHeader: {
        textAlign: 'left',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        paddingBottom: 5,
        paddingTop: 20,
    },
    activityDesc: {
        fontStyle: 'italic',
        fontSize: 15,
    },
});