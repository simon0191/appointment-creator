{
  class EzTimePicker extends Espinazo.Component {
    static defaultTimes() {
      return Array.from(new Array(60*24/15), (_, i) => i*15);
    }

    constructor() {
      super({
        tag: 'ez-timepicker',
        minTime: 0,
        defaultState: {
          timeFormatter: (n) => n,
          availableTimes: EzTimePicker.defaultTimes()
        },
      });
    }

    render(state) {
      return `
        <select class="timepicker form-control" onchange="actions.setTime(this.value)">
          ${state.availableTimes.filter((x) => x >= state.minTime).map((x) => this.renderOption(state, x)).join('\n')}
        </select>
      `;
    }

    renderOption(state, n) {
      const selected = `${state.time}` === `${n}` ? 'selected' : '';
      return `
        <option ${selected} value="${n}">${state.timeFormatter(n)}</option>
      `;
    }
  }

  Espinazo.components['ez-timepicker'.toUpperCase()] = new EzTimePicker();
}
