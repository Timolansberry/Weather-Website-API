'use strict';

// code provides utility functions and data for working with dates, times, and air quality, making it easier 
// to format and manipulate these values in a JavaScript application.



export const weekDayNames = [  //declares weekDayNames constant and exports it. It contains an array of strings representing the days of the week.
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
    "Friday",
    "Saturday"
];

export const monthNames = [   //declares monthNames constant and exports it. It contains an array of strings representing the months of the year.
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"

];

/**
 * @param {number} dateUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date String. formate: "Sunday 10, Jan"
 */
export const getDate = function (dateUnix, timezone) {   //function takes a Unix timestamp and a timezone offset as input. 
  const date = new Date((dateUnix + timezone) * 1000);   //creates a new Date object based on the provided values, adjusts it according to the timezone
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];

  return `${weekDayName} ${date.getUTCDate()}, ${monthName}`; //returns a formatted date string in the format "Sunday 10, Jan".
}

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. formate: "HH:MM AM/PM"
 */
export const getTime = function (timeUnix, timezone) {   //getTime function is similar to getDate, but it returns a formatted time string in the format "HH:MM AM/PM".
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12}:${minutes} ${period}`;
}

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. formate: "HH AM/PM"
 */
export const getHours = function (timeUnix, timezone) {   //getHours function is also similar to getDate, but it returns a formatted hour string in the format "HH AM/PM".
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12} ${period}`;
}

/**
 * @param {number} mps Metter per seconds
 * @returns {number} Kilometer per hours
 */
export const mps_to_kmh = mps => {    //mps_to_kmh function converts a speed value from meters per second (mps) to kilometers per hour (km/h).
  const mph = mps * 3600;
  return mph / 1000;
}

export const aqiText = {   //aqiText object contains information about Air Quality Index (AQI) levels. Each level is represented by a numeric key (1 to 5), and the corresponding value is an object with properties level and message
  1: {
    level: "Good",
    message: "Air quality is considered satisfactory and air pollution poses little or no risk."
  },
  2: {
    level: "Fair",
    message: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
  },
  3: {
    level: "Moderate",
    message: "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
  },
  4: {
    level: "Poor",
    message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
  },
  5: {
    level: "Very Poor",
    message: "Health warnings of emergency conditions. The entire population is more likely to be affected."
  }
}