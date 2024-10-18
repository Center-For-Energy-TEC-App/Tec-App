import React from "react";
import { View, Text, StyleSheet} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function LearnMore(){

    return(
        <ScrollView contentContainerStyle={styles.wrapper}>
            <Text style={styles.header}>About the App</Text>
            <Text style={styles.text}>The Triton Energy Climate (TEC) Mobile App was developed by an interdisciplinary team of students and researchers at UC San Diego’s Center for Energy Research. The dataset comes from the DNV Energy Transition Outlook*, which can be found online at dnv.com/eto and dnv.com/eto-data. All calculations made as a result of user inputs within app are generated by the Triton Energy Climate Model.</Text>
            <Text style={styles.text}>Carbon dioxide (CO2) emissions are the largest driver of global climate change with the longest-lasting impacts: one-fifth of CO2 emitted today will still be in the earth’s atmosphere a thousand years from now. Over 80% of CO2 emissions come from burning fossil fuels: oil, gas, and coal. Replacing these fuels quickly with non-carbon emitting energy sources such as solar and wind is critical in lessening future impacts of climate change.</Text>
            <Text style={styles.text}>Predictions about future global warming and climate change impacts are directly tied to how much CO2 humans release in the coming century. Non-carbon renewable energy sources are the fastest-growing energy options worldwide. They’re now capable of quickly and affordably replacing fossil fuels, stopping CO2 emissions, and powering the future.</Text>
            <Text style={styles.subText}>* This work is partially based on data developed by DNV AS, ©DNV AS. 2023, but the resulting work has been prepared by UC San Diego and does not necessarily reflect the views of DNV AS</Text>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    wrapper:{
        alignItems: "center",
        paddingHorizontal: 24,
        marginTop: 30,
        gap: 16,
        paddingBottom: 100
    },
    header:{
        fontFamily: "Brix Sans",
        fontSize: 24,
        fontWeight: 400
    },
    text: {
        fontFamily: "Brix Sans", 
        fontSize: 16
    },
    subText:{
        fontFamily: "Brix Sans", 
        fontSize: 12
    }
})