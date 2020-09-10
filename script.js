
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
 

 const fetchData = async (url) => {
  let data;
  try {
    const response = await fetch(url);
    data = response.json()
  } catch(error) {
    //throw exception only in network issue
    console.log(error);
    console.log('catch');
  } 
  return data;
 };

/**
 * @param {string} continent - values: Asia / Europe / Americas / Africa 
 * @return {array} - countries code in ISO 3166-1 alpha-2 format
 */
const getCountriesCode = async (continent) => {
  const proxy = 'https://api.allorigins.win/raw?url=';
  const baseUrl = 'https://restcountries.herokuapp.com/api/v1/region/'
  const countriesData = await fetchData(`${proxy}${baseUrl}${continent}`);
  const countriesCode = [];
  countriesData.forEach(country => {
    countriesCode.push(country.cca2);
  });
  return countriesCode;
};

/**
 * @param {string} - countryCode: in ISO 3166-1 alpha-2 format
 * @return {object} - data of specific country
 */
const getCountryData = async (countryCode) => {
  const baseUrl = ' https://corona-api.com/countries/'
  const countryData = await fetchData(`${baseUrl}${countryCode}`);
  return countryData;
};

/**
 * 
 * @param {string} continent - values: Asia / Europe / Americas / Africa 
 * @param {string} info - values: deaths / confirmed / recovered / critical
 * @return {object} statistic - contain labels array & data array to display in chart
 */
const getStatistic = async (continent, info) => {
  const countriesCode = await getCountriesCode(continent);
  const statistic = {labels: [], data: []};
  for (const countryCode of countriesCode ) {
    const country = await getCountryData(countryCode);
    statistic.labels.push(country.data.name);
    statistic.data.push(country.data.latest_data[info]);
  }
  return statistic;
}

const handleClick = async() => {
 const statistic = await getStatistic('Asia', 'deaths');
 displayInCart(statistic);
}

const testBtn = document.querySelector('.btn');
testBtn.addEventListener('click', handleClick);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// var ctx = document.getElementById('chart').getContext('2d');
// var chart = new Chart(ctx, {
//     // The type of chart we want to create
//     type: 'line',

//     // The data for our dataset
//     data: {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//         datasets: [{
//             label: 'My First dataset',
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [0, 10, 5, 2, 20, 30, 45]
//         }]
//     },

//     // Configuration options go here
//     options: {}
// });

const displayInCart = (statistic) => {

  console.log(statistic);
  
  var data = {
    labels: statistic.labels, // Country name arr
    datasets: [{
      label: "Dataset #1",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: statistic.data, // num of case arr
    }]
  };
  
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












 



//https://restcountries.herokuapp.com/api/v1/region/Asia

// Americas / Asia / Europe / Africa
// Sub-region: South America / 
