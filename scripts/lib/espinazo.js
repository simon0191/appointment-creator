{
  const REF_REGEX = new RegExp("^ez\:ref\:(.+)$");
  const camelize = (str) => str.split(/[\W_]/).map((s,i) => i > 0 ? s[0].toUpperCase() + s.substr(1): s).join('');

  class Component {
    constructor(opts) {
      Object.keys(opts).forEach((k) => {
        this[k] = opts[k];
      });

      this.defaultState = opts.defaultState || {};
    }

    fillNode(node, state) {
      node.innerHTML = this.render(state, node);
      this.dfs(node, state);
    }

    dfs(node, state) {
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
                [camelize(attrName)]: value
              });
            }, {});
          const nodeState = Object.assign({}, Espinazo.components[c.tagName].defaultState, props);
          Espinazo.components[c.tagName].fillNode(c, nodeState);
        } else {
          this.dfs(c, state);
        }
      });
    }
  }

  class Container extends Component {
    constructor(opts) {
      super(opts);
      this.container = document.querySelector(this.selector);
    }

    init() {
      this.state = Object.assign({}, this.defaultState, this.state)
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
      if(this.debug) {
        console.log({old: this.state, new: newState});
      }
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
    },
    Component: Component,
    Container: Container,
  };
}
