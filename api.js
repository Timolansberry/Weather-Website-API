'use strict';

const api_key = "3a40de66eab3048053e9f94309acfe1d"; //declared api constant

/**
 * Fetch data from server
 * @param {string} URL API url              //anotation to say that URL is a string
 * @param {Function} callback callback      //anotation to say that callback is a function
 */
export const fetchData = function (URL, callback) {   //function takes 2 parameters URL and callback
  fetch(`${URL}&appid=${api_key}`)     //fetches data from the URL and appends the api key
    .then(res => res.json())           //converts the data to json
    .then(data => callback(data));     //calls the callback function with the data
}
export const url = {               //declares url constant and exports it. It contains several properties, each representing a different API endpoint with corresponding URL templates.
  currentWeather(lat, lon) {       //currentWeather property takes 2 parameters lat and lon and returns the url to retreive current weather data. 
    return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
  },
  forecast(lat, lon) {             //forecast property takes 2 parameters lat and lon and returns the url to retreive forecast weather data.
    return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`
  },
  airPollution(lat, lon) {         //airPollution property takes 2 parameters lat and lon and returns the url to retreive air pollution data.
    return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
  },
  reverseGeo(lat, lon) {           //reverseGeo property takes 2 parameters lat and lon and returns the url to retreive reverse geocoding data.
    return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
  },
  /**
   * @param {string} query Search query e.g.: "London", "New York"      //anotation to say that query is a string
   */
  geo(query) {                      //geo property takes 1 parameter query and returns the url to retreive geocoding data.
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
  }
}

//@param are used to document the parameters of a function. like a comment but more formal.