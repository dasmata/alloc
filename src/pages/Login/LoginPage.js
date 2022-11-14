import { html } from 'lit';
import {GenericPage} from '../GenericPage';
import di from '../../DI'
import '../../components/FormInput/FormInput';
import '../../components/ButtonComponent/ButtonComponent';
import LoginController from './LoginController';

class LoginPage extends GenericPage {

  constructor() {
    super();
    const controller = new LoginController(this)
    this._formController = controller.formController
    di('validation').then(service => this.validationService = service);
  }

  render() {
    return html`<main>
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
          .formController=${this._formController}
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
          .formController=${this._formController}
        >
          <span slot='label'>Password</span>
        </form-input>
        <div>
          <button>Login</button>
        </div>
      </form>
    </main>`
  }
}

customElements.define('login-page', LoginPage);
