import { App } from '../App.js';

window.app = new App();

app.createStore(
  'form',
  {
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
  }
);

app.createComponent(
    'FormField',
    {
        template: `
            <div class="form-field">
              <p class="title" 
                data-bind="{
                  'innerText': 'title'
                }"
              ></p>
              <input type="text"
                data-bind="{
                  '@input': 'eventUpdateInput'
                }"
              >
              <p class="title"> 
                You inserted: 
                <span 
                  data-bind="{
                    'textContent': 'input'
                  }"
                >
                </span>
              </p>
              <input type="button" value="SUBMIT"
                data-bind="{
                  '@click': 'eventAddInput'
                }"
              >
              <input type="button" value="CLEAR VALUES"
                data-bind="{
                  '@click': 'eventClearInputs'
                }"
              >
              <p>Store - Inputs: </p>
              <ul id='inputs-list'>
              </ul>
            </div>
        `,
        styles: `
          .form-field .title {
            text-transform: uppercase;
          }
        `,
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
);

app.start();