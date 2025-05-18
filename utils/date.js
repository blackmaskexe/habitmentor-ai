// Exporting functions instead of the value so that
// Each call of the function returns the latest value of
// dates, so that if the app persists in memory
// for many days at a time, it won't mess up date calculation

const getDate = function () {
  return new Date();
};

const getWeekdayNumber = function () {
  return new Date().getDay(); // 0 is sunday, 1 is monday, so on
};

const getFormattedDate = function () {
  const date = getDate();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export { getDate, getWeekdayNumber, getFormattedDate };
