export const getRegionSummary = (region: string) => {
  switch (region) {
    case 'North America':
      return 'North America includes the U.S. and Canada. With just 5% of global population the region is the second largest emitter – behind China – with 14% of global energy CO2 emissions. It is also the largest historical emitter of CO2 measured over the last 50 years. Regional CO2 emissions have been falling for over a decade thanks to natural gas produced from hydraulic fracturing (also known as “fracking”) replacing coal for electricity generation. Today renewables are the largest source of new electrical capacity, but the U.S. has also become the world’s biggest oil producer and natural gas exporter.            '
    case 'Latin America':
      return 'Latin America, stretching from Mexico through southern South America, accounts for 8% of global population but just 4% of global energy CO2 emissions, with 40% of its final energy demand coming from renewable energy. Home to an abundance of natural resources from fossil fuels to agriculture to mining, the region has future potential for an even greater use of renewables as manufacturing and living standards rise.'
    case 'Europe':
      return 'Europe consists of all countries west of Russia, Bulgaria, Ukraine, and Turkey. Historically the second largest emitter of CO2 behind North America, total greenhouse gas (GHG) emissions fell by a third between 1990 and 2022 with emphasis on energy efficiency, reduced coal consumption, and renewable energy investments, especially in wind and solar. Forecast energy-related emissions by 2050 are only 3% of the global total.'
    case 'Sub-Saharan Africa':
      return 'Sub-Saharan Africa includes more than 50 countries of the African continent south of the Sahara Desert. The region accounts for 15% of global population but only 3% of energy CO2 emissions. Just two countries, Nigeria and South Africa, account for half the region’s energy demand. Access across the region to both affordable and reliable energy is essential for economic growth and stability, especially as populations grow rapidly and are forecast to reach 2.1 billion by 2050. The region has abundant renewable energy resources and pathways for low-emissions.'
    case 'Middle East & N. Africa':
      return 'The Middle East & North Africa region represents a diverse set of nations from Morocco in northwest Africa to Iran in the Middle East. The region accounts for 7% of global population and 9% of global energy CO2 emissions. The production of fossil fuels – specifically oil and gas – dominate the region’s economy, both as the major source of revenues and exports but also providing 96% of its energy supply. In addition to the CO2 emissions from fossil exports, the region is forecast to become the third largest CO2 emitter by 2035 behind China and India. Renewable resources, especially solar, are abundant in the region.'
    case 'North East Eurasia':
      return 'Northeast Eurasia includes Russia and most of the former Soviet Union states, as well as North Korea and Mongolia. The region accounts for 4% of global population and 7% of energy CO2 emissions. The production and export of fossil fuels dominate most regional economies, especially Russia, but significant climate risks include heat waves, drought, wildfires, and permafrost thawing that results in even more CO2 and methane emissions.'
    case 'Greater China':
      return 'Greater China accounts for 18% of global population and 33% of global energy CO2 emissions, but it also leads the world in renewable energy production, installing more renewable energy in 2024 than the rest of the world combined. China is the largest producer of goods exported and consumed across the globe, including solar panels and batteries for electric cars, but its economic growth was largely powered by coal. Emissions are starting to peak in China, but the world cannot limit global warming to less than 2° Celsius without China replacing its use coal with zero-carbon energy sources.'
    case 'Indian Subcontinent':
      return 'The India Subcontinent, the most populous region, includes India, Pakistan, Afghanistan, Bangladesh, Sri Lanka, Nepal, Bhutan, and the Maldives. Together these countries account for 24% of global population but only 10% of global energy CO2 emissions. But India’s growing population, economy and dependence on domestic coal mean that by 2050 it could be equal to China as the world’s largest CO2 emitter. Renewable energy is starting to grow but needs to quickly outpace new coal use within the region, especially India, or risk jeopardizing the world’s goal of limiting global warming to less than 2° Celsius.'
    case 'South East Asia':
      return 'Southeast Asia includes countries from Myanmar to Papua New Guinea, accounting for 9% of global population and 6% of global energy CO2 emissions, with Thailand, Indonesia, Malaysia, and Vietnam accounting for 80% of the region’s CO2 emissions. Emissions, along with populations, are rising in the region, but the area has a diverse set of renewable energy resources and international efforts to accelerate replacing coal use are underway.'
    case 'OECD Pacific':
      return 'OECD Pacific consists of Japan, South Korea, Australia, and New Zealand, with 3% of global population and 6% of global energy CO2 emissions. The four countries differ significantly in energy needs and use: Japan and South Korea are populous and heavily industrialized with limited renewable energy sources, and both rely heavily on overseas imports of fossil fuels. Australia is a large exporter of both coal and natural gas and, along with New Zealand, has abundant renewable energy options. The region’s energy CO2 emissions have peaked but rapid drawdown of fossil fuels will be especially challenging for Japan and South Korea.'
  }
}

export const getRegionTechnologySummary = (
  region: string,
  technology: string,
) => {
  switch (region) {
    case 'North America':
      switch (technology) {
        case 'Wind':
          return 'The region installed 70 GW of new wind capacity between 2017 and 2023, accounting for 42% of total zero-carbon electricity growth. The region is forecasted to add 90 GW of new capacity from 2025-2030, accounting for 34% of new zero-carbon energy. Tripling this 5-year forecast results in 485 GW by 2030.'
        case 'Solar':
          return 'The region installed 170 GW of new solar capacity between 2017 and 2023, accounting for 54% of total zero-carbon electricity growth. The region is forecasted to add 250 GW of new capacity from 2025-2030, accounting for 62% of new zero-carbon energy. Tripling this 5-year forecast results in 1,050 GW by 2030.'
        case 'Hydropower':
          return 'The region installed only 0.5 GW of new hydropower capacity between 2017 and 2023, though actual generation decreased during this period. The region is forecasted to add 8 GW of new capacity from 2025-2030, accounting for just 3% of new zero-carbon energy. Tripling this 5-year forecast results in 210 GW by 2030.'
        case 'Biomass':
          return 'Biomass capacity decreased in the region between 2017 and 2023 though actual generation remained steady. 1 GW loss of capacity is forecasted from 2025-2030. Adding 2 GW of new capacity would result in 20 GW by 2030.'
        case 'Geothermal':
          return 'The region installed only 0.2 GW of new geothermal capacity between 2017 and 2023, accounting for less than 1% of total zero-carbon electricity growth. 2 GW of new capacity is forecasted from 2025-2030. Tripling this 5-year forecast results in 11 GW by 2030.'
        case 'Nuclear':
          return 'Nuclear capacity decreased in the region by 7.5 GW between 2017 and 2023 with total generation also falling. Capacity and energy production is forecasted to remain flat from 2025-2030. Adding 5 GW of new capacity would result in 110 GW by 2030.'
      }
    case 'Latin America':
      switch (technology) {
        case 'Wind':
          return 'The region installed 42 GW of new wind capacity between 2017 and 2023, accounting for 40% of total zero-carbon electricity growth. The region is forecasted to add 35 GW of new capacity from 2025-2030, accounting for 36% of new zero-carbon energy. Tripling this 5-year forecast results in 190 GW by 2030'
        case 'Solar':
          return 'The region installed 55 GW of new solar capacity between 2017 and 2023, accounting for 37% of total zero-carbon electricity growth. The region is forecasted to add 60 GW of new capacity from 2025-2030, accounting for 41% of new zero-carbon energy. Tripling this 5-year forecast results in 275 GW by 2030.'
        case 'Hydropower':
          return 'The region installed 14 GW of new hydropower capacity between 2017 and 2023 though actual generation remained flat. The region is forecasted to add close to 13 GW of new capacity from 2025-2030, accounting for 20% of new zero-carbon energy. Tripling this 5-year forecast results in 260 GW by 2030.'
        case 'Biomass':
          return 'The region installed 4 GW of new biomass capacity between 2017 and 2023. A slight increase in regional capacity but decrease in overall generation is forecasted from 2025-2030. Tripling the historical capacity increase results in 30 GW by 2030.'
        case 'Geothermal':
          return 'Geothermal capacity and generation in the region remained flat between 2017 and 2023. It is forecasted to also remain flat from 2025-2030. Adding 1 GW of new capacity would result in 3 GW by 2030.'
        case 'Nuclear':
          return 'Nuclear capacity and generation in the region remained flat between 2017 and 2023. A minor increase in capacity is forecasted from 2025-2030, accounting for less than 1% of new zero-carbon energy. Tripling this 5-year forecast results in 9 GW by 2030.'
      }
    case 'Europe':
      switch (technology) {
        case 'Wind':
          return 'The region installed 57 GW of new wind capacity between 2017 and 2023, accounting for 53% of total zero-carbon electricity growth. The region is forecasted to add 115 GW of new capacity from 2025-2030, accounting for 42% of new zero-carbon energy. Tripling this 5-year forecast results in 650 GW by 2030.'
        case 'Solar':
          return 'The region installed 185 GW of new solar capacity between 2017 and 2023, accounting for 47% of total zero-carbon electricity growth. The region is forecasted to add 325 GW of new capacity from 2025-2030, accounting for 52% of new zero-carbon energy. Tripling this 5-year forecast results in 1,350 GW by 2030.'
        case 'Hydropower':
          return 'Hydropower capacity in the region remained flat between 2017 and 2023, with actual generation decreasing during this period. The region is forecasted to add 7 GW of new capacity from 2025-2030, accounting for just 4% of new zero-carbon energy. Tripling this 5-year forecast results in 250 GW by 2030.'
        case 'Biomass':
          return 'The region installed 3 GW of new geothermal capacity between 2017 and 2023 though actual generation remained flat. It is forecasted no new capacity from 2025-2030. Adding 3 GW would result in 50 GW by 2030.'
        case 'Geothermal':
          return 'Geothermal capacity and generation in the region remained flat between 2017 and 2023. It is forecasted 2 GW of new capacity from 2025-2030, accounting for just 1% of new zero-carbon energy. Tripling this 5-year forecast results in 9 GW by 2030.'
        case 'Nuclear':
          return 'Nuclear capacity decreased in the region by 13.5 GW between 2017 and 2023 with actual generation also falling. Capacity and energy production is forecasted to remain relatively flat from 2025-2030. Tripling the small predicted increase of new capacity would result in 115 GW by 2030.'
      }
    case 'Sub-Saharan Africa':
      switch (technology) {
        case 'Wind':
          return 'The region installed 7.5 GW of new wind capacity between 2017 and 2023, accounting for 15% of total zero-carbon electricity growth. The region is forecasted to add 7 GW of new capacity from 2025-2030, accounting for 14% of new zero-carbon energy. Tripling this 5-year forecast results in 36 GW by 2030.'
        case 'Solar':
          return 'The region installed 17 GW of new solar capacity between 2017 and 2023, accounting for 25% of total zero-carbon electricity growth. The region is forecasted to add 40 GW of new capacity from 2025-2030, accounting for 28% of new zero-carbon energy. Tripling this 5-year forecast results in 140 GW by 2030.'
        case 'Hydropower':
          return 'The region installed 16 GW of new hydropower capacity between 2017 and 2023, accounting for 37% of zero-carbon electricity growth. The region is forecasted to add 20 GW of new capacity from 2025-2030, accounting for 50% of new zero-carbon energy. Tripling this 5-year forecast results in 125 GW by 2030.'
        case 'Biomass':
          return 'Biomass capacity in the region remained flat between 2017 and 2023 though overall generation increased. Less than 1 GW of new electricity capacity is forecasted to be added from 2025-2030. Adding 2 GW would result in 4 GW by 2030.'
        case 'Geothermal':
          return 'The region installed 1 GW of geothermal capacity between 2017 and 2023, accounting for just 4% of zero-carbon electricity growth. Less than 1 GW of new capacity is forecasted to be added from 2025-2030. Tripling this 5-year forecast results in 6 GW by 2030.'
        case 'Nuclear':
          return 'Nuclear capacity and generation in the region remained flat between 2017 and 2023. No significant changes in capacity are forecasted from 2025-2030, with 2 GW of potential capacity by 2030.'
      }
    case 'Middle East & N. Africa':
      switch (technology) {
        case 'Wind':
          return 'The region installed 12 GW of new wind capacity between 2017 and 2023, accounting for 23% of total zero-carbon electricity growth. The region is forecasted to add 35 GW of new capacity from 2025-2030, accounting for 27% of new zero-carbon energy. Tripling this 5-year forecast results in 130 GW by 2030.'
        case 'Solar':
          return 'The region installed 55 GW of new solar capacity between 2017 and 2023, accounting for 54% of total zero-carbon electricity growth. The region is forecasted to add 80 GW of new capacity from 2025-2030, accounting for 49% of new zero-carbon energy. Tripling this 5-year forecast results in 330 GW by 2030.'
        case 'Hydropower':
          return 'The region installed 3.5 GW of new hydropower capacity between 2017 and 2023, though actual generation decreased during this period. The region is forecasted to add 15 GW of new capacity from 2025-2030, accounting for 9% of new zero-carbon energy. Tripling this 5-year forecast results in 100 GW by 2030.'
        case 'Biomass':
          return 'The region installed 2 GW of new biomass capacity between 2017 and 2023, accounting for just 3% of total zero-carbon electricity growth. The region is forecasted to add 2 GW of new capacity from 2025-2030, accounting for 7% of new zero-carbon energy. Tripling this 5-year forecast results in 9 GW by 2030.'
        case 'Geothermal':
          return ' The region installed 1.2 GW of new geothermal capacity between 2017 and 2023, accounting for 4% of total zero-carbon electricity growth. The region is forecasted to add 6 GW of new capacity from 2025-2030, accounting for 9% of new zero-carbon energy. Tripling this 5-year forecast results in 20 GW by 2030.'
        case 'Nuclear':
          return 'The region installed 4 GW of new nuclear capacity between 2017 and 2023, accounting for 16% of total zero-carbon electricity growth. The region is forecasted to add 3.5 GW of new capacity from 2025-2030. Tripling this 5-year forecast results in 20 GW by 2030.'
      }
    case 'North East Eurasia':
      switch (technology) {
        case 'Wind':
          return 'The region installed 10 GW of new wind capacity between 2017 and 2023, accounting for 25% of total zero-carbon electricity growth. The region is forecasted to add 15 GW of new capacity from 2025-2030, accounting for 28% of new zero-carbon energy. Tripling this 5-year forecast results in 65 GW by 2030.'
        case 'Solar':
          return 'The region installed 20 GW of new solar capacity between 2017 and 2023, accounting for 24% of total zero-carbon electricity growth. The region is forecasted to add 45 GW of new capacity from 2025-2030, accounting for 30% of new zero-carbon energy. Tripling this 5-year forecast results in 170 GW by 2030.'
        case 'Hydropower':
          return 'Hydropower capacity and generation decreased in the region between 2017 and 2023. The region is forecasted to add close to 18 GW of new capacity from 2025-2030, accounting for 34% of new zero-carbon energy. Tripling this 5-year forecast results in 135 GW by 2030.'
        case 'Biomass':
          return 'Biomass capacity and generation grew in the region between 2017 and 2023, accounting for 13% of zero-carbon electricity growth. The region is forecasted to add 2 GW of new capacity from 2025-2030, accounting for 4% of new zero-carbon energy. Tripling this 5-year forecast would result in 8 GW by 2030.'
        case 'Geothermal':
          return 'Geothermal capacity and generation remained flat in the region between 2017 and 2023. 2 GW of new capacity is forecasted added from 2025-2030, accounting for 5% of new zero-carbon energy. Tripling this 5-year forecast results in 6 GW by 2030.'
        case 'Nuclear':
          return 'The region installed 5 GW of nuclear capacity between 2017 and 2023 though overall generation remained flat. The region is forecasted to add 4 GW of capacity from 2025-2030. Tripling this 5-year forecast would result in 55 GW by 2030.'
      }
    case 'Greater China':
      switch (technology) {
        case 'Wind':
          return 'China installed 260 GW of new wind capacity between 2017 and 2023, accounting for 39% of total zero-carbon electricity growth. It is forecasted China will add 300 GW of new wind capacity from 2025-2030, accounting for 33% of new zero-carbon energy. Tripling this 5-year forecast results in 1,400 GW by 2030.'
        case 'Solar':
          return 'China installed 390 GW of new solar capacity between 2017 and 2023, accounting for 36% of total zero-carbon electricity growth. It is forecasted China will add 630 GW of new solar capacity from 2025-2030, accounting for 50% of new zero-carbon energy. Tripling this 5-year forecast results in 2,700 GW by 2030.'
        case 'Hydropower':
          return 'China installed 105 GW of new hydropower capacity between 2017 and 2023, though actual energy production increased only slightly during this period. It is forecasted China will add 48 GW of new capacity from 2025-2030, accounting for 11% of new zero-carbon energy. Tripling this 5-year forecast results in 575 GW by 2030.'
        case 'Biomass':
          return 'China installed 25 GW of new biomass capacity between 2017 and 2023. It is forecasted China will add 4 GW of new capacity from 2025-2030, accounting for just 3% of new zero-carbon energy. Tripling this 5-year forecast results in 50 GW by 2030.'
        case 'Geothermal':
          return 'Geothermal capacity in China did not increase between 2017 and 2023. It is forecasted China will add 4 GW of new capacity from 2025-2030, accounting for just 1% of new zero-carbon energy. Tripling this 5-year forecast results in 11 GW by 2030.'
        case 'Nuclear':
          return 'China installed 15 GW of new nuclear capacity between 2017 and 2023, accounting for 8% of total zero-carbon electricity growth. It is forecasted China will add 11 GW of new capacity from 2025-2030, accounting for just 2% of new zero-carbon energy. Tripling this 5-year forecast results in 90 GW by 2030.'
      }
    case 'Indian Subcontinent':
      switch (technology) {
        case 'Wind':
          return 'The Indian region installed 20 GW of new wind capacity between 2017 and 2023, accounting for 13% of total zero-carbon electricity growth. The region is forecasted to add 45 GW of new capacity from 2025-2030, accounting for 14% of new zero-carbon energy. Tripling this 5-year forecast results in 200 GW by 2030.'
        case 'Solar':
          return 'The Indian region installed 80 GW of new solar capacity between 2017 and 2023, accounting for 50% of total zero-carbon electricity growth. The region is forecasted to add 175 GW of new capacity from 2025-2030, accounting for 50% of new zero-carbon energy. Tripling this 5-year forecast results in 660 GW by 2030.'
        case 'Hydropower':
          return 'The Indian region installed 12 GW of new hydropower capacity between 2017 and 2023, accounting for 7% of total zero-carbon electricity growth. The region is forecasted to add 49 GW of new capacity from 2025-2030, accounting for 28% of new zero-carbon energy. Tripling this 5-year forecast results in 275 GW by 2030.'
        case 'Biomass':
          return 'The Indian region installed 1.2 GW of new biomass capacity between 2017 and 2023. It is forecasted to add just 1 GW of new capacity from 2025-2030. Tripling this 5-year forecast results in 15 GW by 2030.'
        case 'Geothermal':
          return 'Geothermal capacity and generation remained flat in the region between 2017 and 2023. It is forecasted to add 1.5 GW of new capacity from 2025-2030, accounting for just 1% of new zero-carbon energy. Tripling this 5-year forecast results in 4 GW by 2030.'
        case 'Nuclear':
          return 'The Indian region installed 4.5 GW of new nuclear capacity between 2017 and 2023, accounting for 6% of total zero-carbon electricity growth. The region is forecasted to add 4 GW of new capacity from 2025-2030, accounting for 4% of new zero-carbon energy. Tripling this 5-year forecast results in 25 GW by 2030.'
      }
    case 'South East Asia':
      switch (technology) {
        case 'Wind':
          return 'The region installed 12 GW of new wind capacity between 2017 and 2023, accounting for 12% of total zero-carbon electricity growth. The region is forecasted to add 25 GW of new capacity from 2025-2030, accounting for 19% of new zero-carbon energy. Tripling this 5-year forecast results in 90 GW by 2030.'
        case 'Solar':
          return 'The region installed 32 GW of new solar capacity between 2017 and 2023, accounting for 34% of total zero-carbon electricity growth. The region is forecasted to add 100 GW of new capacity from 2025-2030, accounting for 44% of new zero-carbon energy. Tripling this 5-year forecast results in 350 GW by 2030.'
        case 'Hydropower':
          return 'Hydropower capacity increased in the region between 2017 and 2023 though overall generation remained flat. The region is forecasted to add close to 22 GW of new capacity from 2025-2030, accounting for 33% of new zero-carbon energy. Tripling this 5-year forecast results in 140 GW by 2030.'
        case 'Biomass':
          return 'Biomass capacity in the region remained flat between 2017 and 2023 though overall generation increased, accounting for 20% of zero-carbon electricity growth. Capacity and generation is forecasted to remain steady from 2025-2030. Adding 12 GW of new capacity would result in 12 GW by 2030.'
        case 'Geothermal':
          return 'Geothermal capacity and generation remained flat in the region between 2017 and 2023. 2 GW of new capacity is forecasted to be added from 2025-2030, accounting for 5% of new zero-carbon energy. Tripling this 5-year forecast results in 10 GW by 2030.'
        case 'Nuclear':
          return 'Nuclear capacity and generation in the region were essentially zero between 2017 and 2023. No significant nuclear capacity or generation is forecasted to be added from 2025-2030.'
      }
    case 'OECD Pacific':
      switch (technology) {
        case 'Wind':
          return 'The region installed 11 GW of new wind capacity between 2017 and 2023, accounting for 5% of total zero-carbon electricity growth. The region is forecasted to add 45 GW of new capacity from 2025-2030, accounting for 21% of new zero-carbon energy. Tripling this 5-year forecast results in 190 GW by 2030.'
        case 'Solar':
          return 'The region installed 115 GW of new solar capacity between 2017 and 2023, accounting for 36% of total zero-carbon electricity growth. The region is forecasted to add 135 GW of new capacity from 2025-2030, accounting for 42% of new zero-carbon energy. Tripling this 5-year forecast results in 650 GW by 2030.'
        case 'Hydropower':
          return 'Hydropower capacity and generation in the region decreased moderately between 2017 and 2023. The region is forecasted to add 8 GW of new capacity from 2025-2030, accounting for 5% of new zero-carbon energy. Tripling this 5-year forecast results in 100 GW by 2030.'
        case 'Biomass':
          return 'The region installed 4.3 GW of new biomass capacity between 2017 and 2023, accounting for 11% of zero-carbon electricity growth. Only minor changes to overall capacity are forecasted from 2025-2030. Tripling potential increases results in 18 GW by 2030.'
        case 'Geothermal':
          return 'Geothermal capacity and generation in the region remained flat between 2017 and 2023. 2 GW of new capacity is forecasted to be added from 2025-2030, accounting for just 1% of new zero-carbon energy. Tripling this 5-year forecast results in 5 GW by 2030.'
        case 'Nuclear':
          return 'Nuclear capacity and generation in the region remained relatively flat between 2017 and 2023. The region is forecasted to add 7 GW of new capacity from 2025-2030, accounting for less than 31% of new zero-carbon energy. Tripling this 5-year forecast results in 80 GW by 2030.'
      }
  }
}
