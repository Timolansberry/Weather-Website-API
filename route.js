'use strict';

//** code sets up routing for a weather application based on the 
//hash portion of the URL. It allows the application to handle different routes, 
//such as displaying weather information based on the user's current location or a searched location.**//


import { updateWeather, error404 } from "./app.js";           //Two functions, updateWeather and error404, are imported from the "./app.js" module.
const defaultLocation = "#/weather?lat=38.889447&lon=-77.035246" // * Washington, DC // constant stores a default location URL for the weather application. 

const currentLocation = function () {                          //currentLocation function is defined as a callback function for retrieving the current user's location. it takes no parameters.
  window.navigator.geolocation.getCurrentPosition(res => {     //It uses the window.navigator.geolocation.getCurrentPosition method to get the current position. it has 2 parameters, res and err. res is a callback function that takes the current position as a parameter, and err is a callback function that takes an error as a parameter.
    const { latitude, longitude } = res.coords;                //When the position is successfully obtained (res), the latitude and longitude coordinates are extracted from the result
                                               
    updateWeather(`lat=${latitude}`, `lon=${longitude}`);      //and passed to the updateWeather function
  }, err => {
    window.location.hash = defaultLocation;                    // If an error occurs (err), the user is redirected to the default location.
  });
}

/**
 * @param {string} query Searched query
 */                                                                       //searchedLocation function is a callback function for handling a searched location
const searchedLocation = query => updateWeather(...query.split("&"));     //It takes a query parameter, which represents the searched query in the format "lat=latitude&lon=longitude".
// updateWeather("lat=38.889447", "lon=-77.035246")                       //The query string is split into an array of arguments and passed to the updateWeather function.

const routes = new Map([                                       //routes constant is declared as a Map object. It contains two key-value pairs, each representing a route and its corresponding callback function. It maps different URL routes to their corresponding callback functions. 
  ["/current-location", currentLocation],                      //In this case, the "/current-location" route is mapped to the currentLocation function
  ["/weather", searchedLocation]                               //and the "/weather" route is mapped to the searchedLocation function.
]);

const checkHash = function () {                                //The checkHash function is responsible for handling the hash change event. It retrieves the hash portion of the URL (window.location.hash) and removes the "#" symbol.
  const requestURL = window.location.hash.slice(1);            //the slice(1) method is used to remove the "#" symbol from the hash portion of the URL.

  const [route, query] = requestURL.includes ? requestURL.split("?") : [requestURL];    //The requestURL.includes condition checks if the requestURL contains a "?" character, which indicates the 
                                                                                         //presence of a query string. If the condition is true, the requestURL is split into two parts: the route and query. 
                                                                                         //The split("?") method separates the string at the "?" character and returns an array containing the route and query parts. The destructuring assignment [route, query] assigns the array elements to the route and query variables.
                                                                                        //If the requestURL does not contain a "?", the array [requestURL] is assigned to [route, query], meaning there is no query part in the URL.

                                                                                        //The routes.get(route) expression attempts to retrieve the callback function associated with the route key from the routes map
                                                                                        //If the route exists in the routes map, the expression routes.get(route)(query) is evaluated. This invokes the corresponding callback function with the query argument, passing the query string for further processing.
  routes.get(route) ? routes.get(route)(query) : error404();                            //If the route does not exist in the routes map, the error404 function is invoked.
}

window.addEventListener("hashchange", checkHash);                  //Event listeners are added for the "hashchange" and "load" events. 
                                                                    //The "hashchange" event listener calls the checkHash function whenever the hash portion of the URL changes.

window.addEventListener("load", function () {                  //The "load" event listener checks if the hash is empty (i.e., the page is loaded without a hash) and sets the hash to "#/current-location" if it is empty. If the hash is not empty, the checkHash function is called to handle the initial hash value.
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});