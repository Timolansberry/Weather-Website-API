'use strict';

import { fetchData, url } from "./api.js";                            // code imports two modules: fetchData and url from a file named "api.js"
import * as module from "./module.js";                                // imports all exports from a file named "module.js" and stores them in a variable named "module"

/**
 * Add event listener on multiple elements
 * @param {NodeList} elements Eelements node array
 * @param {string} eventType Event Type e.g.: "click", "mouseover"
 * @param {Function} callback Callback function
 */
const addEventOnElements = function (elements, eventType, callback) {            //function named addEventOnElements that takes three parameters: elements, eventType, and callback.
  for (const element of elements) element.addEventListener(eventType, callback); ///for loop that iterates through the elements array and adds an event listener to each element.
}

/* Toggle search in mobile devices */
const searchView = document.querySelector("[data-search-view]");              //searchView represents the search view element, 
const searchTogglers = document.querySelectorAll("[data-search-toggler]");    //searchTogglers represents the elements that trigger the search view toggle.

const toggleSearch = () => searchView.classList.toggle("active");         //defines a function named toggleSearch, which toggles the "active" class on the searchView element when called.
addEventOnElements(searchTogglers, "click", toggleSearch);                 //addEventOnElements function is used to add a click event listener to each element in the searchTogglers NodeList. When clicked, it invokes the toggleSearch function, toggling the visibility of the search view.

/* SEARCH INTEGRATION */
const searchField = document.querySelector("[data-search-field]");         //selects the DOM elements related to the search field and search results, including searchField and searchResult
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;                        // defines a variable named searchTimeout and sets it to null
const serachTimeoutDuration = 500;

searchField.addEventListener("input", function () {     // adds an input event listener to the searchField element. When the input event occurs (i.e., the user types or deletes text), the attached callback function is executed.

  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchField.value) {                         //if the search field is empty, the search result is hidden and the search field is no longer in the "searching" state. (Inside the input event callback function, the code checks if searchField has a value. )
    searchResult.classList.remove("active");     //If it doesn't have a value, it removes the "active" class from searchResult
    searchResult.innerHTML = "";               //and clears the innerHTML of searchResult. (its's content)
    searchField.classList.remove("searching");  //It also removes the "searching" class from searchField.
  } else {
    searchField.classList.add("searching");     //If searchField has a value, the code adds the "searching" class to searchField.
  }

  if (searchField.value) {
    searchTimeout = setTimeout(() => {            //sets a new timeout using setTimeout to delay the search request. 
      fetchData(url.geo(searchField.value), function (locations) {      //Inside the timeout callback function, the code fetches data based on the search field value using the fetchData function. The url.geo(searchField.value) represents the URL for fetching geolocation data based on the search query.
        searchField.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = `
          <ul class="view-list" data-search-list></ul>
        `;                                         //sets the inner HTML content of the search result element to a new list structure.

        const /** {NodeList} | [] */ items = [];

        for (const { name, lat, lon, country, state } of locations) {
          const searchItem = document.createElement("li");
          searchItem.classList.add("view-item");

          searchItem.innerHTML = `
            <span class="m-icon">location_on</span>

            <div>
              <p class="item-title">${name}</p>

              <p class="label-2 item-subtitle">${state || ""} ${country}</p>
            </div>

            <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
          `;

          searchResult.querySelector("[data-search-list]").appendChild(searchItem); //appends the searchItem element to the search result list.
          items.push(searchItem.querySelector("[data-search-toggler]"));
        }

        addEventOnElements(items, "click", function () {      //adds event listeners to the dynamically created elements (items) using the addEventOnElements function. In this case, it listens for a "click" event and executes a callback function that calls toggleSearch() and removes the "active" class from searchResult
          toggleSearch();
          searchResult.classList.remove("active");
        })
      });
    }, serachTimeoutDuration);
  }

});


const container = document.querySelector("[data-container]");                //selects various DOM elements using document.querySelector and assigns them to corresponding variables: container, loading, currentLocationBtn, and errorContent.
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");

/**
 * Render all weather data in html page
 * 
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 */
export const updateWeather = function (lat, lon) {          //updateWeather function is exported as a named export. It takes the lat (latitude) and lon (longitude) as parameters.

  loading.style.display = "block";
  container.style.overflowY = "hidden";
  container.classList.remove("fade-in");
  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector("[data-current-weather]");
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";

  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }

  /* CURRENT WEATHER SECTION */
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {

    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone
    } = currentWeather
    const [{ description, icon }] = weather;

    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");

    card.innerHTML = `
      <h2 class="title-2 card-title">Now</h2>

      <div class="weapper">
        <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>

        <img src="./assets/images/weather_icons/${icon}.png" width="64" height="64" alt="${description}"
          class="weather-icon">
      </div>

      <p class="body-3">${description}</p>

      <ul class="meta-list">

        <li class="meta-item">
          <span class="m-icon">calendar_today</span>

          <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
        </li>

        <li class="meta-item">
          <span class="m-icon">location_on</span>

          <p class="title-3 meta-text" data-location></p>
        </li>

      </ul>
    `;

    fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
      card.querySelector("[data-location]").innerHTML = `${name}, ${country}`
    });

    currentWeatherSection.appendChild(card);

    /* TODAY'S HIGHLIGHTS */
    fetchData(url.airPollution(lat, lon), function (airPollution) {

      const [{
        main: { aqi },
        components: { no2, o3, so2, pm2_5 }
      }] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");

      card.innerHTML = `
        <h2 class="title-2" id="highlights-label">Today's Highlights</h2>

        <div class="highlight-list">

          <div class="card card-sm highlight-card one">

            <h3 class="title-3">Air Quality Index</h3>

            <div class="wrapper">

              <span class="m-icon">air</span>

              <ul class="card-list">

                <li class="card-item">
                  <p class="title-1">${pm2_5.toFixed(1)}</p>

                  <p class="label-1">PM<sub>2.5</sub></p>
                </li>

                <li class="card-item">
                  <p class="title-1">${so2.toFixed(1)}</p>

                  <p class="label-1">SO<sub>2</sub></p>
                </li>

                <li class="card-item">
                  <p class="title-1">${no2.toFixed(1)}</p>

                  <p class="label-1">NO<sub>2</sub></p>
                </li>

                <li class="card-item">
                  <p class="title-1">${o3.toFixed(1)}</p>

                  <p class="label-1">O<sub>3</sub></p>
                </li>

              </ul>

            </div>

            <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}">
              ${module.aqiText[aqi].level}
            </span>

          </div>

          <div class="card card-sm highlight-card two">

            <h3 class="title-3">Sunrise & Sunset</h3>

            <div class="wrapper">
            <div class="card-list">

              <div class="card-item">
                <span class="m-icon">clear_day</span>

                <div>
                  <p class="label-1">Sunrise</p>

                  <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
                </div>
              </div>

              <div class="card-item">
                <span class="m-icon">clear_night</span>

                <div>
                  <p class="label-1">Sunset</p>

                  <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
                </div>
              </div>

            </div>
            </div>
          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Humidity</h3>

            <div class="wrapper">
              <span class="m-icon">humidity_percentage</span>

              <p class="title-1">${humidity}<sub>%</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Pressure</h3>

            <div class="wrapper">
              <span class="m-icon">airwave</span>

              <p class="title-1">${pressure}<sub>hPa</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Visibility</h3>

            <div class="wrapper">
              <span class="m-icon">visibility</span>

              <p class="title-1">${visibility / 1000}<sub>km</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Feels Like</h3>

            <div class="wrapper">
              <span class="m-icon">thermostat</span>

              <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
            </div>

          </div>

        </div>
      `;

      highlightSection.appendChild(card);

    });

    /* 24H FORECAST SECTION */
    fetchData(url.forecast(lat, lon), function (forecast) {

      const {
        list: forecastList,
        city: { timezone }
      } = forecast;

      hourlySection.innerHTML = `
        <h2 class="title-2">Today at</h2>

        <div class="slider-container">
          <ul class="slider-list" data-temp></ul>

          <ul class="slider-list" data-wind></ul>
        </div>
      `;

      for (const [index, data] of forecastList.entries()) {

        if (index > 7) break;

        const {
          dt: dateTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed }
        } = data
        const [{ icon, description }] = weather

        const tempLi = document.createElement("li");
        tempLi.classList.add("slider-item");

        tempLi.innerHTML = `
          <div class="card card-sm slider-card">

            <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

            <img src="./assets/images/weather_icons/${icon}.png" width="48" height="48" loading="lazy" alt="${description}"
              class="weather-icon" title="${description}">

            <p class="body-3">${parseInt(temp)}&deg;</p>

          </div>
        `;
        hourlySection.querySelector("[data-temp]").appendChild(tempLi);

        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");

        windLi.innerHTML = `
        <div class="card card-sm slider-card">

          <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

          <img src="./assets/images/weather_icons/direction.png" width="48" height="48" loading="lazy" alt="direction"
            class="weather-icon" style="transform: rotate(${windDirection - 180}deg)">

          <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>

        </div>
        `;
        hourlySection.querySelector("[data-wind]").appendChild(windLi);

      }

      /* 5 DAY FORECAST SECTION */
      forecastSection.innerHTML = `
        <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>

        <div class="card card-lg forecast-card">
          <ul data-forecast-list></ul>
        </div>
      `;

      for (let i = 7, len = forecastList.length; i < len; i += 8) {

        const {
          main: { temp_max },
          weather,
          dt_txt
        } = forecastList[i];
        const [{ icon, description }] = weather
        const date = new Date(dt_txt);

        const li = document.createElement("li");
        li.classList.add("card-item");

        li.innerHTML = `
          <div class="icon-wrapper">
            <img src="./assets/images/weather_icons/${icon}.png" width="36" height="36" alt="${description}"
              class="weather-icon" title="${description}">

            <span class="span">
              <p class="title-2">${parseInt(temp_max)}&deg;</p>
            </span>
          </div>

          <p class="label-1">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>

          <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
        `;
        forecastSection.querySelector("[data-forecast-list]").appendChild(li);

      }

      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.add("fade-in");
    });

  });

}

export const error404 = () => errorContent.style.display = "flex";