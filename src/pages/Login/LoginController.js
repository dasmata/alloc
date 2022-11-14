import FormController from '../../controller/FormController';
import di from '../../DI';
import HttpResponseError from '../../errors/HttpResponseError';

export default class LoginController {
  constructor(host){
    host.addController(this)
    this.formController = new FormController(host, this.handleSubmit);
    di('identity').then(service => this.identityService = service);
  }

  handleSubmit = async data => {
    const { abort, promise } = this.identityService.auth(data);
    try {
      const user = await promise;
    } catch (e) {
      if (e instanceof HttpResponseError) {
        alert('Invalid username or pass')
      } else {
        alert('Try again later')
      }
    }
  }
}
