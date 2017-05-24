const refs = require('../refs');

const currDate = new Date();
currDate.setHours(0);
currDate.setMinutes(0);
currDate.setSeconds(0);
currDate.setMilliseconds(0);

const nextMonth = new Date();
nextMonth.setDate(1)
nextMonth.setMonth(nextMonth.getMonth() + 1)
nextMonth.setHours(0);
nextMonth.setMinutes(0);
nextMonth.setSeconds(0);
nextMonth.setMilliseconds(0);

const prevMonth = new Date();
prevMonth.setDate(1)
prevMonth.setMonth(prevMonth.getMonth() - 1)
prevMonth.setHours(0);
prevMonth.setMinutes(0);
prevMonth.setSeconds(0);
prevMonth.setMilliseconds(0);

module.exports = {
  'Init': (browser) => {
    browser.url(browser.launch_url);
  },
  'Select current date' : (browser) => {

    const formattedDate = currDate.toLocaleDateString();

    browser
      .waitForElementVisible(refs.datepickerInput, 1000)
      .click(refs.datepickerInput)
      .waitForElementVisible(refs.datepicker, 1000)
      .click(`${refs.datepicker} .day[data-day='${currDate.getDate()}']`)
      .assert.value(refs.datepickerInput, formattedDate)
  },

  'Select date from next month': (browser) => {
    const formattedDate = nextMonth.toLocaleDateString();

    browser
      .waitForElementVisible(refs.datepickerInput, 1000)
      .click(refs.datepickerInput)
      .waitForElementVisible(refs.datepicker, 1000)
      .click(refs.nextMonth)
      .click(`${refs.datepicker} .day[data-day='${nextMonth.getDate()}']`)
      .assert.value(refs.datepickerInput, formattedDate);
  },

  'Navigate to previous month': (browser) => {
    const formattedDate = nextMonth.toLocaleDateString();

    browser
      .waitForElementVisible(refs.datepickerInput, 1000)
      .click(refs.datepickerInput)
      .waitForElementVisible(refs.datepicker, 1000)
      .click(refs.prevMonth)
      .pause(100)
      .click(refs.prevMonth)
      .click(`${refs.datepicker} .day[data-day='${prevMonth.getDate()}']`)
      .assert.value(refs.datepickerInput, formattedDate);
  },

  'Open in selected date': (browser) => {
    browser
      .click(refs.title)
      .click(refs.datepickerInput)
      .waitForElementVisible(refs.datepickerInput, 1000)
      .assert.cssClassPresent(`${refs.datepicker} .day[data-day='${nextMonth.getDate()}']`, 'selected')
  },

  'End': (browser) => {
    browser.end();
  },
};
