import ObserverDirective from '../../utils/ObserverDirective';
import { html } from 'lit';
import { directive } from 'lit/async-directive.js';

class ErrorDirective extends ObserverDirective {
  render(observable){
    super.render(observable)
    return html`<form-error message=${null}></form-error>`;
  }

  callback(value) {
    this.setValue(html`<form-error message=${value.error}></form-error>`)
  }
}

const errorDirective = directive(ErrorDirective)

export default errorDirective
