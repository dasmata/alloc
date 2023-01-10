import {LitElement, html, css} from 'lit';
import { until } from 'lit/directives/until.js';
import './pages/Login/LoginPage'
import di from './DI'

class AllocApp extends LitElement {
  static get styles() {
    return css`
      :host {
        background-color: var(--color-base-white-100);
      }
    `;
  }
  static get properties() {
    return {
      title: { type: String },
      pageElement: { type: HTMLElement}
    };
  }

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    di().init(this)
    const router = await di('router');
    router.init()
  }

  /*** WebComponents lifecycle ***/
  // disconnectedCallback
  // attributeChangeCallback
  // adoptedCallback

  /*** LitElement lifecycle ***/
  // hasChanged()
  // requestUpdate()
  // performUpdate()
  // shouldUpdate()
  // willUpdate()
  // update()
  // render()
  // firstUpdated()
  // updated()

  // updateComplete Promise
  // scheduleUpdate

  render() {
    return html`${
      until(this.pageElement, html`<div>Loading...</div>`)
    }`;
  }
}

customElements.define('alloc-app', AllocApp);
