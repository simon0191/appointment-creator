{
  class EzDatePicker extends Espinazo.Component {
    constructor() {
      super({
        tag: 'ez-datepicker',
        defaultState: {
          disableDayFn: () => false,
          defaultDate: () => new SuperDate(),
          monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          dayNames: ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          inputFormatter: (date) => date.toLocaleDateString(),
          uniqueClass: `datepicker-${Math.trunc(Math.random()*1000000).toString()}`,
        },
      });
    }

    render(state, node) {
      node.classList.add(state.uniqueClass);
      if(!state.date) {
        state.date = state.defaultDate();
      }

      return `
        <div class="picker">
          <div class="header">
            <button onclick="actions.prevMonth(event)" class="prev-month"> < </button>
              ${this.renderHeader(state)}
            <button onclick="actions.nextMonth(event)" class="next-month"> > </button>
          </div>
          <div class="body">
            ${this.renderBody(state)}
          </div>
          <style>
            ${this.renderStyle(state)}
          </style>
        </div>
      `;
    }

    renderHeader(state) {
      return `${state.monthNames[state.month]} ${state.year}`;
    }

    renderBody(state) {
      const beginningOfMonth = new SuperDate(state.year, state.month).beginningOfMonth();
      let currDate = new SuperDate(beginningOfMonth);
      let rows = [];

      while(currDate.getMonth() === beginningOfMonth.getMonth()) {
        let row = Array(currDate.getDay()).fill(null);
        do {
          row = row.concat(currDate)
        } while ((currDate = currDate.addDay()).getDay() !== 0 && currDate.getMonth() === beginningOfMonth.getMonth());

        if (currDate.getDay() !== 0) {
          row = row.concat(Array(7 - currDate.getDay()).fill(null));
        }
        rows = rows.concat([row]);
      }

      return this.renderDayNames(state) + rows.map((row) => this.renderWeek(row, state)).join('\n');
    }

    renderStyle(state) {
      return `
        .${state.uniqueClass} {
          top: ${state.top}px;
          left: ${state.left}px;
        }
        @media only screen and (max-width: 480px)  {
          .${state.uniqueClass} {
            left: 0;
            width: 100%;
          }
        }`;
    }

    renderDayNames(state) {
      const cols = state.dayNames
          .map((d) => d[0].toUpperCase())
          .map((x) => `<div class="day-name">${x}</div>`)
          .join('\n');

        return `
          <div class="day-names-row">
            ${cols}
          </div>\n`;
    }

    renderWeek(dates, state) {
      const selectedDate = state.date;
      const cols = dates
        .map((x) => x ? {
          date: x,
          disabled: state.disableDayFn(x),
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
            const param = Espinazo.escape(x.date.toString());
            return `
              <span onclick="actions.setDate('${param}')"
                    class="day ${x.classes}"
                    data-day="${x.date.getDate()}">
                ${x.text}
              </span>`;
          }

          return `<span disabled class="day ${x.classes}">${x.text}</span>`;
        })
        .join('\n');
      return `
        <div class="days-row">
          ${cols}
        </div>\n`;
    }
  }

  Espinazo.components['ez-datepicker'.toUpperCase()] = new EzDatePicker();
}
