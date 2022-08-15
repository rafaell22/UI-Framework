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

(async function() {
  await app.createComponent('u-col', 'Col');
  await app.createComponent('u-row', 'Row');
  await app.createComponent('u-dice-bag', 'DiceBag');
})()
