import ObserverDirective from '../../utils/ObserverDirective';
import { html } from 'lit';
import { directive } from 'lit/async-directive.js';

class LoadingDirective extends ObserverDirective {
  callback(value) {
    this.setValue(html`<spinner-loader ?visible=${value.loading}></spinner-loader>`)
  }
}

const loadingDirective = directive(LoadingDirective)

export default loadingDirective
