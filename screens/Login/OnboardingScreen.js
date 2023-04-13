import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

//Function to skip onboarding screen
const Skip = ({ ...props }) => (
	<TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
		<Text style={{ fontSize: 16 }}>Skip</Text>
	</TouchableOpacity>
);
// Function to go to next boarding screen 
const Next = ({ ...props }) => (
	<TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
		<Text style={{ fontSize: 16 }}>Next</Text>
	</TouchableOpacity>
);
//Function for done viewing onboarding screen 
const Done = ({ ...props }) => (
	<TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
		<Text style={{ fontSize: 16 }}>Done</Text>
	</TouchableOpacity>
);

function OnboardingScreen({ navigation }) {
	return (
		<Onboarding
			SkipButtonComponent={Skip}
			NextButtonComponent={Next}
			DoneButtonComponent={Done}
			onSkip={() => navigation.replace("Welcome")}
			onDone={() => navigation.navigate("Welcome")}
			pages={[
				{
					backgroundColor: "#E3F6E6",
					image: (
						<Image
							style={{ marginTop: -100, marginBottom: -50, height: 300, width: 300 }}
							// @ts-ignore
							source={require("../../assets/identityB.png")}
						/>
					),
					title: "Build your Identity",
					subtitle: "Honor your story and discover your sound",
				},
				{
					backgroundColor: "#fff",
					image: (
						<Image
							style={{ marginTop: -100, marginBottom: -50, height: 300, width: 300 }}
							// @ts-ignore
							source={require("../../assets/memories.png")}
						/>
					),
					title: "Narrate your Life Stories",
					subtitle: "Revisit memorable moments of your life ",
				},
				{
					backgroundColor: "#fff",
					image: (
						<Image
							style={{ marginTop: -100, marginBottom: -50, height: 300, width: 300 }}
							// @ts-ignore
							source={require("../../assets/timelineB.png")}
						/>
					),
					title: "Easy to find timeline",
					subtitle: "View your life stories",
				},
				{
					backgroundColor: "#fff",
					image: (
						<Image
							style={{ marginTop: -100, marginBottom: -50, height: 300, width: 300 }}
							// @ts-ignore
							source={require("../../assets/contact.png")}
						/>
					),
					title: "Discover Lost Momentos",
					subtitle: "Get in touch with your carer, family or friends",
				},
			]}
		/>
	);
}

export default OnboardingScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});