export default class FormController {
  constructor(host, submitHandler) {
    (this.host = host).addController(this);
    this.inputs = new Set();
    this.submitBtns = new Set();
    this.submitHandler = submitHandler;
  }

  hostConnected() {
    this.host.shadowRoot.addEventListener('submit', this.handleSubmit)
  }

  hostDisconnected() {
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
        this.inputs.add(input);
      }
    });
    this.host.shadowRoot.querySelector('[type=submit]') || (() => {
      const btn = document.createElement('input');
      btn.setAttribute('type', 'submit')
      btn.style.display = 'none';
      this.host.shadowRoot.querySelector('form')?.appendChild(btn);
      return btn;
    })()
  }


  async validate(){
    const results = await Promise.all(Array.from(this.inputs).map(inputController => inputController.controller.validate('change')));
    return Boolean(results.reduce((acc, result) => acc & result, 1));
  }

  addInputController(inputController) {
    this.inputs.add(inputController)
  }

  removeInputController(inputController) {
    this.inputs.remove(inputController)
  }

  handleSubmit = async e => {
    e.preventDefault();
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
}
