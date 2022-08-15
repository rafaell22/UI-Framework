export default class CustomElement extends HTMLElement {
    constructor(componentName) {
        super();
        this.componentName = componentName;
        this.attachShadow({mode: 'open'});
    }
    
    async connectedCallback() {
        console.log('connected!');
        const styleResponse = await fetch(`./components/${this.componentName}/main.css`);
        if(styleResponse.ok) {
            const styleContent = await styleResponse.text();
            const style = document.createElement('style');
            style.textContent += styleContent;
            this.shadowRoot.append(style);
        }
        
        this.shadowRoot.innerHTML += `
            <link rel="stylesheet" href="./main.css" />
        `;
        
        const htmlResponse = await fetch(`./components/${this.componentName}/index.html`);
        if(htmlResponse.ok) {
            const htmlContent = await htmlResponse.text();
            this.shadowRoot.innerHTML += htmlContent;
        }
    }
}