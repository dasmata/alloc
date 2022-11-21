import { html, LitElement } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { jest, expect as jExpect } from '@jest/globals';

const emptyValidation = jest.fn();
const di = jest.fn().mockImplementation(name => {
  switch(name){
    case 'validation':
      return Promise.resolve({ empty: emptyValidation })
    default:
    {}
  }
});

jest.unstable_mockModule('../../src/DI', () => ({
  default: di
}));
const formControllerModule = await import('../../src/controller/FormController.js');
await import('../../src/components/FormInput/FormInput.js');
await import('../../src/components/ButtonComponent/ButtonComponent.js');

describe('FormController', () => {
  let element;
  const submitHandler = jest.fn()

  class MockForm extends LitElement {
    constructor() {
      super();
       new formControllerModule.default(this, submitHandler)
    }

    render(){
      return html`<form>
      <form-input name='test' type='text' .errorMessages=${{ required: 'aa' }}></form-input>
      <button-component><span slot='label'>submit</span></button-component>
    </form>`
    }
  }
  customElements.define('mock-form', MockForm);

  const submitForm = () => {
    const btn = element.shadowRoot.querySelector('button-component');
    btn.dispatchEvent(new Event('click', {
      bubbles: true,
      cancelable: true
    }))
  }

  beforeEach(async () => {
    element = await fixture(html`<mock-form></mock-form>`);
  })

  it('submits the form on button click', async () => {
    element.shadowRoot.querySelector('form-input').value = 'test';
    submitForm();
    await (new Promise(r => setTimeout(() => {
      jExpect(submitHandler).toHaveBeenCalledTimes(1);
      jExpect(submitHandler).toHaveBeenCalledWith({test: 'test'});
      r();
    }, 500)))
  });

  it('submits the form on enter', async () => {
    const input = element.shadowRoot.querySelector('form-input');
    input.dispatchEvent(new KeyboardEvent('keypress', {
      key: 'Enter'
    }));
    await (new Promise(r => setTimeout(() => {
      jExpect(submitHandler).toHaveBeenCalledTimes(1);
      r();
    }, 500)))
  });

  it('calls validation on submit', async () => {
    emptyValidation.mockReturnValueOnce(true)
    submitForm();
    await (new Promise(r => setTimeout(() => {
      jExpect(emptyValidation).toHaveBeenCalledTimes(1);
      r()
    }, 500)))
  });

  it('prevents submit on invalid form', async () => {
    emptyValidation.mockReturnValueOnce(false)
    element.shadowRoot.querySelector('form-input').required = true;
    submitForm();
    await (new Promise(r => setTimeout(() => {
      jExpect(submitHandler).not.toHaveBeenCalled();
      r()
    }, 500)))
  });
});
