
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
 
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  Data - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** 
 * Fetch Utility
 * @param {string} - url to fetch data
 * @return {object} - represent response data structure
 */ 
const fetchData = async (url) => {
  let data;
  try {
    const response = await fetch(url);
    if(response.ok){
      data = response.json()
    }
  } catch(error) {
    //throw exception only in network issue
    console.log(error);
    console.log('catch');
  } 
  return data;
 };

/**
 * @param {string} continent - from CONTINENTS array 
 * @return {array} - countries code in ISO 3166-1 alpha-2 format
 */
const fetchCountriesCode = async (continent) => {
  const proxy = 'https://api.allorigins.win/raw?url=';
  const baseUrl = 'https://restcountries.herokuapp.com/api/v1/region/'
  const countriesData = await fetchData(`${proxy}${baseUrl}${continent}`);
  const countriesCode = [];
  countriesData.forEach(country => countriesCode.push(country.cca2));
  return countriesCode;
};

/**
 * @param {string} - countryCode: in ISO 3166-1 alpha-2 format
 * @return {object / undefined} - Country Object: code, name, confirmed, recovered, critical, deaths, newCases, newDeaths
 */
const fetchCountry = async (countryCode) => {
  const baseUrl = ' https://corona-api.com/countries/'
  const countryData = await fetchData(`${baseUrl}${countryCode}`);
 
  let country;
  if(typeof countryData !== 'undefined'){
      country = {
      code: countryCode,
      name: countryData.data.name,
      confirmed: countryData.data.latest_data.confirmed,
      recovered: countryData.data.latest_data.recovered,
      critical: countryData.data.latest_data.critical,
      deaths: countryData.data.latest_data.deaths,
      newCases: countryData.data.today.confirmed,
      newDeaths: countryData.data.today.deaths,
    };
  }
  return country;
};

/**
 * @param {string} continent - from CONTINENTS array 
 * @return {array} - continent object, consists of countries  their covid19 data
 */
const fetchContinent = async (continent) => {
  console.log('fetching continent ...');
  const countriesCode = await fetchCountriesCode(continent);
  continent = [];
  for (const countryCode of countriesCode ) {
    const country = await fetchCountry(countryCode);
    if(typeof country !== 'undefined'){
      continent.push(country);
    }
  }
  return continent;
}

/**
 * @param {string} continent - from CONTINENTS array 
 * @return {object} statistic - contain arrays labels (country name) and datasets (confirmed, recovered, critical, deaths) to display in Graph
 */
const getStatistics = (continent) => {
  const statistic = {labels:[], confirmed:[], recovered:[], critical:[], deaths:[]};

  continent.forEach(country => {
    statistic.labels.push(country.name);
    statistic.confirmed.push(country.confirmed);
    statistic.recovered.push(country.recovered);
    statistic.critical.push(country.critical);
    statistic.deaths.push(country.deaths);
  });
  return statistic;
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - State - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const CONTINENTS = ['Asia', 'Europe', 'Americas', 'Africa'];
let isFetchingData = false;
let currentContinent = [];



  


//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - UI - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
 * HANDLER - when user select continent display data graph + list of corresponding countries 
 * @param {number} continentIndex - index of the selected continent in CONTINENT array 
 */
const handleContinentClick = async(continentIndex) => {
  if(!isFetchingData){
   
    //Fetching State START ...
    isFetchingData = true;
    
    //Set state -> Continent Data
    currentContinent = await fetchContinent(CONTINENTS[continentIndex]);

    console.log(currentContinent);
    //Display Graph
    displayInGraph(getStatistics(currentContinent));
    
    //Display Countries List
    displayCountriesList();

    
    //Fetching State END ...
    isFetchingData = false;  
  }
 }

 const handleCountryHover =  (event, countryCode) => {
   //Create info
   const infoEL = document.createElement('div');
   infoEL.classList.add('country-info');
   //Create graph
   const doughnutContainerEl = document.createElement('div');
   doughnutContainerEl.classList.add('doughnut-container');
   const doughnutGraphEl = document.createElement('canvas');
   doughnutGraphEl.id = 'pie-graph';
   const countryEl = event.currentTarget;
   infoEL.appendChild(doughnutContainerEl);
   doughnutContainerEl.appendChild(doughnutGraphEl);
   countryEl.appendChild(infoEL);  
   //Get current country index
   console.log(currentContinent.findIndex(country => country.code === countryCode));
   console.log(currentContinent[5]);
   const countryData = currentContinent[currentContinent.findIndex(country => country.code === countryCode)];
   displayPieGraph(countryData);
   //Create Text
   const textString = 
          ` <div>Confirmed: ${countryData.confirmed}</div>
            <div>Critical: ${countryData.critical}</div>
            <div>Recovered: ${countryData.recovered}</div>
            <div>Deaths: ${countryData.deaths}</div>
          `;
  infoEL.insertAdjacentHTML('beforeend', textString);
    
 }

 const  handleCountryOutOfHover = (event) => {
 
   const infoEl = event.currentTarget.querySelector('.country-info');
   infoEl.remove();
  
 }

 const displayPieGraph = (country) => {

  const data = { 
    labels : [], 
    datasets : [ 
      { 
        data : [country.confirmed], //Confirmed
        backgroundColor : "rgb(255,188,128)", 
        title: ["jhjh"]
      }, 
      { 
        data : [country.critical, country.recovered, country.deaths], //critical, recovered, deaths
        backgroundColor : ['rgb(255,204,206)', 'rgb(152,255,178)', 'rgb(228,204,255)'], 
      }
    ]
  }
  const options = {
    borderWidth:0,
    cutoutPercentage: 25,
  }

  Chart.Doughnut('pie-graph', {data: data, options: options});
 }


/** 
 * INIT - Continents selector UI
 */
const initContinentSelectorUI = () => {
  const continentsContainerEl = document.querySelector('.continents-container');
  CONTINENTS.forEach((continent, index) => {
    const continentBtnEl = document.createElement('button');
    continentBtnEl.textContent = continent;
    continentsContainerEl.appendChild(continentBtnEl);
    continentBtnEl.addEventListener('click',() => handleContinentClick(index));
  });
}

/**
 * Graph - display continents data separate by country in Graph
 * @param {*} statistic - Datasets: confirmed, recovered, critical, deaths
 */
const displayInGraph = (statistic) => {
 const data =  {
    datasets: 
    [
      {
        label: 'Confirmed',
        data: statistic.confirmed,
        borderColor: "rgb(255,188,128)",  //Orange
        pointBackgroundColor:"rgb(255,188,128)",
        pointBorderColor:"black",
        fill: false,
        type: 'line'
      },
      {
        
        label: 'Recovered',
        data: statistic.recovered,
        borderColor: "rgb(152,255,178)", //Mint
        pointBackgroundColor:"rgb(152,255,178)",
        pointBorderColor:"black",
        fill: false,
        fill: false,
        type: 'line'
      },
      {
        label: 'Critical',
        data: statistic.critical,
        borderColor: "rgb(255,204,206)", //Pink
        pointBackgroundColor:"rgb(255,204,206)",
        pointBorderColor:"black",
        fill: false,
        type: 'line'
      }, 
      {
        label: 'Deaths',
        data: statistic.deaths,
        borderColor: "rgb(228,204,255)", //Purple
        pointBackgroundColor:"rgb(228,204,255)",
        pointBorderColor:"black",
        fill: false,
        type: 'line' 
      }
    ],
    labels: statistic.labels
}
  
  var options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        stacked: true,
        gridLines: {
          display: true,
          color: "rgba(255,99,132,0.2)"
        }
      }],
      xAxes: [{
        gridLines: {
          display: false
        }
      }]
    }
  };
  
  Chart.Bar('chart', {options: options, data: data});
} 
/**
 * Graph
 */
const displayCountriesList = () => {
  // Display & Reset (if necessary) Container EL
  const countriesListContainerEl = document.querySelector('.countries-container');
  setVisibility(countriesListContainerEl, true);
  countriesListContainerEl.hasChildNodes() && (countriesListContainerEl.innerHTML ='');

  //Create country EL for country in current continent
  currentContinent.forEach(country => {
    //Create Country El
    const countryEl = document.createElement('div');
    countryEl.classList.add('country');
    countryEl.textContent = country.name;
    countryEl.addEventListener('mouseover', (event) => handleCountryHover(event ,country.code))
    countryEl.addEventListener('mouseout', (event) => handleCountryOutOfHover(event))
    
    //Append to container
    countriesListContainerEl.appendChild(countryEl);
  });

  //Append to Main container 
  const mainContainerEl = document.querySelector('.main-container');
  mainContainerEl.appendChild(countriesListContainerEl);
}

/**
 * Utility - Hide / Show DOM element 
 * @param {object} - DOM Element
 * @param {boolean} - true - visible / false - hidden
 */
const setVisibility = (element, visibility) => {
  visibility 
  ? element.classList.remove('hide') 
  : element.classList.add('hide')
};
/** */
const isVisible = (element) => element.matches('.hide');





//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INIT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
initContinentSelectorUI();











