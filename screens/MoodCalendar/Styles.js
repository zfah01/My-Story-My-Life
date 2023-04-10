import { StyleSheet, Platform } from 'react-native';


export const styles = StyleSheet.create({
  mainView: {
        margin: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
    },
    moodTitle: {
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
    moodText: {
        paddingLeft: 10,
        padding: 5,
        fontSize: 14,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000000',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    moodBackground: {
        borderRadius: 21,
        width: 20,
        height: 20,
    },
    moodContainer: {
        flexDirection: 'row',
        height: 40,
    },

    touchableMod: {
        backgroundColor: '#00e676',
        margin: Platform.OS === "ios" ? 20 : null,
        padding: 10,
        width: Platform.OS === "ios" ? 200 : 300,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: Platform.OS === "ios" ? 80 : 62,
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
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    popupTitle: {
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: 'bold',
        top: 33,
        color: '#000000',
    },
    storyHeader: {
        fontSize: 16,
        textAlign: 'left',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#000000',
        paddingTop: 20,
        marginTop: 20,
      },
      story: {
        paddingBottom: 12,
        paddingTop: 10,
        fontSize: 16
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
        textAlign: 'center',
        fontSize: 25,
        top: 33,
        paddingBottom: 10,
    },
    popupMainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 40,
        marginRight: 40,


    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingRight: 200, 
        textAlign: 'left',
        color: '#448aff',
       
    },
    container: {
        marginTop: 30,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }, 
      lookView: {
        backgroundColor: '#AFEEEE',
        flex: 1
        
      },
      playText: {
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
        margin: 8,
        marginLeft: 20,
      },
  
      headerBox: {
        display: "flex",
        flexDirection: "row",
        marginVertical: 10,
        height: 40,
        width: 180,
        backgroundColor: '#2e2eff',
        borderRadius: 10,
        
      },
      header: {
        fontSize: 25,
        paddingTop: "2%",
      },
    
      button: {
        backgroundColor: "#999DC3",
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
      },
   
  
      returnButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 10
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
  
      date: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    
        
      },
      memoryButton: {
        backgroundColor: "rgba(255, 255, 255, 0.77)",
        marginBottom: 6,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      deleteButton: {
        backgroundColor: "rgb(182, 182, 182)",
        width: "20%",
      },
      voiceButton: {
        marginVertical: "2%",
        marginHorizontal: "1%",
      },
      video: {
        width: 330, height: 240,
        borderRadius: 9,
        marginLeft: 10,
  
      },
  
      image: {
        width: 330, height: 240,
        borderRadius: 9,
        marginLeft: 20,
        
  
      },
      subHeaderTitle: {
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#000000',
    },
  
    storyHeader: {
      fontSize: 16,
      textAlign: 'left',
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: '#000000',
      paddingTop: 20
    },
      emojiLabels: {
        textAlign: 'center',
        marginTop: 5,
      },
  
      title: {
        textAlign: 'center',
        fontSize: 30,
        paddingBottom: 10,
      },
  
      story: {
        paddingBottom: 12,
        paddingTop: 10,
        fontSize: 16
      },
      moodHeader: {
      fontSize: 16,
      textAlign: 'left',
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: '#000000',
      paddingTop: 20
      },
      
      contentContainerScroll: {
        margin: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        maxHeight: '80%',
    },
   
    
});