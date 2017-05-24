const refs = require('../refs');

module.exports = {
  'Init': (browser) => {
    browser.url(browser.launch_url);
  },
  'Default time' : (browser) => {

    const expectedDefaultTime = `${12*60}`;

    browser
      .waitForElementVisible(refs.timepicker, 1000)
      .assert.value(refs.timepicker, expectedDefaultTime);
  },

  'Show all time options': (browser) => {
    browser.elements('css selector', refs.timepickerOptions, (result) => {
      browser.assert.ok(result.value.length === (24*60/15));
    });
  },

  'End': (browser) => {
    browser.end();
  },
};
