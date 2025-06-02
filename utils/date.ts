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

const getFormattedDate = function () {
  const date = getDate();
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

export {
  getDate,
  getWeekdayNumber,
  getFormattedDate,
  getDateFromFormattedDate,
  getWeekNumber,
  getTimeOfDay,
};
