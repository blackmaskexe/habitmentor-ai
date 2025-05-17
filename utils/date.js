const date = new Date();
const weekdayNumber = date.getDay();
const formattedDate = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}`;

export { date, weekdayNumber, formattedDate };
