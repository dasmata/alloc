import FormController from '../../controller/FormController';
import di from '../../DI';
import HttpResponseError from '../../errors/HttpResponseError';
import ObservableController from '../../controller/ObservableController';
import messageDirective from '../../directives/MessageDirective';

export default class LoginController {
  constructor(host){
    host.addController(this)
    this.formController = new FormController(host, this.handleSubmit);
    this.observable = new ObservableController();
    di('identity').then(service => this.identityService = service);
    this.abort = null;
  }

  handleSubmit = async data => {
    this.observable.notify([])
    const { abort, promise } = this.identityService.auth(data);
    this.abort = abort;
    try {
      await promise;
      this.abort = null;
      const router = await di('router');
      router.redirect(window.history?.state?.redirect ?? 'home')
    } catch (e) {
      this.abort = null;
      const state = [];
      if (e instanceof HttpResponseError) {
        state.push({
          message: 'Invalid username or pass',
          type: 'error'
        });
      } else {
        state.push({
          message: 'Try again later',
          type: 'error'
        });
      }
      this.observable.notify(state)
    }
  }

  hostDisconnected() {
    this.abort && this.abort();
  }

  messages() {
    return messageDirective(this.observable)
  }
}
