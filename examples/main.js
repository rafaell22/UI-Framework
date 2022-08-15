import { App } from '../App.js';

import storeForm from './stores/storeForm.js';

window.app = new App();


// app.createStore(
//   'form',
//   storeForm
// );
// 
// app.createComponent(
//     'Input',
//     {
//         template: ``,
//         styles: ``,
//     }
// );
// 
// app.start();

/*
class Row extends CustomElement {
  constructor() {
    super('Row');
  }
}

class DiceBag extends CustomElement {
  constructor() {
    super('DiceBag');
  }
}

class Dice extends CustomElement {
  constructor() {
    super(Dice);
    
    // console.log('sides: ', this.getAttribute('sides'));
    //console.log('gerAttr: ', this.hasAttribute('sides'));
    // console.log('gerAttrs: ', this.getAttributeNames());

    //if(this.hasAttribute('sides')) {
    //    this.shadowRoot.querySelector('.dice-sides-number').innerText = this.getAttribute('sides');
	// }
  }
}

// customElements.define('u-col', Col);
customElements.define('u-row', Row);

customElements.define('u-dice', Dice);
 
customElements.define('u-dice-bag', DiceBag);

*/

app.createComponent('Col');