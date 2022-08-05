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

class Input extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({mode: 'open'});
    const style = document.createElement('style');
    style.textContent = `
      .form-field .title {
        text-transform: uppercase;
      }
    `;
    this.shadowRoot.append(style);
    this.shadowRoot.innerHTML(`
      <div class="form-field">
        <p class="title"></p>
      </div>
    `);
    
    // Insert icon
    // let imgUrl;
    // if(this.hasAttribute('img')) {
    //   imgUrl = this.getAttribute('img');
    // } else {
    //   imgUrl = 'img/default.png';
    // }
    // 
    // const img = document.createElement('img');
    // img.src = imgUrl;
    // icon.appendChild(img);
    
    
  }
}

customElements.define('u-input', Input);