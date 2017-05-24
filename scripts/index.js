const Utils = {
  timeFormatter(n) {
    n = n%(60*24);
    const format = (x) => x < 10 ? `0${x}`:`${x}`;
    const ampm = n >= 12*60 ? 'PM' : 'AM';
    let hours = Math.floor(n/60);
    let mins = n%60;

    switch(true) {
      case (hours === 0): hours = 12; break;
      case (hours > 12): hours = hours - 12; break;
      default: hours = hours; break;
    }

    return `${format(hours)}:${format(mins)} ${ampm}`;
  },

  disableDayFn: (date) => {
    const currDate = new SuperDate().beginningOfDay();
    return currDate.isAfter(date);
  },

  disableWeekdaysFn: (date) => {
    const currDate = new SuperDate().beginningOfDay();
    return currDate.isAfter(date) || [1,2,3,4,5].includes(date.getDay());
  },

  disableWeekendsFn: (date) => {
    const currDate = new SuperDate().beginningOfDay();
    return currDate.isAfter(date) || [0,6].includes(date.getDay());
  },
};

const container = Espinazo.createContainer({
  debug: true,
  selector: '#espinazo-app',
  defaultState: {
    title: 'Welcome to the appointment creator',
    subtitle: 'Please select a date for your appointment:',
    year: new SuperDate().getFullYear(),
    month: new SuperDate().getMonth(),
    date: null,
    time: 60*12,
    timeFormatter: Utils.timeFormatter,
    isDatePickerOpen: false,
    datePickerLeft: 0,
    datePickerTop: 0,
    isSaved: false,
    savedTime: null,
    savedDate: null,
    dateFilter: 'any',
    disableDayFn: Utils.disableDayFn,
  },
  render(state, node) {
    let value = '';
    if(state.date) {
      value = `value="${state.date.toLocaleDateString()}"`
    }
    let datepicker = '';
    if(state.isDatePickerOpen) {
      datepicker = `
        <ez-datepicker
          ez:ref:year="state.year"
          ez:ref:month="state.month"
          ez:ref:date="state.date"
          ez:ref:disable-day-fn="state.disableDayFn"
          left="${state.datePickerLeft}"
          top="${state.datePickerTop}"
          class="datepicker"
          onclick="event.stopPropagation()">
        </ez-datepicker>
      `;
    }

    let savedMessage = '';
    if(state.isSaved) {
      savedMessage = `
        <p>Good! Your appointment is set for ${state.savedDate.toLocaleDateString()} at ${state.timeFormatter(state.savedTime)}. Thanks.</p>
      `;
    }

    return `
      <div class="main-container container" onclick="actions.closeDatePicker(this)">
        <div class="row">
          <div className="col-12">
            <h1>${state.title}</h1>
            <p>${state.subtitle}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-4 filters">
            <div>
              <input ${state.dateFilter === 'any' ? 'checked' : ''} type="radio" name="filter" onclick="actions.setDateFilter('any')" value="any"> Any Date
            </div>
            <div>
              <input ${state.dateFilter === 'weekends' ? 'checked' : ''} type="radio" name="filter" onclick="actions.setDateFilter('weekends')" value="weekends"> Only weekends
            </div>
            <div>
              <input ${state.dateFilter === 'weekdays' ? 'checked' : ''} type="radio" name="filter" onclick="actions.setDateFilter('weekdays')" value="weekdays"> Only weekdays
            </div>
          </div>
          <div class="col-4">
            <input id="datepicker" onclick="actions.openDatePicker(this, event)" readonly type="text" placeholder="Choose a date..." ${value}/>
            ${datepicker}
          </div>
          <div class="col-4">
            <ez-timepicker ez:ref:time="state.time" ez:ref:time-formatter="state.timeFormatter"></ez-timepicker>
          </div>
        </div>

        <div class="buttons">
          <button ${state.date && state.time ? '' : 'disabled'} onclick="actions.save()" class="save">Save</button>
          <button onclick="actions.reset()" class="cancel">Cancel</button>
        </div>

        <div class="message">
          ${savedMessage}
        </div>
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
        year: (container.state.date || new SuperDate()).getFullYear(),
        month: (container.state.date || new SuperDate()).getMonth(),
      }));
    }
  },

  setTime(time) {
    container.setState(Object.assign({}, container.state, {
      time: time && parseInt(time),
    }));
  },

  save() {
    container.setState(Object.assign({}, container.state, {
      isSaved: true,
      savedTime: container.state.time,
      savedDate: container.state.date,
    }));
  },

  reset() {
    container.setState(Object.assign({}, container.defaultState));
  },

  setDateFilter(filter) {
    if(container.state.dateFilter !== filter) {
      let disableDateFn = null;
      let date = container.state.date;
      switch(filter) {
        case 'any': disableDateFn = Utils.disableDayFn; break;
        case 'weekends': disableDateFn = Utils.disableWeekdaysFn; break;
        case 'weekdays': disableDateFn = Utils.disableWeekendsFn; break;
        default: return;
      }
      if(date && disableDateFn(date)) {
        date = null;
      }
      container.setState(Object.assign({}, container.state, {
        dateFilter: filter,
        disableDayFn: disableDateFn,
        date: date,
        year: (date || new SuperDate()).getFullYear(),
        month: (date || new SuperDate()).getMonth(),
      }));
    }
  }
};

container.init();