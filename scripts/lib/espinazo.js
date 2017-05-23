{
  const REF_REGEX = new RegExp("^ez\:ref\:(.+)$");

  class Component {
    constructor(opts) {
      this.tag = opts.tag;
      this.render = opts.render;
      this.defaultState = opts.defaultState || {};
    }

    fillNode(node, state) {
      node.innerHTML = this.render(state);
      Array.from(node.children).forEach((c) => {
        if(c.tagName in Espinazo.components) {
          const props = Array.from(c.attributes)
            .reduce((memo, x) => {
              let attrName = x.name;
              let value = x.value;
              const match = REF_REGEX.exec(x.name);
              if(match) {
                attrName = match[1];
                value = eval(`this.${x.value}`);
                node.setAttribute(attrName, value);
              }

              return Object.assign(memo,{
                [attrName]: value
              });
            }, {});
          const nodeState = Object.assign(Espinazo.components[c.tagName].defaultState, props);
          Espinazo.components[c.tagName].fillNode(c, nodeState);
        }
      });
    }
  }

  class Container extends Component {
    constructor(opts) {
      super(opts);
      this.selector = opts.selector;
      this.container = document.querySelector(this.selector);
      this.state = opts.state;
    }

    init() {
      this.update();
    }

    update() {
      const node = this.recreateNode();
      this.container.innerHTML = node.innerHTML;
    }

    recreateNode() {
      const node = document.createElement('espinazo');
      this.fillNode(node, this.state);
      return node;
    }

    setState(newState) {
      this.state = newState;
      this.update();
    }
  };

  window.Espinazo = {
    components: {},
    escape(x) {
      return x.replace(/\"/g,'&quot;');
    },
    createContainer(opts) {
      return new Container(opts);
    },

    registerComponent(opts) {
      Espinazo.components[opts.tag.toUpperCase()] = new Component(opts);
    },

    extractState(node) {
      if('ez:state' in node.attributes) {
        return node.attributes['ez:state'].value;
      }
      return null;
    }

  };
}
Espinazo.registerComponent({
  tag: 'box',
  render: (state) => {
    return `
      <div style="background-color: ${state.the_color};">
        XXXXX
      </div>
    `;
  }
});

Espinazo.registerComponent({
  tag: 'subtitle',
  defaultState: {
    boxColor: 'red',
  },
  render: (state) => {
    return `
      <h2>¡${state.title}!</h2>
      <p>${state.blah()}</p>
      <box the_color="${state.boxColor}"></box>
    `;
  }
});

const mainContainer = Espinazo.createContainer({
  selector: '#espinazo',
  state: {
    subtitle: 'Prueba de subtitulo',
    counter: 1,
    fn: () => {
      return "Hell yeah"
    },
  },
  render(state) {
    return `
      <h1 onclick="mutator.handleClick(1)">Hola Mundo</h1>
      <subtitle ez:ref:blah="state.fn" title="${state.subtitle} - ${state.counter}"></subtitle>
    `;
  },
  handleTitleClick(event) {
    console.log('funciona madafaca');
  }
});

const mutator = {
  handleClick(e) {
    mainContainer.setState(Object.assign(mainContainer.state, {
      counter: mainContainer.state.counter + 1,
    }));
  },
};

mainContainer.init();
