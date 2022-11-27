import { css, html, LitElement } from 'lit';
import '../FormError/FormError'
import '../SpinnerLoader/SpinnerLoader'
import FormInputController from './FormInputController';
import {classMap} from "lit/directives/class-map.js";

class FormInput extends LitElement {
  static get styles() {
    return css`
      label {
        display: block;
        text-align: left;
        width: var(--component-form-input-width-default);
        margin: 0 auto;
        font-family: var(--font-family-roboto);
        font-weight: var(--font-weight-regular);
        font-size: var(--font-size-body100);
        line-height: var(--font-size-body100);
        color: var(--component-form-input-color-default);
      }

      label.focus {
        color: var(--component-form-input-border-color-focus);
      }

      label.disabled {
        color: var(--component-form-input-border-color-inactive);
      }

      label.error {
        color: var(--component-form-input-color-error);
      }

      input {
        width: var(--component-form-input-width-default);
        height: var(--component-form-input-height-default);
        box-sizing: border-box;
        border: var(--size-qtr-x) solid var(--component-form-input-border-color-default);
        border-radius: var(--component-form-input-border-radius-default);
        padding: var(--component-form-input-padding-default);
        background: var(--component-form-input-background-default);
        color: var(--component-form-input-color-default);
      }
      input:hover {
        border-color: var(--component-form-input-border-color-hover);
      }
      input:focus {
        border-color: var(--component-form-input-border-color-focus);
        outline: 0;
      }
      label.disabled input {
        border-color: var(--component-form-input-border-color-inactive);
      }

      label.error input {
        border-color: var(--component-form-input-border-color-error);
      }

      #error-container {
        height: var(--size-5x);
        text-align: left;
        width: var(--component-form-input-width-default);
        margin: var(--size-unit) auto;
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
      'disabled': { type: Boolean, attribute: true }
    }
  }

  constructor() {
    super();
    this.controller = new FormInputController(this)
    this.value = '';
  }

  render() {
    return html`
      <label class=${classMap({
        disabled: this.disabled
      })}>
        <div>
            <slot name='label'></slot>
        </div>
        <input
          ?disabled=${this.disabled}
          name='${this.name}'
          class='form-input'
          type='${this.type}'
          value='${this.value}'
          placeholder='${this.placeholder}'
        />
      </label>
      <div id='loader' aria-live='polite'>
        ${this.controller.isLoading()}
      </div>
      <div id='error-container' aria-live='polite'>
        ${this.controller.errors()}
      </div>
    `
  }
}

customElements.define('form-input', FormInput)
