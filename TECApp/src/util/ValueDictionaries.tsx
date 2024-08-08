export const getAbbrv = (region: string)=>{
    switch (region) {
        case 'Global':
          return 'global'
        case 'North America':
          return 'nam'
        case 'Latin America':
          return 'lam'
        case 'Europe':
          return 'eur'
        case 'Sub-Saharan Africa':
          return 'ssa'
        case 'Middle East & N. Africa':
          return 'mea'
        case 'North East Eurasia':
            return "nee"
        case 'Greater China':
            return 'chn'
        case 'Indian Subcontinent':
            return 'ind'
        case 'South East Asia':
            return 'sea'
        case 'OECD Pacific':
            return 'opa'
      }
}

export const getTechnologyColor = (label: string) => {
    switch (label) {
      case 'Wind':
        return '#C66AAA'
      case 'Solar':
        return '#F8CE46'
      case 'Hydropower':
        return '#58C4D4'
      case 'Biomass':
        return '#779448'
      case 'Geothermal':
        return '#BF9336'
      case 'Nuclear':
        return '#EE8E35'
      default:
        return '#B5B1AA'
    }
  }

export const getRegionColor = (region: string) => {
    switch(region){
        case 'North America':
          return '#9ED7F5'
        case 'Latin America':
          return '#78B85D'
        case 'Europe':
          return '#0D5BA5'
        case 'Sub-Saharan Africa':
          return '#01ABE7'
        case 'Middle East & N. Africa':
          return '#F8EE88'
        case 'North East Eurasia':
            return "#E78C68"
        case 'Greater China':
            return '#C06998'
        case 'Indian Subcontinent':
            return '#978E86'
        case 'South East Asia':
            return '#DC4340'
        case 'OECD Pacific':
            return '#A86937'
    }
}

export const getEnergyAbbrv = (energy: string)=>{
    switch(energy){
        case "solar":
            return 'solar_gw'
        case 'wind':
            return 'wind_gw'
        case 'hydropower':
            return 'hydro_gw'
        case 'biomass':
            return 'bio_gw'
        case 'geothermal':
            return 'geo_gw'
        case 'nuclear':
            return 'nuclear_gw'
    }

}

