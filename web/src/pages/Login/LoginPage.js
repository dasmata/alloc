import {css, html, LitElement} from 'lit';
import di from '../../DI'
import '../../components/FormInput/FormInput';
import '../../components/ButtonComponent/ButtonComponent';
import '../../components/ToastMessage/ToastMessage';
import LoginController from './LoginController';

class LoginPage extends LitElement {
  static get styles(){
    return css`
      :host{
        width: 30vw;
        border-radius: var(--border-radius-100);
        box-shadow: 0 var(--size-unit) var(--size-4x) var(--shadow-color-black-normal);
        padding: var(--size-15x);
        text-align: center;
        background-color: var(--color-base-white-200)
      }
    `
  }
  constructor() {
    super();
    this.controller = new LoginController(this)
    di('validation').then(service => this.validationService = service);
  }

  render() {
    return html`<main>
      ${this.controller.messages()}
      <form action='/login' method='post'>
        <form-input
          name='username'
          type='email'
          placeholder='ex: john.doe@softvision.com'
          .errorMessages=${{
            required: 'This field is required',
            change: 'Invalid email address'
          }}
          .validation=${{
            change: v => this.validationService.email(v)
          }}
          required
        >
          <span slot='label'>Username</span>
        </form-input>
        <form-input
          name='password'
          type='password'
          .errorMessages=${{
            required: 'This field is required'
          }}
          required
        >
          <span slot='label'>Password</span>
        </form-input>
        <div>
          <button-component>
            <span slot='label'>Login</span>
          </button-component>
        </div>
      </form>
    </main>`
  }
}

customElements.define('login-page', LoginPage);
