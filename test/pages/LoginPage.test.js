import {expect, fixture} from '@open-wc/testing';
import {jest, expect as jExpect} from '@jest/globals';
import { html } from 'lit';
import HttpResponseError from '../../src/errors/HttpResponseError.js';

const emptyValidation = jest.fn();
const emailValidation = jest.fn();
const authMethod = jest.fn();
const redirectMethod = jest.fn();
const di = jest.fn().mockImplementation(name => {
  switch(name){
    case 'validation':
      return Promise.resolve({
        empty: emptyValidation,
        email: emailValidation
      })
    case 'identity':
      return Promise.resolve({
        auth: authMethod,
      })
    case 'router':
      return Promise.resolve({
        redirect: redirectMethod
    })
    default:
      return Promise.resolve({})
  }
});

jest.unstable_mockModule('../../src/DI', () => ({
  default: di
}))
await import('../../src/pages/Login/LoginPage.js');

describe('LoginPage', () => {
  let page;
  beforeEach(async () => {
    page = await fixture(html`<login-page></login-page>`)
  })


  it('renders the login form', () => {
    expect(page.shadowRoot.querySelector('form')).to.exist
    const inputs = page.shadowRoot.querySelectorAll('form-input');
    expect(inputs).to.have.length(2)
    expect(inputs[0].name).to.be.equal('username')
    expect(inputs[1].name).to.be.equal('password')
  })

  it('requires username', () => {
    const input = page.shadowRoot.querySelector('form-input[name=username]');
    expect(input.required).to.be.true
  })

  it('validates email on change', () => {
    const input = page.shadowRoot.querySelector('form-input[name=username]');
    expect(input.validation?.change).to.exist
    input.validation?.change('test')
    jExpect(emailValidation).toHaveBeenCalledTimes(1)
    jExpect(emailValidation).toHaveBeenCalledWith('test')
  })

  it('requires password', () => {
    const input = page.shadowRoot.querySelector('form-input[name=password]');
    expect(input.required).to.be.true
  })

  it('calls authService on submit', async () => {
    emptyValidation.mockReturnValue(true);
    emailValidation.mockReturnValue(true);
    authMethod.mockReturnValue({
      abort: jest.fn(),
      promise: Promise.reject()
    });
    page.shadowRoot.querySelector('form').submit()
    await(new Promise(r => {
      setTimeout(() => {
        jExpect(authMethod).toHaveBeenCalledTimes(1)
        jExpect(authMethod).toHaveBeenCalledWith({
          'username': '',
          'password': ''
        })
        r()
      })
    }))
  })

  it('displays toast message on login http error', async () => {
    emptyValidation.mockReturnValue(true);
    emailValidation.mockReturnValue(true);
    authMethod.mockReturnValue({
      abort: jest.fn(),
      promise: Promise.reject()
    });
    page.shadowRoot.querySelector('form').submit()
    await(new Promise(r => {
      setTimeout(async () => {
        const msg = page.shadowRoot.querySelector('toast-message[type=error]');
        expect(msg).to.exist;
        expect(msg.visible).to.be.true;
        r();
      }, 500);
    }))
  })

  it('displays toast message on invalid credentials', async () => {
    emptyValidation.mockReturnValue(true);
    emailValidation.mockReturnValue(true);
    authMethod.mockReturnValue({
      abort: jest.fn(),
      promise: Promise.reject(new HttpResponseError())
    });
    page.shadowRoot.querySelector('form').submit()
    await(new Promise(r => {
      setTimeout(async () => {
        const msg = page.shadowRoot.querySelector('toast-message[type=error]');
        expect(msg).to.exist;
        expect(msg.visible).to.be.true;
        r();
      }, 500);
    }))
  })

  it('redirects on login success', async () => {
    emptyValidation.mockReturnValue(true);
    emailValidation.mockReturnValue(true);
    authMethod.mockReturnValue({
      abort: jest.fn(),
      promise: Promise.resolve({})
    });
    page.shadowRoot.querySelector('form').submit()
    await(new Promise(r => {
      setTimeout(async () => {
        jExpect(redirectMethod).toHaveBeenCalledTimes(1)
        r();
      }, 500);
    }))
  })
});
