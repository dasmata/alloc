export default class FormController {
  constructor(host, submitHandler) {
    (this.host = host).addController(this);
    this.inputs = new Set();
    this.submitBtns = new Set();
    this.submitHandler = submitHandler;
    this.blocked = false;
  }

  hostConnected() {
    this.host.shadowRoot.addEventListener('submit', this.handleSubmit)
  }

  hostDisconnected() {
    this.inputs.forEach(el => el.removeEventListener('keypress', this.handleKeypress))
    this.inputs.clear();
    this.submitBtns.clear();
    this.host.shadowRoot.removeEventListener('submit', this.handleSubmit)
    this.submitBtns.forEach(btn => btn.removeEventListener('click', this.handleSubmit))
  }

  hostUpdated(){
    this.host.shadowRoot.querySelectorAll('button-component').forEach(btn => {
      if (!this.submitBtns.has(btn)) {
        this.submitBtns.add(btn);
        btn.addEventListener('click', this.handleSubmit)
      }
    });
    this.host.shadowRoot.querySelectorAll('form-input').forEach(input => {
      if (!this.inputs.has(input)) {
        input.addEventListener('keypress', this.handleKeypress)
        this.inputs.add(input);
      }
    });
  }


  async validate(){
    const results = await Promise.all(Array.from(this.inputs).map(inputController => inputController.controller.validate('change')));
    return Boolean(results.reduce((acc, result) => acc & result, 1));
  }

  handleKeypress = async e => {
    if(e.key === 'Enter'){
      this.host.shadowRoot.dispatchEvent(new Event('submit', {
        bubbles: true,
        cancelable: true
      }))
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    if(this.blocked){
      return;
    }
    const valid = await this.validate();
    if (!valid) {
      return;
    }
    const data = {}
    this.inputs.forEach(el => {
      Object.assign(data, el.controller.data)
    });
    this.submitHandler(data)
  }

  blockForm() {
    this.blocked = true;
    this.submitBtns.forEach(btn => btn.disabled = true)
  }

  releaseForm() {
    this.blocked = false;
    this.submitBtns.forEach(btn => btn.disabled = false)
  }
}
