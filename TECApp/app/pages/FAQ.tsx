import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Link } from 'expo-router'

export default function FAQ() {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.header}>Frequently Asked Questions</Text>
      <View style={styles.questionBlock}>
        <Text style={styles.subHeader}>
          Why is staying below 2 degrees important?
        </Text>
        <Text style={styles.text}>
          A global temperature rise of 2 degrees Celsius (3.6 degrees
          Fahrenheit) would result in catastrophic impacts such as sea level
          rise resulting in flooding, increase in drought frequency, decrease in
          snow coverage, increase in the proportion of tropical cyclone
          intensity, damage to human/ecological systems, among many other
          compounding extreme effects.
        </Text>
        <Link
          href="https://science.nasa.gov/earth/climate-change/vital-signs/a-degree-of-concern-why-global-temperatures-matter/"
          style={styles.link}
        >
          https://science.nasa.gov/earth/climate-change/vital-signs/a-degree-of-concern-why-global-temperatures-matter/
        </Link>
      </View>
      <View style={styles.questionBlock}>
        <Text style={styles.subHeader}>
          Why does the energy sector generate so many emissions?
        </Text>
        <Text style={styles.text}>
          To meet global energy demands, fossil fuels are burned for energy
          production. The burning of fossil fuels is responsible for
          approximately 75% of global greenhouse gas emissions.
        </Text>
        <Link href="https://ourworldindata.org/energy-mix" style={styles.link}>
          https://ourworldindata.org/energy-mix
        </Link>
      </View>
      <View style={styles.questionBlock}>
        <Text style={styles.subHeader}>Why does clean energy matter?</Text>
        <Text style={styles.text}>
          Fossil fuels are the leading driver of climate change and air
          pollution. An increase in clean energy would reduce the world&#39;s
          dependence on fossil fuels resulting in a decline of greenhouse gas
          emissions.
        </Text>
        <Link
          href="https://ourworldindata.org/greenhouse-gas-emissions"
          style={styles.link}
        >
          https://ourworldindata.org/greenhouse-gas-emissions
        </Link>
      </View>
      <View style={styles.questionBlock}>
        <Text style={styles.subHeader}>Where is the model data from?</Text>
        <Text style={styles.text}>
          The TEC model uses data from the Energy Transition Outlook: Pathway to
          Net-Zero Emissions report written by the global consulting
          organization, DNV (Det Norske Veritas). Click the link below to
          download the report from the DNV website.
        </Text>
        <Link
          href="https://www.dnv.com/energy-transition-outlook/about/"
          style={styles.link}
        >
          https://www.dnv.com/energy-transition-outlook/about/
        </Link>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 30,
    gap: 40,
    paddingBottom: 100,
  },
  link: {
    color: '#0000FF',
    textDecorationLine: 'underline',
  },
  header: {
    fontFamily: 'Brix Sans',
    fontSize: 24,
    fontWeight: 400,
    // color: "#060470"
  },
  text: {
    fontFamily: 'Brix Sans',
    fontSize: 16,
  },
  subText: {
    fontFamily: 'Brix Sans',
    fontSize: 12,
  },
  subHeader: {
    fontFamily: 'Brix Sans',
    fontSize: 20,
    // color: "#060470"
  },
  questionBlock: {
    gap: 10,
  },
})
