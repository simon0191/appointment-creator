const dp = new DatePicker({
  selector: '#datepicker',
  disableDayFn: (date) => [0, 6].includes(date.getDay()), //Only weekdays
  defaultDate: () => null
});

dp.on('change', (event) => {
  console.log(`prev: ${event.prevDate ? event.prevDate.toString() : '-'}`);
  console.log(`curr: ${event.date ? event.date.toString() : '-'}`);
});
