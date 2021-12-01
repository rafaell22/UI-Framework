/*
new Component('ComponentName', {
  template,
  styles,
  props,
  data,
  methods,
  watchers,
  setup,
  mounted,
});
*/

/**
 * Class for the App. The app represents the main component of the application.
 * It hold references to :
 *   - Component classes
 *   - Component instances
 *   - libraries
 *   - data stores
 *   - global pubsub
 * @constructor
 * @param {function} boot Function to run during app creation. Use it to create libraries, stores and other variables that should be available to all components
**/
function App(boot) {
  this.$version = '0.0.29';
  this._componentTypes = {};
  this._components = [];
  this.$libraries = {};
  this.$stores = {};
  this.$pubSub = new PubSub();
  
  if(!(boot instanceof Function)) throw new Error(`Expected "boot" of type Function, but found ${boot.cobstructor.name}`);

  boot();
}

/*
  Create components for the application. A component can have the following properties:
- methods: functionsasigned to the component's prototype. They are available both during setup and after mounted.
    > attribute: method name
    > value: function
- watchers: subscribe to events in the pubsub obj. 
    > attribute: event to subscribe in the pubsub
    > value: function that will be called when the event is published
*/
App.prototype.createComponent = function(
name, 
{
  template,
  styles,
  props,
  setup,
  mounted,
  data,
  methods,
  watchers,
}) {
  const appInstance = this;
  const Component = function(rootElement, propValues) {
    this.app = appInstance;
    
    if(props) {
        for(const prop of props) {
            this[prop] = propValues[prop];
        }
    }
    
    if(data) {
        for(let dataField in data) {
            this[dataField] = data[dataField];
        }
    }
    
    this.setup();

    const cssId = 'css-' + name;  

    // add the element's styles to the header
    // we check if the style was already added by another instance of the same component
    if (!document.getElementById(cssId)) {
        const head  = document.getElementsByTagName('head')[0];
        const elStyle  = document.createElement('style');
        elStyle.id   = cssId;
        elStyle.innerHTML = styles;
        head.appendChild(elStyle);
    }

    this.rootElement = rootElement;
    console.log('innerHTML: ', this.rootElement.innerHTML);
    this.rootElement.innerHTML += this.template;
    const boundElements = rootElement.querySelectorAll('[data-bind]');
    const boundAttrCallbacks = {};
    boundElements.forEach(element => {
      const boundAttributes = JSON.parse(element.dataset.bind.replace(/'/g, '"'));
      for(const attr in boundAttributes) {
        const attrValue = this[boundAttributes[attr]];
        this['_'  + boundAttributes[attr]] = attrValue;
        
        switch(true) {
            case /^class\./.test(attr):
                // in this case, a specific class in the element is bound to a boolean value
                // if a single class is bound, the attr follows the pattern "class.className"
                const boundClass = attr.split('.')[1];
                if( boundAttrCallbacks[boundAttributes[attr]] 
                ) {
                   boundAttrCallbacks[
                       boundAttributes[attr]
                    ].push(
                        (function(element, boundClass, attr, value) {
                        if(value) {
                            element.classList.add(boundClass);
                        } else {
                            element.classList.remove(boundClass);
                        }
                        this['_'  + attr] = value;
                    }).bind(this, element, boundClass, boundAttributes[attr])
                     );
               } else {
                   boundAttrCallbacks[
                       boundAttributes[attr]
                    ] = [
                        (function(element, boundClass, attr, value) {
                        if(value) {
                            element.classList.add(boundClass);
                        } else {
                            element.classList.remove(boundClass);
                        }
                        this['_'  + attr] = value;
                    }).bind(this, element, boundClass, boundAttributes[attr])
                    ]; 
                }
                 break;
             case /^class/.test(attr):
                 // in this case, the elements class is bound to the variable value
                 if( boundAttrCallbacks[boundAttributes[attr]] 
                ) {
                   boundAttrCallbacks[
                       boundAttributes[attr]
                    ].push(
                        (function(attr, value) {
                        element.class = value;
                        this['_'  + attr] = value;
                    }).bind(this, boundAttributes[attr])
                     );
               } else {
                   boundAttrCallbacks[
                       boundAttributes[attr]
                    ] = [
                        (function(attr, value) {
                            element.class = value;
                            this['_'  + attr] = value;
                        }).bind(this, boundAttributes[attr])
                    ]; 
                }
                 break;
             case /^style\./.test(attr):
                // in this case, a specific style in the element is bound to a variable value
                // The attr follows the pattern "style.styleName"
                const boundStyle = attr.split('.')[1];
                if( boundAttrCallbacks[boundAttributes[attr]] 
                ) {
                   boundAttrCallbacks[
                       boundAttributes[attr]
                    ].push(
                        (function(element, boundStyle, attr, value) {
                        element.style[boundStyle] = value;
                        this['_'  + attr] = value;
                    }).bind(this, element, boundStyle, boundAttributes[attr])
                     );
               } else {
                   boundAttrCallbacks[
                       boundAttributes[attr]
                    ] = [
                        (function(element, boundStyle, attr, value) {
                        element.style[boundStyle] = value;
                        this['_'  + attr] = value;
                    }).bind(this, element, boundStyle, boundAttributes[attr])
                    ]; 
                }
                 break;
             case /^@/.test(attr):
                 // in this case, one of the element's listeners is bound
                 const eventType = attr.slice(1);
                 element.addEventListener(eventType, this[boundAttributes[attr]].bind(this));
                 break;
             default:
                 // in this case, the element attribute is directly bound to the variable value
                if( boundAttrCallbacks[boundAttributes[attr]] 
                ) {
                   boundAttrCallbacks[
                       boundAttributes[attr]
                    ].push(
                        (function(element, variableName, elAttr, value) {
                            element[elAttr] = value;
                            this['_'  + variableName] = value;
                        }).bind(this, element, boundAttributes[attr], attr)
                     );
               } else {
                   boundAttrCallbacks[
                       boundAttributes[attr]
                    ] = [
                        (function(element, variableName, elAttr, value) {
                            element[elAttr] = value;
                            this['_'  + variableName] = value;
                        }).bind(this, element, boundAttributes[attr], attr)
                    ]; 
                }
                 break;
          }
        }
    });
    
    for( let attr in boundAttrCallbacks) {
        Object.defineProperty(this, attr, {
                    enumerable: true,
                    get: (function(variableName) {
                        return this['_'  + variableName];
                    }).bind(this, attr),
                    set: function(value) {
                        boundAttrCallbacks[attr].forEach(callback=> callback(value));
                    },
        });
        
        this[attr] = this['_'  + attr];
    }
    
    this.mounted();
  }
  
  Component.prototype.template = template;
  Component.prototype.styles = styles;
  Component.prototype.setup = setup || this.NOOP;
  
  // assign each method function to the component's prototype
  for(let method in methods) {
      if(!(methods[method] instanceof Function)) throw new Error(`Expected method of type Function, but ${method} is of type ${methods[method].constructor.name}.`);
    Component.prototype[method] = methods[method];
  }
  
  // subscribe to events from the app pubsub
  // The event is the name of the watcher attribute
  for(let watcher in watchers) {
      if(!(watchers[watcher] instanceof Function)) throw new Error(`Expected watcher of type Function, but ${watcher} is of type ${watchers[watcher].constructor.name}.`);
      
      this.$pubSub.subscribe(watcher, watchers[watcher]);
  }
  
  // if no mountedtmethod was passed, assign an empty function
  Component.prototype.mounted = mounted || this.NOOP;
  
  this._componentTypes[name] = Component;
}

App.prototype.NOOP = function () {};

/**
 * Search for components and build them. The function runs recursively, so it also builds components specified inside the components' template.
  * @param {HTMLComponent} rootElement The source element where to search for HTML elements bound to components
**/
App.prototype.buildComponents = function(rootElement) {
    const components = rootElement.querySelectorAll('[data-component]');
    if(components.length === 0) return;
    console.log('components: ', components);
    components.forEach(component => {
      const props = {};
      for(const prop in component.dataset) {
      	if(prop !== 'component') {
        	props[prop] = component.dataset[prop];
        }
      }
      this._components.push(new this._componentTypes[component.dataset.component](component, props));
      // check if there is any component inside this component
      this.buildComponents(this._components[this._components.length - 1].rootElement);
      component.removeAttribute('data-component');
  });
}
    
App.prototype.start = function() {
    this.buildComponents(document);
}

App.prototype.createStore = function(name, options) {
  this.$stores[name] = new Store(this, name, options);
}