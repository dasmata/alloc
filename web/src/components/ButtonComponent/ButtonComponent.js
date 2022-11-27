import {css, html, LitElement} from 'lit';

class ButtonComponent extends LitElement {

  static get styles(){
    return css`
      button {
        width: var(--component-button-width-default);
        height: var(--component-button-height-default);
        padding: var(--component-button-padding-default);
        background-color: var(--component-button-primary-background-normal);
        box-shadow: var(--component-button-primary-shadow-normal);
        border-radius: var(--component-button-primary-border-radius);
        border-width: var(--size-none);
        color: var(--color-base-white-100);
        font-family: var(--font-family-roboto);
        font-weight: var(--font-weight-medium);
      }
      button:hover {
        background-color: var(--component-button-primary-background-hover);
        box-shadow: var(--component-button-primary-shadow-hover);
      }
      button:disabled {
        background-color: var(--component-button-primary-background-inactive);
        box-shadow: none;
      }
    `
  }

  static get properties() {
    return {
      disabled: {type: Boolean, attribute: true},
      loading: {type: Boolean, attribute: true}
    }
  }

  render() {
    return html`<button ?disabled=${this.disabled}>
      <slot name='prefix-icon'></slot>
      <slot name='label'></slot>
      <slot name='sufix-icon'></slot>
    </button>`
  }
}

customElements.define('button-component', ButtonComponent);
