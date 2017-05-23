{
  class EzTimePicker extends Espinazo.Component {
    static defaultTimes() {
      return Array.from(new Array(60*24/15), (_, i) => i*15);
    }

    constructor() {
      super({
        tag: 'ez-timepicker',
        defaultState: {
          optionFormatter: (n) => {
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
        <option ${selected} value="${n}">${state.optionFormatter(n)}</option>
      `;
    }
  }

  Espinazo.components['ez-timepicker'.toUpperCase()] = new EzTimePicker();
}
