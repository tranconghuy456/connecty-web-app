const dateObject = new Date();

const timeLogger = {
  // current date adjust 0 before single digit date
  date: () => {
    return `0 ${dateObject.getDate()}`.slice(-2);
  },

  // current month
  month: () => {
    return `0 ${dateObject.getMonth()}`.slice(-2);
  },

  // current year
  year: () => {
    return dateObject.getFullYear();
  },

  // current hours
  hours: () => {
    return dateObject.getHours();
  },

  // current minutes
  minutes: () => {
    return dateObject.getMinutes();
  },

  // current seconds
  seconds: () => {
    return dateObject.getSeconds();
  },
  // prints date in YYYY-MM-DD format
  fullDate: () => {
    return `${year}-${month}-${date}`;
  },

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  fullDateTime: () => {
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  },

  // prints time in HH:MM format
  fullTime: () => {
    return `${hours}:${minutes}`;
  },
};

export default timeLogger;
