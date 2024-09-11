import React, { useEffect, useState } from "react"
import {StyleSheet} from "react-native"
import {Dimensions, Platform, ScrollView, Text, TouchableOpacity, View} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Tracker } from "../components/Tracker"
import { DataPoint } from "../components/DataVisualizations/BAUComparison"
import DataVisualizations from "../components/DataVisualizations/DataVisualizations"
import { GraphData, RegionData } from "../api/requests"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ExportButton } from "../SVGs/ExportButton"
import { FeedbackButton } from "../SVGs/FeedbackButton"
import { LearnMoreButton } from "../SVGs/LearnMoreButton"

export default function GlobalDashboard(){
    const [initialGraphData, setInitialGraphData] = useState<RegionData>()
    const [dynamicGraphData, setDynamicGraphData] = useState<RegionData>()

    const [initialFossilData, setInitialFossilData] = useState<DataPoint[]>()
    const [dynamicFossilData, setDynamicFossilData] = useState<DataPoint[]>()

    const [globalEnergy, setGlobalEnergy] = useState<number>()

    const getValue = async (key: string) => {
        try{
            const value = await AsyncStorage.getItem(key)
            return value
        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        getValue("bau-graph-data").then((value)=>{
            setInitialGraphData(JSON.parse(value))
        })
        getValue("dynamic-graph-data").then((value)=>{
            setDynamicGraphData(JSON.parse(value))

        })
        getValue("bau-fossil-data").then((value)=>{
            setInitialFossilData(JSON.parse(value))

        })
        getValue("dynamic-fossil-data").then((value)=>{
            setDynamicFossilData(JSON.parse(value))

        })
        getValue("global-energy").then((value)=>{
            setGlobalEnergy(Number(value))
        })
    },[])


      const deviceType = () => {
        const { width, height } = Dimensions.get('window')
        return Platform.OS === 'ios' && (width >= 1024 || height >= 1366)
          ? 'ipad'
          : 'iphone'
      }
    
      const isIpad = deviceType() === 'ipad'
      return (
        <GestureHandlerRootView >
        <ScrollView
          style={styles.regionInfoContainer}
          contentContainerStyle={{ alignItems: 'flex-start' }}
        >

        {initialGraphData && dynamicGraphData && initialFossilData && dynamicFossilData && (<>
          <Text style={styles.regionName}>Global Progress</Text>
          
          <Text style={[styles.body, isIpad && styles.iPadText]}>
            The world aims to keep global warming below 2°C by 2030. We can do this
            through increasing our current renewable capacity from 8 to 12 TW.{' '}
          </Text>
          <View style={styles.trackersWrapper}>
            <Tracker type="temperature" dashboard />
            <Tracker
              type="renewable"
              dashboard
              totalGlobalEnergy={globalEnergy}
            />
          </View>
         
             <DataVisualizations
               initialGlobalData={initialGraphData}
               dynamicGlobalData={dynamicGraphData}
              initialFossilData={initialFossilData}
               dynamicFossilData={dynamicFossilData}
               region="Global"
             />
             </>)}
          <View style={styles.bottomButtons}>
            <ExportButton onPress={()=>{alert("Export")}}/>
            <FeedbackButton onPress={()=>{alert("Feedback")}}/>
            <LearnMoreButton onPress={()=>{alert("Learn More")}}/>
          </View>
        </ScrollView>
        </GestureHandlerRootView>

      )
    }
    
    const styles = StyleSheet.create({
      regionInfoContainer: {
        flex: 1,
        width: '100%',
        padding: 16

      },
      regionName: {
        color: '#000',
        fontSize: 28,
        fontFamily: 'Brix Sans',
        fontWeight: '400',
        paddingBottom: 10,
      },
  
      body: {
        fontFamily: 'Roboto',
        fontSize: 14,
      },
    
      trackersWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
        marginTop: 32,
      },

      iPadText: {
        fontSize: 18,
      },

      bottomButtons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 50,
      }
    })

   