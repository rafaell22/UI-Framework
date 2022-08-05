export default {
  state: {
    inputs: []
  },
  mutations: {
    addInput: function({ state }, input) {
      state.inputs.push(input);
    },
    clearInputs: function({ state }) {
      state.inputs = [];
    }
  },
  actions: {
    addInput: function({ mutations }, input) {
      mutations.addInput(input);
    },
    clearInputs: function({ mutations }) {
      mutations.clearInputs();
    }
  },
  getters: {
    inputs: function({ state }) {
      return state.inputs;
    }
  }
};