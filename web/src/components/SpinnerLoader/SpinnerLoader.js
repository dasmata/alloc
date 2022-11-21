import { html, LitElement } from 'lit';

class SpinnerLoader extends LitElement {

  static get properties(){
    return {
      visible: {type: Boolean, attribute: true}
    }
  }

  render() {
      return this.visible ? html`<div>Loading...</div>` : null
  }
}

customElements.define('spinner-loader', SpinnerLoader)
