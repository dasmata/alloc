import loadingDirective from './LoadingDirective';
import errorDirective from './ErrorDirective';
import di from '../../DI';

export default class FormInputController {
  constructor(host, formController) {
    (this.host = host).addController(this)
    this.loading = false;
    this.error = null;
    this.observers = new Set();
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
    if (this.host.formController) {
      this.host.formController.addInputController(this)
    }
  }

  hostDisconnected() {
    this.events.forEach(evt => evt[0].removeEventListener(evt[1], evt[2]))
    if (this.host.formController) {
      this.host.formController.removeInputController(this)
    }
  }

  setLoading(value) {
    this.loading = value;
    this.notify();
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
    if (!this.error) {
      throw new Error(`No error message defined for "${type}"`);
    }
    this.notify();
  }

  resetError() {
    this.error = null;
    this.notify();
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

  subscribe(callback){
    this.observers.add(callback);
    return () => {
      this.observers.delete(callback);
    };
  }

  notify(){
    this.observers.forEach((observer) => {
      observer(() => ({
        loading: this.loading,
        error: this.error
      }))
    })
  }

  isLoading() {
    return loadingDirective(this);
  }

  errors() {
    return errorDirective(this);
  }
}

