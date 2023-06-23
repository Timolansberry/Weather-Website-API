'use strict';

export const weekDayNames = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado"
];

export const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez"
];

/**
 * @param {number} dateUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date String. formate: "Sunday 10, Jan"
 */
export const getDate = function (dateUnix, timezone) {
  const date = new Date((dateUnix + timezone) * 1000);
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];

  return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
}

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. formate: "HH:MM AM/PM"
 */
export const getTime = function (timeUnix, timezone) {
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
export const getHours = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12} ${period}`;
}

/**
 * @param {number} mps Metter per seconds
 * @returns {number} Kilometer per hours
 */
export const mps_to_kmh = mps => {
  const mph = mps * 3600;
  return mph / 1000;
}

export const aqiText = {
  1: {
    level: "Bom",
    message: "A qualidade do ar é considerada satisfatória e a poluição do ar apresenta pouco ou nenhum risco."
  },
  2: {
    level: "Adequada",
    message: "A qualidade do ar é aceitável; no entanto, para alguns poluentes, pode haver uma preocupação moderada com a saúde para um número muito pequeno de pessoas que são especialmente sensíveis à poluição do ar."
  },
  3: {
    level: "Moderada",
    message: "Membros de grupos sensíveis podem experienciar efeitos na saúde. O público em geral não é provável de ser afetado."
  },
  4: {
    level: "Ruim",
    message: "Todos podem começar a experimentar efeitos na saúde; membros de grupos sensíveis podem experimentar efeitos na saúde mais graves."
  },
  5: {
    level: "Muito Ruim",
    message: "Avisos de saúde sobre condições de emergência. É mais provável que toda a população seja afetada."
  }
}