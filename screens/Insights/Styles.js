import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const styles = StyleSheet.create({

    container: {
        padding: 10,
        marginBottom: 40,
        marginTop: 40,
    },

    image: {
        paddingTop: 15
    },

    container1: {
        //borderWidth:2,
        backgroundColor: "#779CAB",
        borderRadius: 30,
        width: Dimensions.get('screen').width,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        marginTop: 30,
        paddingTop: 5,

    },

    container2: {
        //borderWidth:2,
        backgroundColor: "#66717E",
        borderRadius: 30,
        height: 60,
        width: 360,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-evenly",
        position: 'absolute',
        bottom: 160,
        marginLeft: 30

    },

    container3: {
        //borderWidth:2,
        backgroundColor: "#2B5564",
        borderRadius: 15,
        height: 150,
        width: 150,
        alignSelf: "center",
        margin: 15,
        paddingTop: 35,
        alignContent: "center",
        alignItems: "center",
    },

    container4: {
        //borderWidth:2,
        backgroundColor: "#687594",
        padding: 0,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        height: 70,
        width: 80,
        alignSelf: "center",
        margin: 15,
        marginTop: 20,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-evenly",

    },

    container5: {
        //borderWidth:2,
        backgroundColor: "#2B5564",
        borderRadius: 15,
        height: 150,
        width: 330,
        alignSelf: "center",
        margin: 15,
        paddingTop: 35,
        alignContent: "center",
        alignItems: "center",
    },



    Htitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        color: colors.white,
        marginLeft: 35,
        marginRight: 125
    },

    Htitle1: {
        fontSize: 30,
        fontWeight: "bold",
        marginLeft: 20,
        color: colors.white,
    },


    SHtitle: {
        fontSize: 24,
        alignSelf: "center",
        marginTop: 5,
        color: colors.white,
        fontWeight: "bold"
    },

    SHtitle2: {
        fontSize: 18,
        alignSelf: "center",
        marginTop: 0,
        color: colors.white,
        fontWeight: "bold"
    },

    SHtitle3: {
        fontSize: 24,
        alignSelf: "center",
        marginTop: 5,
        color: colors.white,
        fontWeight: "bold"
    },

    button: {
        marginVertical: 20,
    },

    oval: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "red",
        alignItems: 'center',
        alignSelf: "center"

    },

    button: {
        //borderWidth:2,
        backgroundColor: colors.white,
        padding: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        height: 120,
        width: 140,
        alignSelf: "center",
        margin: 15,
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: -10, height: 5 },
        shadowColor: colors.blue,

    },
    title:
    {
        margin: 20,
        textAlign: 'justify',
        textAlignVertical: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: colors.blue,
        marginBottom: 0,

    },
})

 