import { css, html, LitElement } from 'lit';
import { map } from 'lit/directives/map.js';

class ToastContainer extends LitElement {

  static get styles() {
    return css`
      :host {
        width: var(--component-toast-container-width);
        position: absolute;
        top: var(--size-7x);
        right: var(--size-7x);
      }

      .toast-message {
        background-color: var(--component-toast-color-default);
        padding: var(--size-5x);
        margin-bottom: var(--size-4x);
        box-shadow: 0 var(--size-unit) var(--size-4x) var(--shadow-color-black-normal);
        border-radius: var(--component-toast-border-radius-default);
      }
      .toast-message.error {
        background-color: var(--component-toast-color-error);
      }
      .toast-message.success {
        background-color: var(--component-toast-color-success);
      }
      .toast-message.warning {
        background-color: var(--component-toast-color-warning);
      }
      .toast-message.info {
        background-color: var(--component-toast-color-default);
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
    return html`<div class='toast-container'>${map(this.toasts, el => el[1])}</div>`
  }
}

customElements.define('toast-container', ToastContainer);
