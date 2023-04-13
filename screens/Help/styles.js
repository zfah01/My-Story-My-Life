import { Dimensions, StyleSheet, Platform } from "react-native";
import { colors } from "../../utils/colors";

export const styles = StyleSheet.create({

    container: {
        padding: 10,
        marginBottom: 40,
        marginTop: 40,
    },

    images: {
      width: 130,
      height: 100,
      margin: 20,
      marginTop: Platform.OS == "ios" ? -30 : -35,
    },
    images3: {
        width: 120,
        height: Platform.OS == "ios" ? 80 : 70,

        margin: 30,
        marginTop: Platform.OS == "ios" ? -30 : -28,
      },
      images4: {
        width: 120,
        height: Platform.OS == "ios" ? 90 : 80,
        margin: 30,
        marginTop:Platform.OS == "ios" ? -40 : -38,
      },
      images5: {
        width: 85,
        height: 80,
        margin: 50,
        marginTop:Platform.OS == "ios" ? -30 : -36,
      },
      images6: {
        width: Platform.OS == "ios" ? 100 : 92,
        height: 78,
        margin: Platform.OS == "ios" ? 40 : 45,
        marginTop:Platform.OS == "ios" ? -27 : -35,
      },


    image: {
        paddingTop: 15
    },

    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingBottom: 10, 
        marginLeft: 15,
       
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
        fontSize: 17,
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
    blurb: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign:'center',

    },
    contentContainer: {
        margin: 35,
        padding: Platform.OS === 'ios'? 10: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        marginBottom: Platform.OS === 'ios'? null: 15,
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
    rowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20
        

    },
    touchableMod: {
        backgroundColor: '#00e676',
        width: 180,
        height: 150,
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
        width: 200,
        height: 100,
        margin: 8,
        borderRadius: 9,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS

        elevation: 2, // Android
    }, 
    rowTouchables: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop:  Platform.OS === "android" ? 2 : 10,
       


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

 