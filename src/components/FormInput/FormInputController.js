import loadingDirective from './LoadingDirective';
import errorDirective from './ErrorDirective';
import di from '../../DI';
import ObservableController from '../../controller/ObservableController';

export default class FormInputController {
  constructor(host) {
    (this.host = host).addController(this)
    this.observable = new ObservableController();
    this.loading = false;
    this.error = null;
    di('validation').then(service => this.validationService = service);
  }

  get data() {
    return {[this.host?.name ?? 'unnamedInput']: this.host?.value };
  }

  hostConnected() {
    this.events = [
      [ this.host.shadowRoot, 'input', this.handleInput ],
      [ this.host.shadowRoot, 'change', this.handleChange ],
      [ this.host, 'blur', this.handleBlur ],
      [ this.host, 'focus', this.handleFocus ],
    ]
    this.events.forEach(evt => evt[0].addEventListener(evt[1], evt[2]))
  }

  hostDisconnected() {
    this.events.forEach(evt => evt[0].removeEventListener(evt[1], evt[2]))
  }

  setLoading(value) {
    this.loading = value;
    const input = this.host.shadowRoot.querySelector('input');
    if(value){
      input.setAttribute('aria-busy', 'true');
    } else {
      input.removeAttribute('aria-busy');
    }
    this.observable.notify(() => ({
      loading: this.loading,
      error: this.error
    }));
  }

  handleInput = (e) => {
    this.error = null;
    this.host.value = e.target.value;
    this.validate(e.type);
  }

  handleChange = (e) => {
    this.host.dispatchEvent(new CustomEvent('change', {bubbles: true, composed: true}));
    this.validate(e.type);
  }

  handleBlur = () => {
    this.validate('change');
  }

  handleFocus = () => {
    this.error && this.resetError()
  }

  setError(type) {
    this.error = this.host.errorMessages ? this.host.errorMessages[type] : null;
    if(this.error){
      const input = this.host.shadowRoot.querySelector('input');
      input.classList.add('error')
      input.setAttribute('aria-invalid', 'true');
    }

    if (!this.error) {
      throw new Error(`No error message defined for "${type}"`);
    }
    this.observable.notify(() => ({
      loading: this.loading,
      error: this.error
    }));
  }

  resetError() {
    this.error = null;
    const input = this.host.shadowRoot.querySelector('input');
    input.classList.remove('error')
    input.removeAttribute('aria-invalid');
    this.observable.notify(() => ({
      loading: this.loading,
      error: this.error
    }));
  }

  async validate(type = 'required') {
    const isEmpty = !(await this.validationService?.empty(this.host.value))
    if(isEmpty === undefined){
      throw new Error('Validation service could not be loaded');
    }
    if (this.host.required && isEmpty) {
      this.setError('required');
      return false;
    }
    if(this.host.validation?.[type] && !isEmpty){
      const result = this.host.validation[type](this.host.value)
      if(typeof result === 'boolean' && !result){
        this.setError(type);
        return false;
      } else if(result instanceof Promise){
        this.setLoading(true)
        return result.then((valid) => {
          this.setLoading(false)
          if(!valid){
            this.setError(type);
            return false;
          }
          return true
        })
      }
    }
    return true;
  }


  isLoading() {
    return loadingDirective(this.observable);
  }

  errors() {
    return errorDirective(this.observable);
  }
}

