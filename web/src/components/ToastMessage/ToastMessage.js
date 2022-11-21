import {html, LitElement } from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import './ToastContainer';


class ToastMessage extends LitElement{

  static createContainer() {
    if (ToastMessage.container) {
      return;
    }
    ToastMessage.container = document.createElement('toast-container');
    document.body.appendChild(ToastMessage.container);
  }

  static get properties() {
    return {
      message: {type: String, attribute: true},
      type: {type: String, attribute: true},
      autoClose: {type: Number, attribute: true},
      visible: {type: Boolean, attribute: true},
      id: {type: Symbol, attribute: false}
    }
  }

  constructor(){
    super();
    this.autoClose = 5000;
    this.type = 'info';
    this.id = Symbol('toast-message')
  }

  connectedCallback() {
    super.connectedCallback();
    ToastMessage.createContainer();
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    this.visible && this.autoClose && setTimeout(() => {
      this.visible = false;
      this.requestUpdate()
    }, this.autoClose)
  }

  render() {
    if (this.visible) {
      const classes = {
        error: this.type === 'error',
        warning: this.type === 'warning',
        info: this.type === 'info',
        success: this.type === 'success',
        "toast-message": true
      }
      ToastMessage.container.addToast(html`<div class=${classMap(classes)}>${this.message}</div>`, this.id)
    } else {
      ToastMessage.container.removeToast(this.id)

    }
  }

}

customElements.define('toast-message', ToastMessage);
