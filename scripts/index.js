const container = Espinazo.createContainer({
  debug: true,
  selector: '#espinazo-app',
  state: {
    title: 'Welcome to the appointment creator',
    subtitle: 'Please select a date for your appointment:',
    year: new SuperDate().getFullYear(),
    month: new SuperDate().getMonth(),
    date: null,
    time: 60*12,
    isDatePickerOpen: false,
    datePickerLeft: 0,
    datePickerTop: 0,
  },
  render(state, node) {
    let value = '';
    if(state.date) {
      value = `value="${state.date.toLocaleDateString()}"`
    }
    let datepicker = '';
    if(state.isDatePickerOpen) {
      datepicker = `
        <ez-datepicker ez:ref:year="state.year"
                       ez:ref:month="state.month"
                       ez:ref:date="state.date"
                       left="${state.datePickerLeft}"
                       top="${state.datePickerTop}"
                       class="datepicker">
        </ez-datepicker>
      `;
    }

    return `
      <div onclick="actions.closeDatePicker(this)">
        <h1>${state.title}</h1>
        <p>${state.subtitle}</p>
        <input id="datepicker" onclick="actions.openDatePicker(this, event)" readonly type="text" placeholder="Choose a date..." ${value}/>
        ${datepicker}
        <ez-timepicker ez:ref:time="state.time"></ez-timepicker>
      </div>
    `;
  }
});

const actions = {
  prevMonth(event) {
    event.stopPropagation();
    if(container.state.month === 0) {
      container.setState(Object.assign({}, container.state, {
        month: 11,
        year: container.state.year - 1,
      }));
    } else {
      container.setState(Object.assign({}, container.state, {
        month: container.state.month - 1,
      }));
    }

  },

  nextMonth(event) {
    event.stopPropagation();
    if(container.state.month === 11) {
      container.setState(Object.assign({}, container.state, {
        month: 0,
        year: container.state.year + 1,
      }));
    } else {
      container.setState(Object.assign({}, container.state, {
        month: container.state.month + 1,
      }));
    }
  },

  setDate(date) {
    container.setState(Object.assign({}, container.state, {
      date: new SuperDate(date),
      isDatePickerOpen: false,
    }));
  },

  openDatePicker(input, event) {
    if(!container.state.isDatePickerOpen) {
      event.stopPropagation();
      const inputPosition = input.getBoundingClientRect();

      container.setState(Object.assign({}, container.state, {
        isDatePickerOpen: true,
        datePickerTop: inputPosition.bottom,
        datePickerLeft: inputPosition.left,
      }));
    }
  },

  closeDatePicker() {
    if(container.state.isDatePickerOpen) {
      container.setState(Object.assign({}, container.state, {
        isDatePickerOpen: false,
      }));
    }
  },

  setTime(time) {
    container.setState(Object.assign({}, container.state, {
      time: time && parseInt(time),
    }));
  }
};

container.init();