/*
new Store({
  state: {
    inventory: ,
  },
  mutations: {
    setCollectedState,
  },
  actions: {
    collectItem,
    uncollectItem,
  },
  getters: {
    inventory,
    itemById,
  },
})
*/

// TODO - pass ne value to pubsub

function Store(app, name, {
  state,
  mutations,
  actions,
  getters,
  methods,
}) {
    this.appInstance = app;
    this.name = name;
    
    const _state = {};
    this.state = {};
    if(state) {
        for(attr in state) {
            _state[attr] = state[attr];
            Object.defineProperty(this.state, attr, {
                get: (function(state) { return  state }).bind(this, _state[attr]),
                set: this.appInstance.NOOP,
            });
        }
    }
    
    const _mutations = {};
    if(mutations) {
        for(mutation in mutations) {
            _mutations[mutation] = (function(mutationName, mutation, state, ...args) {
                mutation.call(this, { state }, ...args);
                this.appInstance.$pubSub.publish(`store.${this.name}.${mutationName}`);
            }).bind(this, mutation, mutations[mutation], _state);
        }
    }
    
    this.actions = {};
    if(actions) {
        for(action in actions) {
            this.actions[action] = actions[action].bind(this, { state: this.state, mutations: _mutations });
        }
    }
    
    this.getters = {};
    if(getters) {
        for(getter in getters) {
            Object.defineProperty(this.getters, getter, {
                get: (function(getter) {
                    return getter.call(this);
                }).bind(this, getters[getter])
            });
        }
    }
    
    this.methods = {};
    if(methods) {
        for(method in methods) {
            this.methods[getter] = getters[getter].bind(this);
        }
    }
}