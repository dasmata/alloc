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
      'required': { type: Boolean, attribute: true },
      'formController': { type: Object, attribute: true }
    }
  }

  constructor() {
    super();
    this._controller = new FormInputController(this)
    this.value = '';
  }

  render() {
    return html`
      <label>
        <div>
          <slot name='label'></slot>
        </div>
        <input
          class='form-input${this._error ? ' error' : ''}'
          type='${this.type}'
          value='${this.value}'
          placeholder='${this.placeholder}'
        />
        ${this._controller.isLoading()}
        ${this._controller.errors()}
      </label>
    `
  }
}

customElements.define('form-input', FormInput)
