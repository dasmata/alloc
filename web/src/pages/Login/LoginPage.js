import {css, html, LitElement} from 'lit';
import di from '../../DI'
import '../../components/FormInput/FormInput';
import '../../components/ButtonComponent/ButtonComponent';
import '../../components/ToastMessage/ToastMessage';
import LoginController from './LoginController';

class LoginPage extends LitElement {
  static get styles(){
    return css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      main {
        width: 30vw;
        border: var(--size-border-primary-width) solid var(--color-border-black);
        border-radius: 30px;
        box-shadow: 5px 5px var(--color-base-black);
        padding: var(--size-padding-large);
        text-align: center;
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
          label="Username"
        >
        </form-input>
        <form-input
          name='password'
          type='password'
          .errorMessages=${{
            required: 'This field is required'
          }}
          required
          label="Password"
        >
        </form-input>
        <div>
          <button-component label="Login"></button-component>
        </div>
      </form>
    </main>`
  }
}

customElements.define('login-page', LoginPage);
