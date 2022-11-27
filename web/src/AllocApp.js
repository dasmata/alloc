import {LitElement, html, css} from 'lit';
import { until } from 'lit/directives/until.js';
import './pages/Login/LoginPage'
import di from './DI'

class AllocApp extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
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
    this.title = 'My app';
  }

  setPage(pageElement){
    this.pageElement = pageElement;
  }

  async connectedCallback() {
    super.connectedCallback();
    di().init(this)
    const router = await di('router');
    router.init()
  }

  render() {
    return html`${until(this.pageElement, html`<div>Loading...</div>`)}`
    ;
  }
}

customElements.define('alloc-app', AllocApp);
