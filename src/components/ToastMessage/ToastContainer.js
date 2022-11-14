import { css, html, LitElement } from 'lit';
import { map } from 'lit/directives/map.js';

class ToastContainer extends LitElement {

  static get styles() {
    return css`
      :host {
        width: var(--component-toast-container-width);
        position: absolute;
        top: var(--size-padding-medium);
        right: var(--size-padding-medium);
      }

      .toast-message {
        background-color: var(--color-background-primary);
        padding: var(--size-padding-medium);
        border: var(--size-border-primary-width) solid var(--color-border-black);
        margin-bottom: var(--size-padding-large);
      }
      .toast-message.error {
        border-color: var(--color-border-error);
        background-color: var(--color-background-error);
      }
      .toast-message.success {
        border-color: var(--color-border-success);
        background-color: var(--color-background-success);
      }
      .toast-message.warning {
        border-color: var(--color-border-warning);
        background-color: var(--color-background-warning);
      }
      .toast-message.info {
        border-color: var(--color-border-info);
        background-color: var(--color-background-primary);
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

customElements.define('toast-container', ToastContainer);
