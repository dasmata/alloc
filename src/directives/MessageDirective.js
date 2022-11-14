import ObserverDirective from '../utils/ObserverDirective';
import { html } from 'lit';
import { directive } from 'lit/async-directive.js';
import '../components/ToastMessage/ToastMessage'

class MessageDirective extends ObserverDirective {
  callback(value) {
    this.setValue(html`<span>
      <toast-message ?visible='${true}' message='${value.error}'></toast-message>
    </span>`)
  }
}

const messageDirective = directive(MessageDirective)

export default messageDirective
