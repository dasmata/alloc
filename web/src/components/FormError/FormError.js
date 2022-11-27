import { css, html, LitElement } from 'lit';

class FormError extends LitElement {

  static get styles() {
    return css`
      :host {
        color: var(--component-form-input-color-error);
        font-size: var(--font-size-body100);
        line-height: var(--font-size-body100);
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
