export const getAbbrv = (region: string) => {
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
      return 'nee'
    case 'Greater China':
      return 'chn'
    case 'Indian Subcontinent':
      return 'ind'
    case 'South East Asia':
      return 'sea'
    case 'OECD Pacific':
      return 'opa'
    default:
      return region
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
  switch (region) {
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
      return '#E78C68'
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

export const getElectricityGenerationCoal = (region: string) => {
  switch (region) {
    case 'chn':
      return 0.87
    case 'ind':
      return 0.85
    case 'mea':
      return 0.06
    case 'nam':
      return 0.2
    case 'nee':
      return 0.23
    case 'sea':
      return 0.62
    case 'eur':
      return 0.21
    case 'lam':
      return 0.05
    case 'ssa':
      return 0.82
    case 'opa':
      return 0.7
  }
}

export const getCarbonReductionMaximum = (region: string) => {
  switch (region) {
    case 'chn':
      return 8438
    case 'ind':
      return 2279
    case 'mea':
      return 1046
    case 'nam':
      return 2228
    case 'nee':
      return 1007
    case 'sea':
      return 1253
    case 'eur':
      return 2550
    case 'lam':
      return 1486
    case 'ssa':
      return 939
    case 'opa':
      return 1806
  }
}
