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

    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingBottom: 10, 
        marginLeft: 15,
    },

    

    headingTracker: {
        fontSize: 24,
        alignSelf: "center",
        marginTop: 5,
        color: colors.white,
        fontWeight: "bold"
    },

    months: {
        fontSize: 24,
        alignSelf: "center",
        marginTop: 5,
        color: colors.white,
        fontWeight: "bold"
    },

    heading:
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

 