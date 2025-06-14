// Exporting functions instead of the value so that
// Each call of the function returns the latest value of
// dates, so that if the app persists in memory
// for many days at a time, it won't mess up date calculation

import { getISOWeek } from "date-fns";

const getDate = function () {
  // this function is to be able to change date from this central location easily
  return new Date();
};

const getWeekdayNumber = function (date?: Date) {
  if (date) {
    return date.getDay();
  }
  return getDate().getDay(); // 0 is sunday, 1 is monday, so on
};

const getWeekNumber = function (date: Date) {
  return getISOWeek(date);
};

const getFormattedDate = function (customDate?: Date) {
  let date = null;
  if (customDate) {
    date = customDate;
  } else {
    date = getDate();
  }
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const getPrettyDate = function (date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const getFormattedTime = function (date: Date) {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};
const getDateFromFormattedDate = function (formattedDate: string) {
  const splitDate = formattedDate.split("-");
  const fullYear = +splitDate[0];
  const month = +splitDate[1] - 1;
  const date = +splitDate[2];

  return new Date(fullYear, month, date);
};

const getTimeOfDay = function () {
  const date = getDate();
  const hourOfDay = date.getHours();
  if (hourOfDay < 10) return "morning";
  if (hourOfDay < 15) return "afternoon";
  return "evening";
};

const getFormattedDatesThisWeek = function () {
  const today = getDate(); // suppose today is wednesday
  const todayWeekdayNumber = today.getDay(); // returns 3
  // we have to loop in such a way that the first day is obtained by subtracting 3, and end at adding 7 - 3

  const formattedDatesThisWeekArray = [];
  for (let i = -1 * todayWeekdayNumber; i < 7 - todayWeekdayNumber; i++) {
    let dateOnThisDay = getDate();
    dateOnThisDay.setDate(today.getDate() + i);
    formattedDatesThisWeekArray.push(getFormattedDate(dateOnThisDay));
  }

  return formattedDatesThisWeekArray;
};

const getDatesThisWeek = function () {
  const today = getDate(); // suppose today is wednesday
  const todayWeekdayNumber = today.getDay(); // returns 3
  // we have to loop in such a way that the first day is obtained by subtracting 3, and end at adding 7 - 3

  const formattedDatesThisWeekArray = [];
  for (let i = -1 * todayWeekdayNumber; i < 7 - todayWeekdayNumber; i++) {
    let dateOnThisDay = getDate();
    dateOnThisDay.setDate(today.getDate() + i);
    formattedDatesThisWeekArray.push(dateOnThisDay);
  }

  return formattedDatesThisWeekArray;
};

const relationBetweenTodayAndDate = function (date: Date) {
  const dateToday = getDate();

  // Helper function to calculate the difference in days
  const diffInDays = (date1: Date, date2: Date): number => {
    const timeDiff = date1.getTime() - date2.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  };

  const daysDifference = diffInDays(dateToday, date);

  if (daysDifference === 0) {
    return "Today";
  } else if (daysDifference === 1) {
    return "Yesterday";
  } else if (daysDifference > 1) {
    return getPrettyDate(date);
  } else {
    return "Future Date"; // Or handle future dates as you see fit
  }
};

export {
  getDate,
  getWeekdayNumber,
  getFormattedDate,
  getPrettyDate,
  getFormattedTime,
  getDateFromFormattedDate,
  getWeekNumber,
  getTimeOfDay,
  getFormattedDatesThisWeek,
  getDatesThisWeek,
  relationBetweenTodayAndDate,
};
