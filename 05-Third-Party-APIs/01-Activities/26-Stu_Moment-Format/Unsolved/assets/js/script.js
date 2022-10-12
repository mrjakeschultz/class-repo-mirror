// Use Moment.js to format the date and assign to the declared variable.
// TODO: 1. What is your graduation date in the following format: Jan 1st, 1999?
var gradDate = moment("2022-03-09").format("MMM Do YYYY");
$("#1a").text(gradDate);

// TODO: 2. What day of the week will 1/1/2022 be?
var weekDay = moment("1/1/2022").format("dddd");
$("#2a").text(weekDay);

// TODO: 3. Out of 365, what day of the year is today?
var now = moment(10 / 11 / 2022).format("DDD");
$("#3a").text(now);
console.log(now);

// TODO: 4. What is the current time in the format: hours:minutes:seconds
var time;
$("#4a").text(time);

// TODO: 5. What is the current Unix timestamp?
var unix;
$("#5a").text(unix);

// TODO: 6. Parse the following Unix timestamp, 1318781876, and convert into any time/date format.
var unixFormat;
$("#6a").text(unixFormat);
