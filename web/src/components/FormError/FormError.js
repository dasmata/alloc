import { css, html, LitElement } from 'lit';

class FormError extends LitElement {

  static get styles() {
    return css`
      :host {
        color: var(--component-form-error-color);
        padding: var(--component-form-error-padding);
        height: 1em;
        display:block;
      }
    `
  }

  static get properties(){
    return {
      "message": { type: 'string', attribute: true }
    }
  }

  render() {
    return html`<div>${this.message}</div>`
  }
}

customElements.define('form-error', FormError);
