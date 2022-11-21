import ObserverDirective from '../utils/ObserverDirective';
import { html } from 'lit';
import { directive } from 'lit/async-directive.js';
import '../components/ToastMessage/ToastMessage'
import { map } from 'lit/directives/map.js';

class MessageDirective extends ObserverDirective {
  callback(value) {
    this.setValue(html`<span>
      ${map(value, el => html`<toast-message ?visible='${true}' type=${el.type} message='${el.message}'></toast-message>`)}
    </span>`)
  }
}

const messageDirective = directive(MessageDirective)

export default messageDirective
