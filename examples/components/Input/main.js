export default {
  props: ['title'],
  data: {
      input: '',
      inputsList: null,
  },
  methods: {
      eventUpdateInput: function(e) {
          this.input = e.target.value;
      },
      eventAddInput: function(e) {
          this.app.$stores.form.actions.addInput(this.input);
      },
      eventClearInputs: function(e) {
        this.app.$stores.form.actions.clearInputs();
      }
  },
  mounted: function() {
    this.inputsList = this.rootElement.querySelector('#inputs-list');
    
    this.app.$pubSub.subscribe('store.form.addInput', (function() {
      const inputs = this.app.$stores.form.getters.inputs();
      const listItem = document.createElement('LI');
      listItem.innerText = inputs[inputs.length - 1];
      this.inputsList.appendChild(listItem);
    }).bind(this));
  }
}