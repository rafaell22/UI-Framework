import validation from 'https://cdn.jsdelivr.net/gh/rafaell22/type-validation@0.2.2/validation.js';
const NOOP = function () {};
/*
  LIFE CYCLE:
    1. Define props
    2. Define data
    3. Run Setup
    4. Define methods
    5. Define watchers
    6. Import css
    7. Import HTML
    8. Mount HTML
    9. Run mounted()
 */


export default class CustomElement extends HTMLElement {
    constructor(componentName, componentClass) {
        super();
        this.componentName = componentName;
        this.componentClass = componentClass;
        this.attachShadow({mode: 'open'});
        
        // Validate and assign "props" (properties received through HTML attributes)
        try {
          validation(this.props).undefined();
        } catch (e) {
          try {
            validation(this.props()).object();
            const props = this.props();
            for (const propName in props) {
              // console.log('sides: ', this.getAttribute('sides'));
              //console.log('gerAttr: ', this.hasAttribute('sides'));
              // console.log('gerAttrs: ', this.getAttributeNames());
              if (props[propName].required) {
                const hasAttr = this.hasAttribute(propName);
                if (!hasAttr) {
                  throw new Error(`Element ${componentName} is missing required 'prop' ${propName}`);
                }
              }
              
              Object.defineProperty(this, propName, {
                enumerable: true,
                get: (function(propName) {
                  this.getAttribute(propName);
                }).bind(this, propName),
                set: (function(propName, required, newValue) {
                  if (required) {
                    try {
                      validation(newValue).defined().notNull();
                      this.setAttribute(newValue);
                    } catch (errorValidatingNewValue) {
                      throw new Error(`Error validating ${propName} in ${this.componentName}. Value is required (received ${newValue})`);
                    }
                  }
                }).bind(this, propName, props[propName].required, )
              });
            }
          } catch (errorValidatingProps) {
            throw new Error(`Error validating 'props'. ${errorValidatingProps.message}`);
          }
        }
        
        try {
          validation(this.setup).undefined();
          this.setup = NOOP;
        } catch (e) {
          try {
            validation(this.setup).function();
          } catch (errorValidatingSetup) {
            throw new Error(`Error validating 'setup'. ${errorValidatingSetup.message}`);
          }
        }
        
        this.setup();
    }
    
    async connectedCallback() {
        console.log('connected!');
        const styleResponse = await fetch(`./components/${this.componentClass}/main.css`);
        if(styleResponse.ok) {
            const styleContent = await styleResponse.text();
            const style = document.createElement('style');
            style.textContent += styleContent;
            this.shadowRoot.append(style);
        }
        
        this.shadowRoot.innerHTML += `
            <link rel="stylesheet" href="./main.css" />
        `;
        
        const htmlResponse = await fetch(`./components/${this.componentClass}/index.html`);
        if(htmlResponse.ok) {
            const htmlContent = await htmlResponse.text();
            this.shadowRoot.innerHTML += htmlContent;
        }
    }
}