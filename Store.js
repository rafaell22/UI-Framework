// TODO - pass ne value to pubsub

/**
 * Create a data store similar to how Vuex store works. Store data and share it between components, use actions to trigger mutations and edit the data.
 * @param       {App}     app           Application instance (the Store will be loaded in App instance)
 * @param       {string}  name          Reference name of the store. Needs to be unique
 * @param       {object}  state         Data attributes and values
 * @param       {object}  mutations     Functions used to modify the data
 * @param       {object}  actions       Functions used to trigger mutations
 * @param       {object}  getters       Functions used to retrieve data from store
 * @param       {object}  methods       Aditional methods that can be used by the actions
 * @constructor
 */
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

export default Store;