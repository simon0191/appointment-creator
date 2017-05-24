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
  'Enable and disable Save button' : function (browser) {

    browser
      .waitForElementVisible(refs.datepickerInput, 1000);

    browser.expect.element(refs.saveBtn).to.have.attribute('disabled');

    browser
      .click(refs.datepickerInput)
      .waitForElementVisible(refs.datepicker, 1000)
      .click(`${refs.datepicker} .day[data-day='${currDate.getDate()}']`)

    browser.expect.element(refs.saveBtn).to.not.have.attribute('disabled');
  },

  'Save': (browser) => {
    const expectedTime = '12:00 PM';

    browser
      .click(refs.saveBtn)
      .waitForElementVisible(refs.message, 1000)
      .assert.containsText(refs.message, currDate.toLocaleDateString())
      .assert.containsText(refs.message, expectedTime)
  },

  'Cancel': (browser) => {
    const defaultTime = `${12*60}`;

    browser
      .click(refs.cancelBtn);

    browser.expect.element(refs.saveBtn).to.have.attribute('disabled');

    browser
      .assert.value(refs.datepickerInput, '')
      .assert.value(refs.timepicker, defaultTime);

    browser.expect.element(refs.message).text.to.equal('');
  },

  'End': (browser) => {
    browser.end();
  },
};
