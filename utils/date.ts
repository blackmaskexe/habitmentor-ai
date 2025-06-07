// Exporting functions instead of the value so that
// Each call of the function returns the latest value of
// dates, so that if the app persists in memory
// for many days at a time, it won't mess up date calculation

import { getISOWeek } from "date-fns";

const getDate = function () {
  return new Date();
};

const getWeekdayNumber = function (date?: Date) {
  if (date) {
    return date.getDay();
  }
  return new Date().getDay(); // 0 is sunday, 1 is monday, so on
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

const getDateFromFormattedDate = function (formattedDate: string) {
  const splitDate = formattedDate.split("-");
  const fullYear = +splitDate[0];
  const month = +splitDate[1] - 1;
  const date = +splitDate[2];

  return new Date(fullYear, month, date);
};

const getTimeOfDay = function () {
  const date = new Date();
  const hourOfDay = date.getHours();
  if (hourOfDay < 10) return "morning";
  if (hourOfDay < 15) return "afternoon";
  return "evening";
};

const getFormattedDatesThisWeek = function () {
  const today = new Date(); // suppose today is wednesday
  const todayWeekdayNumber = today.getDay(); // returns 3
  // we have to loop in such a way that the first day is obtained by subtracting 3, and end at adding 7 - 3
  console.log("poore lag gaye", todayWeekdayNumber);

  const formattedDatesThisWeekArray = [];
  for (let i = -1 * todayWeekdayNumber; i < 7 - todayWeekdayNumber; i++) {
    let dateOnThisDay = new Date();
    dateOnThisDay.setDate(today.getDate() + i);
    console.log("with your loi vi bag, tats on your arms,", dateOnThisDay);
    formattedDatesThisWeekArray.push(getFormattedDate(dateOnThisDay));
  }

  return formattedDatesThisWeekArray;
};

const getDatesThisWeek = function () {
  const today = new Date(); // suppose today is wednesday
  const todayWeekdayNumber = today.getDay(); // returns 3
  // we have to loop in such a way that the first day is obtained by subtracting 3, and end at adding 7 - 3
  console.log("poore lag gaye", todayWeekdayNumber);

  const formattedDatesThisWeekArray = [];
  for (let i = -1 * todayWeekdayNumber; i < 7 - todayWeekdayNumber; i++) {
    let dateOnThisDay = new Date();
    dateOnThisDay.setDate(today.getDate() + i);
    console.log("with your loi vi bag, tats on your arms,", dateOnThisDay);
    formattedDatesThisWeekArray.push(dateOnThisDay);
  }

  return formattedDatesThisWeekArray;
};

export {
  getDate,
  getWeekdayNumber,
  getFormattedDate,
  getDateFromFormattedDate,
  getWeekNumber,
  getTimeOfDay,
  getFormattedDatesThisWeek,
  getDatesThisWeek,
};
