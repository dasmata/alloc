import { html, LitElement } from 'lit';
import '@material/web/button/filled-button'

class ButtonComponent extends LitElement {

  static get properties() {
    return {
      disabled: { type: Boolean, attribute: true },
      loading: { type: Boolean, attribute: true },
      label: { type: String, attribute: true },
      trailingIcon: { type: Boolean, attribute: true }
    }
  }

  render() {
    return html`
      <md-filled-button
        ?trailingicon=${this.trailingIcon}
        ?disabled=${this.disabled}
        label="${this.label}">
        <slot name='icon' slot="icon"></slot>
      </md-filled-button>
    `
  }
}

customElements.define('button-component', ButtonComponent);
