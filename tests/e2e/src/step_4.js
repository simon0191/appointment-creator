const refs = require('../refs');
const currDate = new Date();
currDate.setHours(0);
currDate.setMinutes(0);
currDate.setSeconds(0);
currDate.setMilliseconds(0);

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
  'All days filter activated by default' : (browser) => {

    browser
      .waitForElementVisible(refs.filters, 1000);

    browser.expect.element(`${refs.filters} input[value="any"]`).to.have.attribute('selected');
  },

  'Invalid dates disabled' : (browser) => {

    browser.click(refs.datepickerInput)
      .waitForElementVisible(refs.datepicker, 1000)
      .click(refs.prevMonth)

    browser.expect.element(`${refs.datepicker} .day[data-day='${prevMonth.getDate()}']`).to.have.attribute('disabled');
  },

  'Change filter': (browser) => {
    browser
      .click(refs.title)
      .click(`${refs.filters} input[value="weekdays"]`)
      .click(refs.datepickerInput)
      .waitForElementVisible(refs.datepicker, 1000)
      .click(refs.nextMonth);

    browser.expect.element(`${refs.datepicker} .day[data-weekday='0']`).to.have.attribute('disabled');
    browser.expect.element(`${refs.datepicker} .day[data-weekday='6']`).to.have.attribute('disabled');

    browser.expect.element(`${refs.datepicker} .day[data-weekday='1']`).to.not.have.attribute('disabled');
    browser.expect.element(`${refs.datepicker} .day[data-weekday='2']`).to.not.have.attribute('disabled');
    browser.expect.element(`${refs.datepicker} .day[data-weekday='3']`).to.not.have.attribute('disabled');
    browser.expect.element(`${refs.datepicker} .day[data-weekday='4']`).to.not.have.attribute('disabled');
    browser.expect.element(`${refs.datepicker} .day[data-weekday='5']`).to.not.have.attribute('disabled');
  },

  'End': (browser) => {
    browser.end();
  },
};
