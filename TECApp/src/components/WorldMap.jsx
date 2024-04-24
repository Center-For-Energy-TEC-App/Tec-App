import * as d3 from "d3";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Dimensions, Platform, Pressable } from 'react-native';
import data from "../../GeoChart.world.geo.json"    
import Svg, { Path, G } from "react-native-svg"

export const WorldMap = ()=>{
    const [web, setWeb] = useState(Platform.OS=="web")
    const wrapperRef = useRef();

    const [selectedCountry, setSelectedCountry] = useState();
    
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;

    const projection = d3.geoNaturalEarth1().fitSize([width*0.95, height*0.65], data);
    const pathGenerator = d3.geoPath().projection(projection);

    return(
      
        <View ref={wrapperRef} style={web?webStyles.container:mobileStyles.container}>
			<Svg style={web?webStyles.svg:mobileStyles.svg}>
                <G>
                    {data.features.map((feature, index)=>(
                        web?(
                        <Path d={pathGenerator(feature)} 
                                key={index}
                                stroke="white" 
                                strokeWidth={0.5} fill="gray"
                                onClick={()=>{
                                    setSelectedCountry(feature)}}
                        ></Path>):
                        <Path d={pathGenerator(feature)} 
                                key={index}
                                stroke="white" 
                                strokeWidth={0.5} fill="gray"
                                onPress={()=>{
                                    setSelectedCountry(feature)}}
                        ></Path>)
                    )}
                </G>
            </Svg>
            <Text>{selectedCountry!==undefined?selectedCountry.properties.admin:" "}</Text>
		</View>
    )
}

const webStyles = StyleSheet.create({
	container: {
        // backgroundColor: "gray",
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
	},
    svg: {

        height: "65%",
        width: "100%",
        // backgroundColor: "red",
    }
});

const mobileStyles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flex: 1,
        alignItems: "center"
	},
    svg: {
        height: "40%",
        width: "100%",
        marginTop: "50%"
        // marginBottom: "20%"
    }
})