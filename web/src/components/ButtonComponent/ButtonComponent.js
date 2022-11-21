import { html, LitElement } from 'lit';

class ButtonComponent extends LitElement {

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
