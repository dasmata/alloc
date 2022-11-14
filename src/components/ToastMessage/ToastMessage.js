import { css, html, LitElement } from 'lit';
import { map } from 'lit/directives/map.js';
import { until } from 'lit/directives/until.js';

class ToastContainer extends LitElement {

  static get styles() {
    return css`
      :host {
        width: 300px;
        position: absolute;
        top: 10px;
        right: 10px;
      }

      .toast-message {
        background-color: var(--color-background-primary);
        padding: var(--size-padding-medium);
        border: 1px solid black;
        margin-bottom: var(--size-padding-large);
      }
    `
  }

  static get properties() {
    return {
      toasts: {type: Map, attribute: false}
    }
  }

  constructor() {
    super();
    this.toasts = new Map();
  }

  addToast(toast, id){
    this.toasts.set(id, toast);
    this.requestUpdate()
  }

  removeToast(id){
    this.toasts.delete(id);
    this.requestUpdate()
  }

  render() {
    return html`<div class='toast-container'><slot name='content'>${map(this.toasts, el => el[1])}</slot></div>`
  }
}

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
    this.autoClose ??= 5000;
    this.id = Symbol('toast-message')
  }

  connectedCallback() {
    super.connectedCallback();
    ToastMessage.createContainer();
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    this.visible && setTimeout(() => {
      this.visible = false;
      this.requestUpdate()
    }, 5000)
  }

  render() {
    if (this.visible) {
      ToastMessage.container.addToast(html`<div class='toast-message'>${this.message}</div>`, this.id)
    } else {
      ToastMessage.container.removeToast(this.id)

    }
  }

}

customElements.define('toast-message', ToastMessage);
customElements.define('toast-container', ToastContainer);
