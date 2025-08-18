// Exporting functions instead of the value so that
// Each call of the function returns the latest value of
// dates, so that if the app persists in memory
// for many days at a time, it won't mess up date calculation

import { getISOWeek } from "date-fns";

export const getDate = function () {
  // this function is to be able to change date from this central location easily
  // return new Date();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 8);
  return tomorrow;
};

export const getDateMinusNDays = (daysOffset: number, date?: Date) => {
  const baseDate = date ? new Date(date) : getDate();
  baseDate.setDate(baseDate.getDate() - daysOffset);
  return baseDate;
};

export const getWeekdayNumber = function (date?: Date) {
  if (date) {
    return date.getDay();
  }
  return getDate().getDay(); // 0 is sunday, 1 is monday, so on
};

export const getWeekNumber = function (date: Date) {
  return getISOWeek(date);
};

export const getFormattedDate = function (customDate?: Date) {
  let date = null;
  if (customDate) {
    date = customDate;
  } else {
    date = getDate();
  }
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const getPrettyDate = function (date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const getFormattedTime = function (date: Date) {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export const getDateFromFormattedTime = function (formattedTime: string) {
  const date = new Date();
  // this function will be used to only extract the hours and minutes in the useNotification's schedulePushNotification function, so no need to focus on which date

  const timeParts = formattedTime.split(" ");
  let hour = +timeParts[0].split(":")[0];
  const minute = +timeParts[0].split(":")[1];
  const ampm = timeParts[1];

  if (ampm === "PM" && hour < 12) {
    // For 1:00 PM to 11:59 PM, add 12
    hour += 12;
  } else if (ampm === "AM" && hour === 12) {
    // For 12:00 AM to 12:59 AM (midnight), set hours to 0
    hour = 0;
  }

  date.setHours(hour, minute);
  return date;
};

export const getDateFromFormattedDate = function (formattedDate: string) {
  const splitDate = formattedDate.split("-");
  const fullYear = +splitDate[0];
  const month = +splitDate[1] - 1;
  const date = +splitDate[2];

  return new Date(fullYear, month, date);
};

export const getTimeOfDay = function () {
  const date = getDate();
  const hourOfDay = date.getHours();
  if (hourOfDay < 10) return "morning";
  if (hourOfDay < 15) return "afternoon";
  return "evening";
};

export const getFormattedDatesThisWeek = function () {
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

export const getDatesThisWeek = function () {
  const today = getDate(); // suppose today is wednesday
  const todayWeekdayNumber = today.getDay(); // returns 3
  // we have to loop in such a way that the first day is obtained by subtracting 3, and end at adding 7 - 3

  const datesThisWeekArray = [];
  for (let i = -1 * todayWeekdayNumber; i < 7 - todayWeekdayNumber; i++) {
    let dateOnThisDay = getDate();
    dateOnThisDay.setDate(today.getDate() + i);
    datesThisWeekArray.push(dateOnThisDay);
  }

  return datesThisWeekArray;
};

export const getDatesLastWeek = function () {
  const today = new Date();

  // getting date of previous sunday:
  const prevSunday = new Date(today);
  prevSunday.setDate(today.getDate() - today.getDay() - 7);

  const datesLastWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(prevSunday);
    d.setDate(prevSunday.getDate() + i);
    datesLastWeek.push(d);
  }

  return datesLastWeek;
};

export const getFormattedDatesLastWeek = function () {
  const formattedDatesLastWeek: string[] = [];
  for (const date of getDatesLastWeek()) {
    formattedDatesLastWeek.push(getFormattedDate(date));
  }

  return formattedDatesLastWeek;
};

export const relationBetweenTodayAndDate = function (date: Date) {
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
