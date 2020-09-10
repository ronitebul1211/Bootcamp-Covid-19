console.log('Hi')

/**
 API - Covid 19 -> https://about-corona.net/documentation
 API - List of countries per continent -> https://github.com/hengkiardo/restcountries
 Display Graphs -> https://www.chartjs.org/

  Features: 
  # For World & Continents statistics: (https://www.chartjs.org/samples/latest/charts/area/line-datasets.html / https://www.chartjs.org/samples/latest/scales/linear/step-size.html)
  1 Choose: Asia, Africa, North America, South America, Antarctica, Europe, Australia, World
  2 Display: -> Graph: default statistic: Confirmed by country
             -> Graph: List of countries 
  3 Choose: Confirmed / Deaths / Recovered / Critical Condition
    Display: corresponding Graph

  # For Country statistics:
  1 Display Country Data (Table ?)

  
  - - - - - - - - - - - - - - - - - - - - - - Data - - - - - - - - - - - - - - - - - - - - - -
  Statistic - World & Continents: 
  # Confirmed Cases -> latest_data.confirmed (143,049)
  # Number of Deaths -> latest_data.death (1055)
  # Number of recovered -> latest_data.recovered (109,775)
  # Number of critical condition -> latest_data.critical (32219)
  
  Statistic - Country : (pie chart + new cases, death )
  # Confirmed Cases -> latest_data.confirmed (143,049)
  # Number of Deaths -> latest_data.death (1055)
  # Number of recovered -> latest_data.recovered (109,775)
  # Number of critical condition -> latest_data.critical (32219)
  ## new cases -> today.confirmed (1952)
  ## new deaths -> today.deaths (1)
 */

 //Fetch Data
 //Create World obj: key: Continent Name, value: array of countries represent by -> ISO 3166-1 alpha-2 format (cca2) 
 
 //fetch -> confirmed cases by continent / world  country name + confirm cases
 //fetch -> Deaths cases by continent / world  country name + Deaths cases
 //fetch -> recovered cases by continent / world  country name + recovered cases
 //fetch -> critical cases by continent / world  country name + critical cases

 //fetch -> by country -> country statistic
 