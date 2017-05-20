{
  const datePickerDefaultOpts = {
    selector: '[data-datepicker]',
    disableDayFn: () => false,
    defaultDate: () => new Date(),
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dayNames: ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    inputFormatter: (date) => date.toLocaleDateString()
  };

  const validEvents = ['change'];

  const genRandClass = () => {
    return `datepicker-${Math.trunc(Math.random()*1000000).toString()}`;
  }

  window.DatePicker = class DatePicker {
    constructor(opts) {
      opts = Object.assign(datePickerDefaultOpts, opts);
      this.disableDayFn = opts.disableDayFn;
      this.monthNames = opts.monthNames;
      this.dayNames = opts.dayNames;
      this.selector = opts.selector;
      this.inputFormatter = opts.inputFormatter;
      this.uniqueClass = genRandClass();
      this.subscribers = {
        change: []
      };
      this.input = document.querySelector(this.selector);
      this.date = null;
      const defaultDate = opts.defaultDate();
      if (defaultDate && !this.disableDayFn(defaultDate)) {
        this.date = defaultDate;
      }

      this.isOpen = false;
      this.element = null;
      this.body = document.querySelector('body');
      this.handleInputClick();
      this.handleBodyClick();
    }

    handleInputClick() {
      this.input.addEventListener('click', (event) => {
        event.stopPropagation();
        this.open();
      });
    }

    handleBodyClick() {
      this.body.addEventListener('click', (event) => {
        if (this.isOpen && this.element && !this.element.contains(event.target)) {
          this.close();
        }
      });
    }

    set date(date) {
      if (date && this.disableDayFn(date)) {
        throw 'invalid Date';
      }
      const prevDate = this._date;
      this._date = date ? new SuperDate(date) : date;
      this.updateInput(this.date);
      this.emit('change', {
        date: this.date,
        prevDate: prevDate
      });
    }

    get date() {
      return this._date;
    }

    updateInput(date) {
      if (date) {
        this.input.value = this.inputFormatter(date)
      }
    }

    open() {
      if (this.isOpen) return;
      let refDate = this.date || new SuperDate();

      this.element = document.createElement('datepicker');
      this.element.classList.add(this.uniqueClass);
      this.element.innerHTML = this.template(refDate, this.date || new SuperDate(), this.uniqueClass);

      this.element.addEventListener('click', this.clickHandler(refDate));

      this.body.appendChild(this.element);
      this.isOpen = true;
    }

    clickHandler(refDate) {
      const self = this;
      return (event) => {
        const el = event.srcElement;
        if (Array.from(el.classList).includes('day') && el.getAttribute('disabled') === null) {
          event.stopPropagation();
          self.date = new SuperDate(el.getAttribute('data-date'));
          self.close();
        }

        if (Array.from(el.classList).includes('prev-month')) {
          event.stopPropagation();
          self.element.innerHTML = self.template(refDate = refDate.subMonth(), self.date || new SuperDate(), self.uniqueClass);
        }

        if (Array.from(el.classList).includes('next-month')) {
          event.stopPropagation();
          self.element.innerHTML = self.template(refDate = refDate.addMonth(), self.date || new SuperDate(), self.uniqueClass);
        }
      };
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.element.remove();
      this.element = null;
    }

    emit(eventName, event) {
      if (validEvents.includes(eventName)) {
        this.subscribers[eventName].forEach((callback) => {
          callback(event);
        });
      }
    }

    on(eventName, callback) {
      if (validEvents.includes(eventName)) {
        this.subscribers[eventName].push(callback);
      }
    }

    template(date, selectedDate, uniqueClass) {
      const header = this._headerTemplate(date);
      const body = this._bodyTemplate(date, selectedDate);
      const style = this._styleTemplate(uniqueClass);

      return `
        <div class="picker">
          <div class="header">
            <button class="prev-month"> < </button>
              ${header}
            <button class="next-month"> > </button>
          </div>
          <div class="body">
            ${body}
          </div>
          <style>
            ${style}
          </style>
        </div>`;
    }

    _headerTemplate(date) {
      return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

    _bodyTemplate(date, selectedDate) {
      const beginningOfMonth = date.beginningOfMonth();
      let currDate = new SuperDate(beginningOfMonth);
      let rows = [];

      while (currDate.getMonth() === beginningOfMonth.getMonth()) {
        let row = Array(currDate.getDay()).fill(null);
        do {
          row = row.concat(currDate)
        } while ((currDate = currDate.addDay()).getDay() !== 0 && currDate.getMonth() === beginningOfMonth.getMonth());

        if (currDate.getDay() !== 0) {
          row = row.concat(Array(7 - currDate.getDay()).fill(null));
        }
        rows = rows.concat([row]);
      }

      return this._dayNamesTemplate() + rows.map((row) => this._rowTemplate(row, selectedDate)).join('\n');
    }

    _dayNamesTemplate() {
      const cols = this.dayNames
        .map((d) => d[0].toUpperCase())
        .map((x) => `<div class="day-name">${x}</div>`)
        .join('\n');

      return `
        <div class="day-names-row">
          ${cols}
        </div>\n`;
    }

    _rowTemplate(dates, selectedDate) {
      const cols = dates
        .map((x) => x ? {
          date: x,
          disabled: this.disableDayFn(x),
          selected: x.equalsDate(selectedDate)
        } : {
          date: null,
          disabled: true
        })
        .map((x) => Object.assign(x, x.date ? {
          text: x.date.getDate()
        } : {
          text: '&nbsp;'
        }))
        .map((x) => Object.assign(x, x.date ? {
          classes: [x.disabled ? 'disabled' : '', x.selected ? 'selected' : ''].join(' ')
        } : {
          classes: 'disabled'
        }))
        .map((x) => {
          if (!x.disabled) {
            return `<span data-date="${x.date.toString()}" class="day ${x.classes}">${x.text}</span>`;
          }

          return `<span disabled class="day ${x.classes}">${x.text}</span>`;
        })
        .join('\n');
      return `
        <div class="days-row">
          ${cols}
        </div>\n`;
    }

    _styleTemplate(uniqueClass) {
      const inputPosition = this.input.getBoundingClientRect();
      const top = `${inputPosition.bottom}px`;
      const left = `${inputPosition.left}px`;

      return `
        .${uniqueClass} {
          top: ${top};
          left: ${left};
        }
        @media only screen and (max-width: 480px)  {
          .${uniqueClass} {
            left: 0;
            width: 100%;
          }
        }
      `;
    }
  }
}
