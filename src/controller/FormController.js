export default class FormController {
  constructor(host, submitHandler) {
    (this.host = host).addController(this)
    this.inputs = new Set()
    this.submitHandler = submitHandler;
  }


  hostConnected() {
    this.host.shadowRoot.addEventListener('submit', this.handleSubmit)
  }

  hostDisconnected() {
    this.inputs.clear();
    this.host.shadowRoot.removeEventListener('submit', this.handleSubmit)
  }

  async validate(){
    const results = await Promise.all(Array.from(this.inputs).map(inputController => inputController.validate('change')));
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
      Object.assign(data, el.data)
    });
    this.submitHandler(data)
  }
}
