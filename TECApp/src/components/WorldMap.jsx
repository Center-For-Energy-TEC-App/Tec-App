import * as d3 from "d3";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View } from 'react-native';
import data from "../../GeoChart.world.geo.json"

export const WorldMap = ()=>{
    const svgRef = useRef();
    const wrapperRef = useRef();

    const [selectedCountry, setSelectedCountry] = useState();

    useEffect(()=>{
        const { width, height } = wrapperRef.current.getBoundingClientRect();

        const svg = d3.select(svgRef.current);
        console.log(width)
        console.log(height)
        
        const projection = d3.geoNaturalEarth1().fitSize([width, height], data);
        const pathGenerator = d3.geoPath().projection(projection);

        svg.selectAll(".country")
            .data(data.features)
            .join("path")
            .on("click", (event, feature) =>{setSelectedCountry(feature)})
            .attr("class", "country")
            .attr("fill", "#c9c9c9")
            .style("stroke", "white")
            .style("stroke-width", 0.5)
            .attr("d", feature => pathGenerator(feature));
    }, [])

    useEffect(()=>{
        console.log(selectedCountry!==undefined?selectedCountry.properties.admin:"")
    }, [selectedCountry])

    return(
        <View ref={wrapperRef} style={styles.container}>
			<svg style={styles.svg} ref={svgRef}></svg>
            <Text>{selectedCountry!==undefined?selectedCountry.properties.admin:""}</Text>
		</View>
    )
}

const styles = StyleSheet.create({
	container: {
        // backgroundColor: "red",
        height: "95vh",
        width: "95vw",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
	},
    svg: {
        height: "100%",
        width: "100%",
        
        // backgroundColor: "red",
    }
    
});