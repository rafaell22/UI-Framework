import CustomElement from '../CustomElement.js';

export default class Col extends CustomElement {
    constructor() {
        super('u-col', 'Col');
    }
  
    props() {
        return {
            colspan: {
                type: 'number.integer',
                default: 1,
                required: true,
            },
            colLenght: {
                type: 'number.integer',
                default: 12,
                required: false,
            }
        }
    }
}