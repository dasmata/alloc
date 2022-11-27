import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import {jest, expect as jExpect} from '@jest/globals';

jest.unstable_mockModule('../../src/DI', () => ({
  default: function() {
    return Promise.resolve(validation)
  }
}))
await import('../../src/components/FormInput/FormInput');

const validation ={
  empty: jest.fn(),
  input: jest.fn(),
  change: jest.fn()
}

const errors = {
  'required': 'required error message',
  'input': 'input error message',
  'change': 'input error message'
}

describe('FormInput', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<form-input
      type='text'
      required
      .errorMessages=${errors}
      .validation=${validation}
    >
      <span slot='label'>label</span>
    </form-input>`);
  });

  it('renders an input element with the correct name', async () => {
    const input = element.shadowRoot.querySelector('input');
    element.setAttribute('name', 'test')
    await (new Promise(r => {
      setTimeout(() => {
        expect(input).to.exist
        expect(input.getAttribute('name')).to.be.equal('test')
        r()
      })
    }))
  })

  it('renders the label slot', () => {
    const slot = element.shadowRoot.querySelector('slot[name=label]');
    expect(slot).to.exist
  })

  it('renders the label', () => {
    const slot = element.querySelector('[slot=label]');
    expect(slot).to.exist
    expect(slot.textContent).to.be.equal('label')
  })

  it('validates empty inputs', async () => {
    validation.empty.mockReturnValueOnce(false)
    const input = element.shadowRoot.querySelector('input');
    const label = element.shadowRoot.querySelector('label');
    input.focus()
    input.blur()
    jExpect(validation.empty).toHaveBeenCalledTimes(1)
    await (new Promise((r) => {
      setTimeout(() => {
        expect(label.className).to.include('error')
        const err = element.shadowRoot.querySelector('form-error');
        expect(err).to.exist
        expect(err.getAttribute('message')).to.be.equal(errors.required)
        r()
      }, 500)
    }))
    await expect(element).shadowDom.to.be.accessible();
  })

  it('validates passes empty validation', async () => {
    validation.empty.mockReturnValueOnce(true)
    const input = element.shadowRoot.querySelector('input');
    input.focus()
    input.blur()
    jExpect(validation.empty).toHaveBeenCalledTimes(1)
    await (new Promise((r) => {
      setTimeout(() => {
        expect(input.className).to.not.include('error')
        const err = element.shadowRoot.querySelector('form-error');
        expect(err).to.exist
        expect(err.getAttribute('message')).to.be.equal('')
        r()
      }, 500)
    }))
  })

  it('resets input error', async () => {
    validation.empty.mockReturnValueOnce(false)
    const input = element.shadowRoot.querySelector('input');
    input.focus()
    input.blur()
    await (new Promise((r) => {
      setTimeout(() => {
        input.focus()
        r()
      })
    }));
    await (new Promise((r) => {
      setTimeout(() => {
        expect(input.className).to.not.include('error')
        const err = element.shadowRoot.querySelector('form-error');
        expect(err.getAttribute('message')).to.be.equal('')
        r()
      }, 500)
    }));
    await expect(element).shadowDom.to.be.accessible();
  })

  it('returns input value as form data', () => {
    element.value = 'test value'
    element.setAttribute('name', 'test')
    expect(element.controller.data).to.eql({
      [element.name]: element.value
    })
  })

  it('ads default name for unnamed inputs', () => {
    element.value = 'test value'
    expect(element.controller.data).to.eql({
      'unnamedInput': element.value
    })
  })

  it('validates on input', async () => {
    const input = element.shadowRoot.querySelector('input');
    const label = element.shadowRoot.querySelector('label');
    validation.empty.mockReturnValueOnce(true)
    validation.input.mockReturnValueOnce(false)
    input.value = 'test'
    input.dispatchEvent(new Event('input', {
      bubbles: true,
      cancelable: true
    }))
    return await (new Promise( r => {
      setTimeout(() => {
        jExpect(validation.input).toHaveBeenCalledTimes(1)
        expect(label.className).to.include('error')
        const err = element.shadowRoot.querySelector('form-error');
        expect(err).to.exist
        expect(err.getAttribute('message')).to.be.equal(errors.input)
        r()
      }, 500)
    }))
  })

  it('validates on change', async () => {
    const input = element.shadowRoot.querySelector('input');
    const label = element.shadowRoot.querySelector('label');
    validation.empty.mockReturnValueOnce(true)
    validation.change.mockReturnValueOnce(false)
    input.dispatchEvent(new Event('change', {
      bubbles: true,
      cancelable: true
    }))
    return await (new Promise( r => {
      setTimeout(() => {
        jExpect(validation.change).toHaveBeenCalledTimes(1)
        expect(label.className).to.include('error')
        const err = element.shadowRoot.querySelector('form-error');
        expect(err).to.exist
        expect(err.getAttribute('message')).to.be.equal(errors.change)
        r()
      }, 500)
    }))
  })

  it('validates passes event based validation', async () => {
    const input = element.shadowRoot.querySelector('input');
    validation.empty.mockReturnValueOnce(true)
    validation.change.mockReturnValueOnce(true)
    input.dispatchEvent(new Event('change', {
      bubbles: true,
      cancelable: true
    }))
    return await (new Promise( r => {
      setTimeout(() => {
        jExpect(validation.change).toHaveBeenCalledTimes(1)
        expect(input.className).to.not.include('error')
        const err = element.shadowRoot.querySelector('form-error');
        expect(err).to.exist
        expect(err.getAttribute('message')).to.be.equal('')
        r()
      }, 500)
    }))
  })

  it('displays loader on async validation', async () => {
    const input = element.shadowRoot.querySelector('input');
    const validationPromise = new Promise(r => {
      setTimeout(() => r(false), 1000)
    })
    validation.empty.mockReturnValueOnce(true)
    validation.input.mockReturnValueOnce(validationPromise)
    input.dispatchEvent(new Event('input', {
      bubbles: true,
      cancelable: true
    }))
    const loader = element.shadowRoot.querySelector('spinner-loader');
    expect(loader).to.not.exist
    await (new Promise( r => {
      setTimeout(() => {
        const loader = element.shadowRoot.querySelector('spinner-loader');
        expect(loader).to.exist
        expect(loader.visible).to.be.true
        r()
      }, 500)
    }))
    await expect(element).shadowDom.to.be.accessible();
    await validationPromise;
    await (new Promise( r => {
      setTimeout(() => {
        const loader = element.shadowRoot.querySelector('spinner-loader');
        expect(loader.visible).to.be.false
        r()
      }, 500)
    }))
  })

  it('validates on input async', async () => {
    const input = element.shadowRoot.querySelector('input');
    const label = element.shadowRoot.querySelector('label');
    const validationPromise = new Promise(r => {
      setTimeout(() => r(false), 1000)
    })
    validation.empty.mockReturnValueOnce(true)
    validation.input.mockReturnValueOnce(validationPromise)
    input.dispatchEvent(new Event('input', {
      bubbles: true,
      cancelable: true
    }))
    await validationPromise;
    await (new Promise( r => {
      setTimeout(() => {
        jExpect(validation.input).toHaveBeenCalledTimes(1)
        expect(label.className).to.include('error')
        const err = element.shadowRoot.querySelector('form-error');
        expect(err).to.exist
        expect(err.getAttribute('message')).to.be.equal(errors.input)
        r()
      }, 500)
    }))
  })

  it('validates on change async', async () => {
    const input = element.shadowRoot.querySelector('input');
    const label = element.shadowRoot.querySelector('label');
    const validationPromise = new Promise(r => {
      setTimeout(() => r(false), 1000)
    })
    validation.empty.mockReturnValueOnce(true)
    validation.change.mockReturnValueOnce(validationPromise)
    input.dispatchEvent(new Event('change', {
      bubbles: true,
      cancelable: true
    }))
    await validationPromise;
    await (new Promise( r => {
      setTimeout(() => {
        jExpect(validation.change).toHaveBeenCalledTimes(1)
        expect(label.className).to.include('error')
        const err = element.shadowRoot.querySelector('form-error');
        expect(err).to.exist
        expect(err.getAttribute('message')).to.be.equal(errors.change)
        r()
      }, 500)
    }))
  })

  it('validates passes event based validation async', async () => {
    const input = element.shadowRoot.querySelector('input');
    const validationPromise = new Promise(r => {
      setTimeout(() => r(true), 1000)
    })
    validation.empty.mockReturnValueOnce(true)
    validation.change.mockReturnValueOnce(validationPromise)
    input.dispatchEvent(new Event('change', {
      bubbles: true,
      cancelable: true
    }))
    await validationPromise;
    await (new Promise( r => {
      setTimeout(() => {
        jExpect(validation.change).toHaveBeenCalledTimes(1)
        expect(input.className).to.not.include('error')
        const err = element.shadowRoot.querySelector('form-error');
        expect(err).to.exist
        expect(err.getAttribute('message')).to.be.equal('')
        r()
      }, 500)
    }))
  })

  it('returns input value as form data', () => {
    element.value = 'test value'
    element.setAttribute('name', 'test')
    expect(element.controller.data).to.eql({
      [element.name]: element.value
    })
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
