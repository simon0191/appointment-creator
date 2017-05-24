const refs = require('../refs');
const currDate = new Date();
currDate.setHours(0);
currDate.setMinutes(0);
currDate.setSeconds(0);
currDate.setMilliseconds(0);

module.exports = {
  'Init': (browser) => {
    browser.url(browser.launch_url);
  },

  'Hide prev times when selected date equals today' : (browser) => {
    const now = new Date();
    const todayMins = now.getHours()*60 + now.getMinutes();
    const next15Interval = todayMins + 15 - (todayMins%15);
    const totalOptions = (60*24 - next15Interval)/15;

    browser
      .waitForElementVisible(refs.datepickerInput, 1000)
      .click(refs.datepickerInput)
      .waitForElementVisible(refs.datepicker, 1000)
      .click(`${refs.datepicker} .day[data-day='${currDate.getDate()}']`);

    browser.elements('css selector', refs.timepickerOptions, (result) => {
      browser.assert.ok(result.value.length === totalOptions);
    });
  },

  'Show all time options when date is not today': (browser) => {
    browser
      .waitForElementVisible(refs.datepickerInput, 1000)
      .click(refs.datepickerInput)
      .waitForElementVisible(refs.datepicker, 1000)
      .click(refs.nextMonth)
      .click(`${refs.datepicker} .day[data-day='1']`);

    browser.elements('css selector', refs.timepickerOptions, (result) => {
      browser.assert.ok(result.value.length === (60*24/15));
    });
  },

  'End': (browser) => {
    browser.end();
  },
};
