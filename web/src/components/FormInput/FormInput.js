import { css, html, LitElement } from 'lit';
import '../FormError/FormError'
import '../SpinnerLoader/SpinnerLoader'
import FormInputController from './FormInputController';

class FormInput extends LitElement {
  static get styles() {
    return css`
      input {
        padding: var(--component-form-input-padding);
        font-size: var(--component-form-input-font-size);
        text-align: var(--component-form-input-text-align);
        color: var(--component-form-input-color);
        background: var(--component-form-input-background-color);
      }
      input:focus {
        outline: var(--component-form-input-focus-outline);
        outline-offset: var(--component-form-input-focus-outline-offset);
      }
    `
  }
  static get properties() {
    return {
      'errorMessages': { type: Object, attribute: true },
      'name': { type: String, attribute: true },
      'type': { type: String, attribute: true },
      'placeholder': { type: String, attribute: true },
      'value': { type: String, attribute: true },
      'loading': { type: String, attribute: true },
      'validation': { type: Object, attribute: true },
      'valid': { type: Boolean, attribute: false },
      'required': { type: Boolean, attribute: true }
    }
  }

  constructor() {
    super();
    this.controller = new FormInputController(this)
    this.value = '';
  }

  render() {
    return html`
      <label>
        <div>
          <slot name='label'></slot>
        </div>
        <input
          name='${this.name}'
          class='form-input'
          type='${this.type}'
          value='${this.value}'
          placeholder='${this.placeholder}'
        />
        <div id='loader' aria-live='polite'>
          ${this.controller.isLoading()}
        </div>
        <div id='error-container' aria-live='polite'>
          ${this.controller.errors()}
        </div>
      </label>
    `
  }
}

customElements.define('form-input', FormInput)
