import { html } from 'lit';
import {GenericPage} from '../GenericPage';
import di from '../../DI'
import '../../components/FormInput/FormInput';
import '../../components/ButtonComponent/ButtonComponent';
import '../../components/ToastMessage/ToastMessage';
import LoginController from './LoginController';

class LoginPage extends GenericPage {

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
