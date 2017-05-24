{
  class EzTimePicker extends Espinazo.Component {
    static defaultTimes() {
      return Array.from(new Array(60*24/15), (_, i) => i*15);
    }

    constructor() {
      super({
        tag: 'ez-timepicker',
        defaultState: {
          timeFormatter: (n) => n,
          availableTimes: EzTimePicker.defaultTimes()
        },
      });
    }

    render(state) {
      return `
        <select class="timepicker" onchange="actions.setTime(this.value)">
          ${state.availableTimes.map((x) => this.renderOption(state, x)).join('\n')}
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
